const express = require('express');
const req = require('express/lib/request');
// const router = express.Router();
const { sql, execQuery, poolPromise } = require('../utility/database');

/* router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().input("input_parameter", sql.VarChar, req.body.Username).query("SELECT TOP(1) * FROM dbo.USERS WITH(NOLOCK) WHERE USERNAME = @input_parameter");

    res.json(result.recordset);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
}); */

const validateUsername = async (req) => {
  const resp = { status: 'false' };
  try {
    const username = req.Username;
    const companyId = req.Company;
    const password = req.Password;
    const pool = await poolPromise;

    // console.log(username);
    // let myquery = "SELECT TOP(1) * FROM dbo.USERS WITH(NOLOCK) WHERE USERNAME = '" + username + "' AND COMPANY_ID ='" + companyId + "';";
    // const result = await pool.request().query(myquery);

    const result = await pool
      .request()
      .input('USERNAME', username)
      .input('COMPANY_ID', companyId)
      .input('PASSWORD', password)
      .execute('SP_AuthorizeUsername');
    // const result = await pool.request().input();
    //  let result = await pool.request().execute("SP_AuthorizeUsername");
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length == 1) {
        resp.status = 'true';
        resp.LEVEL_ID = result.recordset[0].LEVEL_ID;
      }
    }

    // console.log(resp);
    return resp;
    // res.json(result.recordset);
  } catch (err) {
    console.error(err);
    // res.status(500);
    // res.send(err.message);
    return resp;
  }
};

const isExistDailyFile = async (req) => {
  const resp = { status: 'false' };
  try {
    const filename = req.Filename;
    const channel = req.Channel;
    const isMarketplace = req.IsMarketplace;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('FILENAME', filename)
      .input('CHANNEL', channel)
      .input('ISMARKETPLACE', isMarketplace)
      .execute('SP_CheckExistDailyFile');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length == 1) {
        resp.status = 'true';
        resp.FILENAME = result.recordset[0].FILENAME;
        resp.UPLOADDATE = result.recordset[0].UPLOADDATE;
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const isExistFileResi = async (req) => {
  const resp = { status: 'false' };
  try {
    const filename = req.Filename;
    const channel = req.Channel;
    const isMarketplace = req.IsMarketplace;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('FILENAME', filename)
      .input('CHANNEL', channel)
      .input('ISMARKETPLACE', isMarketplace)
      .execute('SP_CheckExistDailyFileResi');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length == 1) {
        resp.status = 'true';
        resp.FILENAME = result.recordset[0].FILENAME;
        resp.UPLOADDATE = result.recordset[0].UPLOADDATE;
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const GetJournalJualByDate = async (req) => {
  const resp = { status: 'false' };
  try {
    const uploadDate = req.Date;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('UPLOADDATE', uploadDate)
      .execute('SP_GetJournalJualByDate');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
        resp.message = result.recordset;
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const GetDailyFile = async (req) => {
  const resp = { status: 'false' };
  try {
    const startDate = req.StartDate;
    const endDate = req.EndDate;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('STARTDATE', startDate)
      .input('ENDDATE', endDate)
      .execute('SP_GetDailyFileTrx');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
        resp.message = result.recordset;
      }
    }

    // console.log(resp);
    return resp;
    // res.json(result.recordset);
  } catch (err) {
    console.error(err);
    // res.status(500);
    // res.send(err.message);
    return resp;
  }
};

const GetFileResi = async (req) => {
  const resp = { status: 'false' };
  try {
    const startDate = req.StartDate;
    const endDate = req.EndDate;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('STARTDATE', startDate)
      .input('ENDDATE', endDate)
      .execute('SP_GetFileResi');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
        resp.message = result.recordset;
      }
    }

    // console.log(resp);
    return resp;
    // res.json(result.recordset);
  } catch (err) {
    console.error(err);
    // res.status(500);
    // res.send(err.message);
    return resp;
  }
};

const GetTop100JournalJualToday = async () => {
  const resp = { status: 'false' };
  try {
    const pool = await poolPromise;

    const result = await pool.request().execute('SP_GetTop100JournalJualToday');

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
        resp.message = result.recordset;
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const GetFormatJournalJual = async () => {
  const resp = { status: 'false' };
  try {
    const pool = await poolPromise;
    const result = await pool.request().execute('SP_GetFormatJournalJual');

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
        resp.message = result.recordset;
      }
    }
    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const insertDailyFile = async (req) => {
  const resp = { status: 'false' };
  try {
    const filename = req.Filename;
    const channel = req.Channel;
    const isMarketplace = req.IsMarketplace;
    const uploadDate = req.Date;
    const totalRows = req.TotalRows;
    const pool = await poolPromise;

    // console.log(username);
    // let myquery = "SELECT TOP(1) * FROM dbo.USERS WITH(NOLOCK) WHERE USERNAME = '" + username + "' AND COMPANY_ID ='" + companyId + "';";
    // const result = await pool.request().query(myquery);
    // console.log(
    //   "FILENAME:",
    //   filename + ",CHANNEL:",
    //   channel + ",ISMARKETPLACE:",
    //   isMarketplace + ",UPLOADDATE:",
    //   uploadDate
    // );
    const result = await pool
      .request()
      .input('FILENAME', filename)
      .input('CHANNEL', channel)
      .input('ISMARKETPLACE', isMarketplace)
      .input('UPLOADDATE', uploadDate)
      .input('TOTALROWS', totalRows)
      .execute('SP_InsertDailyFile');
    // const result = await pool.request().input();
    //  let result = await pool.request().execute("SP_AuthorizeUsername");
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length == 1) {
        if ((result.recordset[0].STATUS = '1')) resp.status = 'true';
        else resp.status = 'false';

        resp.message = result.recordset[0].MESSAGE;
      }
    }

    // console.log(resp);
    return resp;
    // res.json(result.recordset);
  } catch (err) {
    console.error(err);
    // res.status(500);
    // res.send(err.message);
    return resp;
  }
};

const insertDailyFileResi = async (req) => {
  const resp = { status: 'false' };
  try {
    const filename = req.Filename;
    const channel = req.Channel;
    const isMarketplace = req.IsMarketplace;
    const uploadDate = req.Date;
    const totalPages = req.TotalPages;
    const pool = await poolPromise;

    // console.log(username);
    // let myquery = "SELECT TOP(1) * FROM dbo.USERS WITH(NOLOCK) WHERE USERNAME = '" + username + "' AND COMPANY_ID ='" + companyId + "';";
    // const result = await pool.request().query(myquery);
    // console.log(
    //   "FILENAME:",
    //   filename + ",CHANNEL:",
    //   channel + ",ISMARKETPLACE:",
    //   isMarketplace + ",UPLOADDATE:",
    //   uploadDate
    // );
    const result = await pool
      .request()
      .input('FILENAME', filename)
      .input('CHANNEL', channel)
      .input('ISMARKETPLACE', isMarketplace)
      .input('UPLOADDATE', uploadDate)
      .input('TOTALPAGES', totalPages)
      .execute('SP_InsertDailyFileResi');
    // const result = await pool.request().input();
    //  let result = await pool.request().execute("SP_AuthorizeUsername");
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length == 1) {
        if ((result.recordset[0].STATUS = '1')) resp.status = 'true';
        else resp.status = 'false';

        resp.message = result.recordset[0].MESSAGE;
      }
    }

    // console.log(resp);
    return resp;
    // res.json(result.recordset);
  } catch (err) {
    console.error(err);
    // res.status(500);
    // res.send(err.message);
    return resp;
  }
};

