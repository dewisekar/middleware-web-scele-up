const { sql, execQuery, poolPromise } = require("../utility/database");

const getRekapPengirimanByMonth = async (req) => {
  let resp = { status: "false" };
  let dataExcel = [];
  let dataERP = [];
  let dataTerprint = [];
  let dataTerKirim = [];
  let dataTanggal = [];

  try {
    let month = req.Month;
    let query =
      "SELECT [TOTAL_FROM_EXCEL] FROM [dbo].[REKAP_DAILY_PENGIRIMAN] WITH(NOLOCK) WHERE SUBSTRING(TANGGAL,1,6) = '" +
      month +
      "';";

    const pool = await poolPromise;
    let result = await pool.request().query(query);
    //const result = await pool.request().input();
    //  let result = await pool.request().execute("SP_AuthorizeUsername");
    console.log(result.recordset);
    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length >= 1) {
        result.recordset.forEach((element) =>
          dataExcel.push(element["TOTAL_FROM_EXCEL"])
        );
      }
    }

    query =
      "SELECT [TOTAL_IN_ERP] FROM [dbo].[REKAP_DAILY_PENGIRIMAN] WITH(NOLOCK) WHERE SUBSTRING(TANGGAL,1,6) = '" +
      month +
      "';";
    result = await pool.request().query(query);
    console.log(result.recordset);
    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length >= 1) {
        result.recordset.forEach((element) =>
          dataERP.push(element["TOTAL_IN_ERP"])
        );
      }
    }

    query =
      "SELECT [TOTAL_TERPRINT] FROM [dbo].[REKAP_DAILY_PENGIRIMAN] WITH(NOLOCK) WHERE SUBSTRING(TANGGAL,1,6) = '" +
      month +
      "';";
    result = await pool.request().query(query);
    console.log(result.recordset);
    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length >= 1) {
        result.recordset.forEach((element) =>
          dataTerprint.push(element["TOTAL_TERPRINT"])
        );
      }
    }

    query =
      "SELECT [TOTAL_TERKIRIM] FROM [dbo].[REKAP_DAILY_PENGIRIMAN] WITH(NOLOCK) WHERE SUBSTRING(TANGGAL,1,6) = '" +
      month +
      "';";
    result = await pool.request().query(query);
    console.log(result.recordset);
    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length >= 1) {
        result.recordset.forEach((element) =>
          dataTerKirim.push(element["TOTAL_TERKIRIM"])
        );
      }
    }

    query =
      "SELECT [TANGGAL] FROM [dbo].[REKAP_DAILY_PENGIRIMAN] WITH(NOLOCK) WHERE SUBSTRING(TANGGAL,1,6) = '" +
      month +
      "';";
    result = await pool.request().query(query);
    console.log(result.recordset);
    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length >= 1) {
        result.recordset.forEach((element) =>
          dataTanggal.push(element["TANGGAL"])
        );
      }
    }

    resp.TOTAL_IN_ERP = dataERP;
    resp.TOTAL_TERPRINT = dataERP;
    resp.TOTAL_TERKIRIM = dataTerKirim;
    resp.TANGGAL = dataTanggal;
    resp.TOTAL_FROM_EXCEL = dataExcel;
    resp.status = "true";
  } catch (err) {
    console.log("got exception in getRekapPengirimanByMonth :", err);
  }
  return resp;
};

module.exports = {
  getRekapPengirimanByMonth,
};
