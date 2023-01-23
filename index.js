const express = require("express"); //Import the express dependency
const app = express(); //Instantiate an express app, the main work horse of this server
const port = 5002; //Save the port number where your server will be listening
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
const cron = require('node-cron');

const { getRekapPengirimanByMonth } = require("./routes/Rekap");
const {
  insertNewKOL,
  GetFormatListKol,
  GetListKol,
  GetALLKolName,
  GetKolDetailByID,
  GetSubMediaById,
  insertNewKontrak,
  GetListKontrak,
  insertNewBrief,
  GetListBrief,
  insertNewManager,
  procToSendEmail,
  GetListManager,
  GetListKontrakIteration,
  insertNewPost,
  sendMessageToQueue,
  checkFileStatus,
  ExecSPWithoutInput,
  ExecSPWithInput,
  UpdatePostStatsById,
  GetKontrakDetailByID,
  getPostDetail,
  updatePostById,
  updatePostStatisticScheduler,
  getPostStatisticByPostId,
  getContractRenewalList,
  getBriefDetail,
  getPostViewByManagerId,
  getOverviewData,
  getCostAndSlotOverview,
  // regenerateContractFile,
  postReminderScheduler
} = require("./routes/Marketing");
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

app.get("/downloadFile", function (req, res) {
  console.log("routes:/downloadFile");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.query);
  // console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  //const file = `${__dirname}/upload-folder/Template.xlsx`;
  res.download(req.query.file); // Set disposition and send it.
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

app.post("/insertNewKOL", async (req, res) => {
  let result = await insertNewKOL(req.body);
  console.log("routes:/insertNewKOL");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getFormatListKol", async (req, res) => {
  let result = await GetFormatListKol("kol");
  console.log("routes:/getFormatListKol");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getListKol", async (req, res) => {
  let result = await GetListKol(req.body);
  console.log("routes:/getListKol");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getALLKolName", async (req, res) => {
  let result = await GetALLKolName();
  console.log("routes:/getALLKolName");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getKolDetail", async (req, res) => {
  let result = await GetKolDetailByID(req.query);
  console.log("routes:/getKolDetail");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.query);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getSubMediaById", async (req, res) => {
  let result = await GetSubMediaById(req.query);
  console.log("routes:/getSubMediaById");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.query);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/insertNewKontrak", async (req, res) => {
  let result = await insertNewKontrak(req.body);
  console.log("routes:/insertNewKontrak");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  //res.download(result.filename);
  res.send(result);
});

app.get("/getFormatListKontrak", async (req, res) => {
  let result = await GetFormatListKol("kontrak");
  console.log("routes:/getFormatListKontrak");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getListKontrak", async (req, res) => {
  let result = await GetListKontrak();
  console.log("routes:/getListKontrak");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getListKontrakIteration", async (req, res) => {
  let result = await GetListKontrakIteration();
  console.log("routes:/getListKontrakIteration");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getKontrakDetail", async (req, res) => {
  let result = await GetKontrakDetailByID(req.query);
  console.log("ini query", req.query);
  console.log("routes:/getKontrakDetail");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.query);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/insertNewBrief", async (req, res) => {
  let result = await insertNewBrief(req.body);
  console.log("routes:/insertNewBrief");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getFormatListBrief", async (req, res) => {
  let result = await GetFormatListKol("brief");
  console.log("routes:/getFormatListKontrak");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getListBrief", async (req, res) => {
  let result = await GetListBrief();
  console.log("routes:/getListBrief");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/insertNewManager", async (req, res) => {
  let result = await insertNewManager(req.body);
  console.log("routes:/insertNewManager");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/sendEmail", async (req, res) => {
  let result = await procToSendEmail(req.body);
  console.log("routes:/sendEmail");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/sendQueue", async (req, res) => {
  let result = await sendMessageToQueue(req.body);
  console.log("routes:/sendQueue");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getFormatList", async (req, res) => {
  let result = await GetFormatListKol(req.query.menu);
  console.log("routes:/getFormatList");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getListManager", async (req, res) => {
  let result = await GetListManager();
  console.log("routes:/getListManager");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/checkFileStatus", async (req, res) => {
  let result = await checkFileStatus(req.query);
  console.log("routes:/checkFileStatus");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.query);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/insertNewPost", async (req, res) => {
  let result = await insertNewPost(req.body);
  console.log("routes:/insertNewPost");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/execSPWithoutInput", async (req, res) => {
  let result = await ExecSPWithoutInput(req.body);
  console.log("routes:/execSPWithoutInput");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/execSPWithInput", async (req, res) => {
  let result = await ExecSPWithInput(req.body);
  console.log("routes:/execSPWithInput");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.post("/updatePostStatsById", async (req, res) => {
  let result = await UpdatePostStatsById(req.body);
  console.log("routes:/updatePostStatsById");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getPostDetail", async (req, res) => {
  let result = await getPostDetail(req.query);
  console.log("routes:/getPostDetail");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.query);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.patch("/updatePost", async (req, res) => {
  const {query: {id}, body} = req
  let result = await updatePostById(id, body);
  console.log("routes:/updatePost");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.query);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getPostStatisticByPostId", async (req, res) => {
  const {id} = req.query
  let result = await getPostStatisticByPostId(id);
  console.log("routes:/getPostStatisticByPostId");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.query);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getContractRenewalList", async (req, res) => {
  let result = await getContractRenewalList();
  console.log("routes:/getContractRenewalList");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.query);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getBriefDetail", async (req, res) => {
  const {id} = req.query
  let result = await getBriefDetail(id);
  console.log("routes:/getBriefDetail");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.query);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getPostViewByManager", async (req, res) => {
  const {id} = req.query
  let result = await getPostViewByManagerId(id);
  console.log("routes:/getBriefDetail");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.query);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getOverview", async (req, res) => {
  const {id, params} = req.query
  let result = await getOverviewData(params, id);
  console.log("routes:/getOverview");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.query);
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- res:", result);
  res.send(result);
});

app.get("/getCostAndSlotOverview", async (req, res) => {
  let result = await getCostAndSlotOverview();
  console.log("routes:/getCostAndSlotOverview");
  console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.query);
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

// scheduler to update post statistic
cron.schedule('15 5 * * *', async () => {
  const date = new Date()
  const gmtDate = date.setHours(date.getHours() + 7);

  console.log("Running scheduler to update post statistics at: ", new Date(gmtDate))
  await updatePostStatisticScheduler()
});

cron.schedule('54 12 * * *', async () => {
  const date = new Date()
  const gmtDate = date.setHours(date.getHours() + 7);

  console.log("Running scheduler for post reminder: ", new Date(gmtDate))
  await postReminderScheduler()
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
