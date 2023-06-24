const { poolPromise } = require('../utility/database');
const { QUERIES } = require('../queries/index');
const { DASHBOARD_QUERIES } = require('../queries/dashboard');

const moduleName = 'MarketingDashboard';
const months = [{ id: 1, value: 'Januari' },
  { id: 2, value: 'Februari' },
  { id: 3, value: 'Maret' },
  { id: 4, value: 'April' },
  { id: 5, value: 'Mei' },
  { id: 6, value: 'Juni' },
  { id: 7, value: 'Juli' },
  { id: 8, value: 'Agustus' },
  { id: 9, value: 'September' },
  { id: 10, value: 'Oktober' },
  { id: 11, value: 'November' },
  { id: 12, value: 'Desember' }
];

const getKolOverview = async () => {
  try {
    const pool = await poolPromise;
    const { recordset: activeKol } = await pool.request().query(QUERIES.GET_NUMBER_OF_ACTIVE_KOL);
    const { recordset: slotLeft } = await pool.request()
      .query(QUERIES.GET_NUMBER_OF_AVAILABLE_SLOT);

    const { numberOfActiveKol } = activeKol[0];
    const { totalSlotLeft } = slotLeft[0];
    const message = { numberOfActiveKol, totalSlotLeft };

    return { status: true, message };
  } catch (error) {
    console.log(`error ${moduleName}-getKolOverview:`, error);

    return { status: false, error: error.response.status };
  }
};

const getSlotUsagePerYear = async (year) => {
  try {
    const pool = await poolPromise;
    const { recordset: plannedSlot } = await pool.request().input('year', year).query(QUERIES.GET_PLANNED_SLOT_PER_YEAR);
    const { recordset: usedSlot } = await pool.request().input('year', year).query(QUERIES.GET_USED_SLOT_PER_YEAR);

    console.log(plannedSlot, usedSlot);
    const monthLabel = [];
    const planned = [];
    const used = [];

    months.forEach((item) => {
      const { id, value } = item;
      const monthPlannedSlot = plannedSlot.find((data) => data.month === id);
      const totalSlotAvailable = monthPlannedSlot ? monthPlannedSlot.totalSlotAvailable : 0;
      const monthUsedSlot = usedSlot.find((data) => data.month === id);
      const totalSlotUsed = monthUsedSlot ? monthUsedSlot.totalSlotUsed : 0;

      if (!(totalSlotAvailable === 0 && totalSlotUsed === 0)) {
        monthLabel.push(value);
        planned.push(totalSlotAvailable);
        used.push(totalSlotUsed);
      }
    });

    return {
      status: true,
      message: { monthLabel, planned, used }
    };
  } catch (error) {
    console.log(`error ${moduleName}-getSlotUsagePerYear:`, error);

    return { status: false, error: error.response.status };
  }
};

const getMonthlyPostOverview = async (month, year) => {
  try {
    const pool = await poolPromise;
    const { recordset: [numberOfPost] } = await pool.request().input('year', year).input('month', month).query(QUERIES.GET_NUMBER_OF_POSTS_OF_THE_MONTH);
    const { recordset: [numberPostToBeFollowedUp] } = await pool.request().input('year', year).input('month', month).query(QUERIES.GET_NUMBER_OF_POSTS_TO_BE_FOLLOWED_UP);

    return {
      status: true,
      message: { numberOfPost, numberPostToBeFollowedUp }
    };
  } catch (error) {
    console.log(`error ${moduleName}-getMonthlyPostOverview:`, error);

    return { status: false, error: error.response.status };
  }
};

const getTotalViewsByYearAndManager = async (year, managerId) => {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool.request().input('year', year).input('managerId', managerId).query(DASHBOARD_QUERIES.GET_TOTAL_VIEWS_BY_YEAR_AND_MANAGER);

    const views = [];
    const monthLabel = [];
    recordset.forEach((item) => {
      const { month, totalViews } = item;
      const monthString = months.find(({ id }) => id === month);
      views.push(totalViews);
      monthLabel.push(monthString.value);
    });

    return {
      status: true,
      message: { totalViews: views, month: monthLabel }
    };
  } catch (error) {
    console.log(`error ${moduleName}-getMonthlyPostOverview:`, error);

    return { status: false, error: error.response.status };
  }
};

const getPostReminder = async (managerId) => {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool.request().input('managerId', managerId).query(DASHBOARD_QUERIES.GET_FOLLOWED_UP_POSTS);

    return {
      status: true,
      message: recordset
    };
  } catch (error) {
    console.log(`error ${moduleName}-getMonthlyPostOverview:`, error);

    return { status: false, error: error.response.status };
  }
};

const getTotalViewsPerCategory = async (managerId, startDate, endDate) => {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool.request()
      .input('managerId', managerId)
      .input('startDate', startDate)
      .input('endDate', endDate)
      .query(DASHBOARD_QUERIES.GET_TOTAL_VIEWS_PER_CATEGORY_ALL_TIME);

    const views = [];
    const label = [];
    const usage = [];
    recordset.forEach((item) => {
      const { category, totalViews, totalUsage } = item;

      views.push(totalViews);
      label.push(category);
      usage.push(totalUsage);
    });
    return {
      status: true,
      message: { totalViews: views, totalUsage: usage, label }
    };
  } catch (error) {
    console.log(`error ${moduleName}-getMonthlyPostOverview:`, error);

    return { status: false, error: error.response.status };
  }
};

const _convertToMonthYearLabel = (yearMonthString) => {
  const [year, month] = yearMonthString.split('-');
  const convertedMonth = parseInt(month, 10) - 1;
  return `${months[convertedMonth].value} ${year}`;
};

const getFypByManager = async (managerId, startDate, endDate) => {
  try {
    const pool = await poolPromise;
    const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
    const startYear = startDate.getFullYear();
    const convertedStart = `${startYear}-${startMonth}`;
    const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
    const endYear = endDate.getFullYear();
    const convertedEnd = `${endYear}-${endMonth}`;
    const { recordset } = await pool.request()
      .input('startDate', convertedStart)
      .input('endDate', convertedEnd)
      .input('managerId', managerId)
      .query(DASHBOARD_QUERIES.GET_FYP_PER_MONTH);

    const fyp = [];
    const monthLabel = [];
    recordset.forEach((item) => {
      const { totalFyp, yearMonth } = item;
      const monthString = _convertToMonthYearLabel(yearMonth);
      fyp.push(totalFyp);
      monthLabel.push(monthString);
    });

    return {
      status: true,
      message: { totalViews: fyp, month: monthLabel }
    };
  } catch (error) {
    console.log(`error ${moduleName}-getMonthlyPostOverview:`, error);

    return { status: false, error: error.response.status };
  }
};

module.exports = {
  getKolOverview,
  getSlotUsagePerYear,
  getMonthlyPostOverview,
  getTotalViewsByYearAndManager,
  getPostReminder,
  getTotalViewsPerCategory,
  getFypByManager
};
