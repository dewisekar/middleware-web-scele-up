const { poolPromise } = require('../utility/database');
const { QUERIES } = require('../queries/index');

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
    console.log(`error ${moduleName}-getKolOverview:`, error);

    return { status: false, error: error.response.status };
  }
};

module.exports = {
  getKolOverview,
  getSlotUsagePerYear
};