const authorizeUsername = (req) => {
  try {
    const query = `SELECT TOP(1) * FROM dbo.USERS WITH(NOLOCK) WHERE USERNAME = '${
      req.username
    }' AND COMPANY_ID ='${
      req.companyId
    }';`;
    const result = execQuery(query);
    console.log(result);
  } catch (err) {
    console.log('Failed to authorize username', err);
  }
};

const CheckAndUpdateResiForScan = async (req) => {
  const resp = { status: 'false' };
  try {
    const invoice = req.Invoice;
    const action = req.Action;
    const date = req.Date;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('INVOICE', invoice)
      .input('ACTION', action)
      .input('DATECHECKED', date)
      .execute('SP_CheckAndUpdateResi');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        if (result.recordset[0].STATUS == 'TRUE') {
          resp.status = 'true';
          console.log('log aja');
        } else {
          resp.message = result.recordset[0].RESPONSE_MESSAGE;
        }
      }
    }
    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const GetKontrolPengirimanByDate = async (req) => {
  const resp = { status: 'false' };
  try {
    const { OdStart } = req;
    const { OdEnd } = req;
    const { PdStart } = req;
    const { PdEnd } = req;
    const { CheckByOd } = req;
    const { CheckByPd } = req;
    const action = req.Action;

    console.log(OdStart, OdEnd, PdStart, PdEnd, CheckByOd, CheckByPd, action);
    // let orderDate = req.OrderDate;
    // let processDate = req.ProcessDate;
    // let action = req.Action;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('ORDERDATESTART', OdStart)
      .input('ORDERDATEEND', OdEnd)
      .input('PROCESSDATESTART', PdStart)
      .input('PROCESSDATEEND', PdEnd)
      .input('CHECKBYORDERDATE', CheckByOd)
      .input('CHECKBYPROCESSDATE', CheckByPd)
      .input('JENISDATA', action)
      .execute('SP_GetKontrolPengirimanByDate');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
        resp.message = result.recordset;
      }
    }
    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const GetFormatTableGeneral = async (req) => {
  const resp = { status: 'false' };
  try {
    const action = req.Action;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('FORMAT', action)
      .execute('SP_GetFormatTableGeneral');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
        resp.message = result.recordset;
      }
    }
    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};
module.exports = {
  authorizeUsername,
  validateUsername,
  isExistDailyFile,
  insertDailyFile,
  GetDailyFile,
  GetFileResi,
  GetTop100JournalJualToday,
  GetJournalJualByDate,
  GetFormatJournalJual,
  CheckAndUpdateResiForScan,
  GetKontrolPengirimanByDate,
  GetFormatTableGeneral,
  isExistFileResi,
  insertDailyFileResi
};
