const sql = require("mssql");

const config = {
  user: "sa",
  password: "P@ssw0rd",
  server: "localhost",
  database: "WEB_CONFIG",
  options: {
    encrypt: false,
    trustServerCertificate: false,
    cryptoCredentialsDetails: {
      ca: "PEM Encoded self-signed certificate authority certificate goes here",
    },
  },
};

const conn = new sql.ConnectionPool(config);

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to MSSQL");
    return pool;
  })
  .catch((err) => console.log("Database Connection Failed! Bad Config: ", err));

const executeSP = () => {
  /*var conn = new sql.Connection(config);
  conn
    .connect()
    .then(function (conn) {
      //var request = new sql.Request(conn);
      console.log("Connected to MSSQL");
      return 
    })
    .catch((err) => console.log("Database Connection Failed : ", err));*/

  conn.connect().then(function (pool) {});
};

const execQuery = (query) => {
  conn
    .connect()
    .then((pool) => {
      console.log("Connected to MSSQL");
      return pool.request().query(query);
    })
    .catch((err) => console.log("Database Connection Failed : ", err));
};

module.exports = {
  sql,
  execQuery,
  poolPromise,
};
//mssql.connect
