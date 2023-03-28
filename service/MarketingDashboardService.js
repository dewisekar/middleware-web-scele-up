const { poolPromise } = require('../utility/database');
const { QUERIES } = require('../queries/index');

const moduleName = 'MarketingDashboard';

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

module.exports = {
  getKolOverview
};
