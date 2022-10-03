const express = require("express"); //Import the express dependency
const app = express(); //Instantiate an express app, the main work horse of this server
const port = 5000; //Save the port number where your server will be listening
const {
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
  insertDailyFileResi,
} = require("./routes/ValidateUsername");

const { getRekapPengirimanByMonth } = require("./routes/Rekap");
//const multer = require("multer");
const { upload } = require("./utility/multer");

//Idiomatic expression in express to route and respond to a client request
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  //get requests to the root ("/") will route here
  res.sendFile("index.html", { root: __dirname }); //server responds by sending the index.html file to the client's browser
  //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
});

app.get("/downloadTenplate", function (req, res) {
  const file = `${__dirname}/upload-folder/Template.xlsx`;
  res.download(file); // Set disposition and send it.
});

//login authenticate
app.post("/authenticateLogin", async (req, res) => {
  let result = await validateUsername(req.body);
  console.log("routes:/authenticateLogin");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/isExistDailyFile", async (req, res) => {
  let result = await isExistDailyFile(req.body);
  console.log("routes:/isExistDailyFile");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/isExistFileResi", async (req, res) => {
  let result = await isExistFileResi(req.body);
  console.log("routes:/isExistFileResi");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/insertDailyFile", async (req, res) => {
  let result = await insertDailyFile(req.body);
  console.log("routes:/insertDailyFile");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/insertDailyFileResi", async (req, res) => {
  let result = await insertDailyFileResi(req.body);
  console.log("routes:/insertDailyFileResi");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/GetDailyFile", async (req, res) => {
  let result = await GetDailyFile(req.body);
  console.log("routes:/GetDailyFile");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/getFileResi", async (req, res) => {
  let result = await GetFileResi(req.body);
  console.log("routes:/getFileResi");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/getJournalJualByDate", async (req, res) => {
  let result = await GetJournalJualByDate(req.body);
  console.log("routes:/getJournalJualByDate");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(
    Date().toString("YYYY-MM-DD HH:mm:ss"),
    "- res status:",
    result.status
  );
  res.send(result);
});

app.get("/GetTop100JournalJualToday", async (req, res) => {
  let result = await GetTop100JournalJualToday(req.body);
  console.log("routes:/GetTop100JournalJualToday");
  //console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(
    Date().toString("YYYY-MM-DD HH:mm:ss"),
    "- res status:",
    result.status
  );
  res.send(result);
});

app.get("/getFormatJournalJual", async (req, res) => {
  let result = await GetFormatJournalJual(req.body);
  console.log("routes:/getFormatJournalJual");
  //console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(
    Date().toString("YYYY-MM-DD HH:mm:ss"),
    "- res status:",
    result.status
  );
  res.send(result);
});
/*app.post("/uploadfile", upload.single("myFile"), (req, res, next) => {
  console.log(req.file.originalname + " file successfully uploaded !!");
  res.sendStatus(200);
});*/

app.post("/uploadfile", (req, res) => {
  var uploadFile = upload.single("myFile");
  uploadFile(req, res, function (err) {
    let resp = { status: "false" };
    if (err) {
      // An error occurred when uploading
      resp.message = err.toString(); //err;
    } else resp.status = "true";

    console.log("routes:/uploadfile");
    //console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req);
    console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", resp);
    res.send(resp);
  });
});

app.post("/checkAndUpdateResiForScan", async (req, res) => {
  let result = await CheckAndUpdateResiForScan(req.body);
  console.log("routes:/checkAndUpdateResiForScan");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/getKontrolPengirimanByDate", async (req, res) => {
  let result = await GetKontrolPengirimanByDate(req.body);
  console.log("routes:/getKontrolPengirimanByDate");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/getFormatTableGeneral", async (req, res) => {
  let result = await GetFormatTableGeneral(req.body);
  console.log("routes:/getFormatTableGeneral");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/getRekapPengirimanByMonth", async (req, res) => {
  let result = await getRekapPengirimanByMonth(req.body);
  console.log("routes:/getRekapPengirimanByMonth");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});
//#region
// app.post("/uploadFile", (req, res) => {
//   let resp = { status: "false" };
//   try {
//     var storage = multer.diskStorage({
//       destination: "./build",
//       filename: function (req, file, cb) {
//         cb(null, file.originalname);
//       },
//     });
//     const upload = multer({ storage: storage });
//   } catch (err) {
//     console.log(err);
//     resp.err = err;
//     return resp;
//   }
// });
//#endregion
//app.use("/authenticateLogin", validateUsername);

app.listen(port, () => {
  //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${port}`);
});
