const express = require("express");
const req = require("express/lib/request");
//const router = express.Router();
const { sql, execQuery, poolPromise } = require("../utility/database");

/*router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().input("input_parameter", sql.VarChar, req.body.Username).query("SELECT TOP(1) * FROM dbo.USERS WITH(NOLOCK) WHERE USERNAME = @input_parameter");

    res.json(result.recordset);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});*/

const validateUsername = async (req) => {
  let resp = { status: "false" };
  try {
    let username = req.Username;
    let companyId = req.Company;
    let password = req.Password;
    const pool = await poolPromise;

    //console.log(username);
    //let myquery = "SELECT TOP(1) * FROM dbo.USERS WITH(NOLOCK) WHERE USERNAME = '" + username + "' AND COMPANY_ID ='" + companyId + "';";
    //const result = await pool.request().query(myquery);

    const result = await pool.request().input("USERNAME", username).input("COMPANY_ID", companyId).input("PASSWORD", password).execute("SP_AuthorizeUsername");
    //const result = await pool.request().input();
    //  let result = await pool.request().execute("SP_AuthorizeUsername");
    console.log(result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length == 1) {
        resp.status = "true";
        resp.LEVEL_ID = result.recordset[0].LEVEL_ID;
      }
    }

    //console.log(resp);
    return resp;
    //res.json(result.recordset);
  } catch (err) {
    console.error(err);
    //res.status(500);
    //res.send(err.message);
    return resp;
  }
};

const isExistDailyFile = async (req) => {
  let resp = { status: "false" };
  try {
    let filename = req.Filename;
    let channel = req.Channel;
    let isMarketplace = req.IsMarketplace;
    const pool = await poolPromise;

    //console.log(username);
    //let myquery = "SELECT TOP(1) * FROM dbo.USERS WITH(NOLOCK) WHERE USERNAME = '" + username + "' AND COMPANY_ID ='" + companyId + "';";
    //const result = await pool.request().query(myquery);

    const result = await pool.request().input("FILENAME", filename).input("CHANNEL", channel).input("ISMARKETPLACE", isMarketplace).execute("SP_CheckExistDailyFile");
    //const result = await pool.request().input();
    //  let result = await pool.request().execute("SP_AuthorizeUsername");
    console.log(result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length == 1) {
        resp.status = "true";
        resp.FILENAME = result.recordset[0].FILENAME;
        resp.UPLOADDATE = result.recordset[0].UPLOADDATE;
      }
    }

    //console.log(resp);
    return resp;
    //res.json(result.recordset);
  } catch (err) {
    console.error(err);
    //res.status(500);
    //res.send(err.message);
    return resp;
  }
};

const insertDailyFile = async (req) => {
  let resp = { status: "false" };
  try {
    let filename = req.Filename;
    let channel = req.Channel;
    let isMarketplace = req.IsMarketplace;
    let uploadDate = req.Date;
    const pool = await poolPromise;

    //console.log(username);
    //let myquery = "SELECT TOP(1) * FROM dbo.USERS WITH(NOLOCK) WHERE USERNAME = '" + username + "' AND COMPANY_ID ='" + companyId + "';";
    //const result = await pool.request().query(myquery);

    const result = await pool.request().input("FILENAME", filename).input("CHANNEL", channel).input("ISMARKETPLACE", isMarketplace).input("UPLOADDATE", uploadDate).execute("SP_InsertDailyFile");
    //const result = await pool.request().input();
    //  let result = await pool.request().execute("SP_AuthorizeUsername");
    console.log(result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length == 1) {
        if ((result.recordset[0].STATUS = "1")) resp.status = "true";
        else resp.status = "false";

        resp.message = result.recordset[0].MESSAGE;
      }
    }

    //console.log(resp);
    return resp;
    //res.json(result.recordset);
  } catch (err) {
    console.error(err);
    //res.status(500);
    //res.send(err.message);
    return resp;
  }
};

const authorizeUsername = (req) => {
  try {
    var query = "SELECT TOP(1) * FROM dbo.USERS WITH(NOLOCK) WHERE USERNAME = '" + req.username + "' AND COMPANY_ID ='" + req.companyId + "';";
    let result = execQuery(query);
    console.log(result);
  } catch (err) {
    console.log("Failed to authorize username", err);
  }
};

module.exports = {
  authorizeUsername,
  validateUsername,
  isExistDailyFile,
  insertDailyFile,
};
