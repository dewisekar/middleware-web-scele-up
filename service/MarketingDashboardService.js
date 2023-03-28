const axios = require('axios');

const { JSDOM } = jsdom;
const { poolPromise } = require('../utility/database');
const { TIKTOK_QUERIES } = require('../queries/tiktok');

const fetchKolListing = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(TIKTOK_QUERIES.FETCH_KOL_LISTING);
    const { recordset } = result;

    return {
      status: true,
      message: recordset
    };
  } catch (error) {
    console.log('error fetchKolListing" ', error);
    return { status: false, error: error.response.status };
  }
};

module.exports = {
  fetchKolListing
};
