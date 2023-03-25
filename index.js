const express = require('express');
// Import the express dependency
const app = express(); // Instantiate an express app, the main work horse of this server
const port = 5000; // Save the port number where your server will be listening
const cron = require('node-cron');
const cors = require('cors');
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
  insertDailyFileResi
} = require('./routes/ValidateUsername');

const { getRekapPengirimanByMonth } = require('./routes/Rekap');
const {
  insertNewKOL,
  getFormatListKol,
  getListKol,
  getALLKolName,
  getKolDetailByID,
  getSubMediaById,
  insertNewKontrak,
  getListKontrak,
  insertNewBrief,
  getListBrief,
  insertNewManager,
  procToSendEmail,
  getListManager,
  getListKontrakIteration,
  insertNewPost,
  sendMessageToQueue,
  checkFileStatus,
  execSPWithoutInput,
  execSPWithInput,
  updatePostStatsById,
  getKontrakDetailByID,
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
  postReminderScheduler,
  contractReminderScheduler,
  getKolListByBrief,
  sendBriefToDestination,
  getMonthlyOverview,
  getBankList,
  getActiveKol,
  updateKolById,
  updateKontrakById
} = require('./routes/Marketing');
const { getVideoAndUserStatistic } = require('./routes/TiktokService');
// const multer = require("multer");
const { upload } = require('./utility/multer');

// Idiomatic expression in express to route and respond to a client request

const corsOptions = {
  origin: '*',
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  // get requests to the root ("/") will route here
  res.sendFile('index.html', { root: __dirname }); // server responds by sending the index.html file to the client's browser
  // the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
});

app.get('/downloadTenplate', (req, res) => {
  const file = `${__dirname}/upload-folder/Template.xlsx`;
  res.download(file);
});

app.get('/downloadFile', (req, res) => {
  console.log('routes:/downloadFile');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  res.download(req.query.file);
});

// login authenticate
app.post('/authenticateLogin', async (req, res) => {
  const result = await validateUsername(req.body);
  console.log('routes:/authenticateLogin');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/isExistDailyFile', async (req, res) => {
  const result = await isExistDailyFile(req.body);
  console.log('routes:/isExistDailyFile');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/isExistFileResi', async (req, res) => {
  const result = await isExistFileResi(req.body);
  console.log('routes:/isExistFileResi');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/insertDailyFile', async (req, res) => {
  const result = await insertDailyFile(req.body);
  console.log('routes:/insertDailyFile');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/insertDailyFileResi', async (req, res) => {
  const result = await insertDailyFileResi(req.body);
  console.log('routes:/insertDailyFileResi');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/GetDailyFile', async (req, res) => {
  const result = await GetDailyFile(req.body);
  console.log('routes:/GetDailyFile');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/getFileResi', async (req, res) => {
  const result = await GetFileResi(req.body);
  console.log('routes:/getFileResi');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/getJournalJualByDate', async (req, res) => {
  const result = await GetJournalJualByDate(req.body);
  console.log('routes:/getJournalJualByDate');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(
    Date().toString('YYYY-MM-DD HH:mm:ss'),
    '- res status:',
    result.status
  );
  res.send(result);
});

app.get('/GetTop100JournalJualToday', async (req, res) => {
  const result = await GetTop100JournalJualToday(req.body);
  console.log('routes:/GetTop100JournalJualToday');
  // console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(
    Date().toString('YYYY-MM-DD HH:mm:ss'),
    '- res status:',
    result.status
  );
  res.send(result);
});

app.get('/getFormatJournalJual', async (req, res) => {
  const result = await GetFormatJournalJual(req.body);
  console.log('routes:/getFormatJournalJual');
  // console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req.body);
  console.log(
    Date().toString('YYYY-MM-DD HH:mm:ss'),
    '- res status:',
    result.status
  );
  res.send(result);
});
/* app.post("/uploadfile", upload.single("myFile"), (req, res, next) => {
  console.log(req.file.originalname + " file successfully uploaded !!");
  res.sendStatus(200);
}); */

app.post('/uploadfile', (req, res) => {
  const uploadFile = upload.single('myFile');
  uploadFile(req, res, (err) => {
    const resp = { status: 'false' };
    if (err) {
      // An error occurred when uploading
      resp.message = err.toString(); // err;
    } else resp.status = 'true';

    console.log('routes:/uploadfile');
    // console.log(Date().toString("YYYY-MM-DD HH:mm:ss"), "- req:", req);
    console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', resp);
    res.send(resp);
  });
});

app.post('/checkAndUpdateResiForScan', async (req, res) => {
  const result = await CheckAndUpdateResiForScan(req.body);
  console.log('routes:/checkAndUpdateResiForScan');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/getKontrolPengirimanByDate', async (req, res) => {
  const result = await GetKontrolPengirimanByDate(req.body);
  console.log('routes:/getKontrolPengirimanByDate');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/getFormatTableGeneral', async (req, res) => {
  const result = await GetFormatTableGeneral(req.body);
  console.log('routes:/getFormatTableGeneral');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/getRekapPengirimanByMonth', async (req, res) => {
  const result = await getRekapPengirimanByMonth(req.body);
  console.log('routes:/getRekapPengirimanByMonth');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/insertNewKOL', async (req, res) => {
  const result = await insertNewKOL(req.body);
  console.log('routes:/insertNewKOL');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getFormatListKol', async (req, res) => {
  const result = await getFormatListKol('kol');
  console.log('routes:/getFormatListKol');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getListKol', async (req, res) => {
  const result = await getListKol(req.body);
  console.log('routes:/getListKol');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getALLKolName', async (req, res) => {
  const result = await getALLKolName();
  console.log('routes:/getALLKolName');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getKolDetail', async (req, res) => {
  const result = await getKolDetailByID(req.query);
  console.log('routes:/getKolDetail');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getSubMediaById', async (req, res) => {
  const result = await getSubMediaById(req.query);
  console.log('routes:/getSubMediaById');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/insertNewKontrak', async (req, res) => {
  const result = await insertNewKontrak(req.body);
  console.log('routes:/insertNewKontrak');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  // res.download(result.filename);
  res.send(result);
});

app.get('/getFormatListKontrak', async (req, res) => {
  const result = await getFormatListKol('kontrak');
  console.log('routes:/getFormatListKontrak');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getListKontrak', async (req, res) => {
  const result = await getListKontrak();
  console.log('routes:/getListKontrak');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getListKontrakIteration', async (req, res) => {
  const result = await getListKontrakIteration();
  console.log('routes:/getListKontrakIteration');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getKontrakDetail', async (req, res) => {
  const result = await getKontrakDetailByID(req.query);
  console.log('ini query', req.query);
  console.log('routes:/getKontrakDetail');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/insertNewBrief', async (req, res) => {
  const result = await insertNewBrief(req.body);
  console.log('routes:/insertNewBrief');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getFormatListBrief', async (req, res) => {
  const result = await getFormatListKol('brief');
  console.log('routes:/getFormatListKontrak');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getListBrief', async (req, res) => {
  const result = await getListBrief();
  console.log('routes:/getListBrief');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/insertNewManager', async (req, res) => {
  const result = await insertNewManager(req.body);
  console.log('routes:/insertNewManager');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/sendEmail', async (req, res) => {
  const result = await procToSendEmail(req.body);
  console.log('routes:/sendEmail');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/sendQueue', async (req, res) => {
  const result = await sendMessageToQueue(req.body);
  console.log('routes:/sendQueue');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getFormatList', async (req, res) => {
  const result = await getFormatListKol(req.query.menu);
  console.log('routes:/getFormatList');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getListManager', async (req, res) => {
  const result = await getListManager();
  console.log('routes:/getListManager');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/checkFileStatus', async (req, res) => {
  const result = await checkFileStatus(req.query);
  console.log('routes:/checkFileStatus');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/insertNewPost', async (req, res) => {
  const result = await insertNewPost(req.body);
  console.log('routes:/insertNewPost');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/execSPWithoutInput', async (req, res) => {
  const result = await execSPWithoutInput(req.body);
  console.log('routes:/execSPWithoutInput');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/execSPWithInput', async (req, res) => {
  const result = await execSPWithInput(req.body);
  console.log('routes:/execSPWithInput');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/updatePostStatsById', async (req, res) => {
  const result = await updatePostStatsById(req.body);
  console.log('routes:/updatePostStatsById');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getPostDetail', async (req, res) => {
  const result = await getPostDetail(req.query);
  console.log('routes:/getPostDetail');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.patch('/updatePost', async (req, res) => {
  const { query: { id }, body } = req;
  const result = await updatePostById(id, body);
  console.log('routes:/updatePost');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getPostStatisticByPostId', async (req, res) => {
  const { id } = req.query;
  const result = await getPostStatisticByPostId(id);
  console.log('routes:/getPostStatisticByPostId');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getContractRenewalList', async (req, res) => {
  const result = await getContractRenewalList();
  console.log('routes:/getContractRenewalList');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getBriefDetail', async (req, res) => {
  const { id } = req.query;
  const result = await getBriefDetail(id);
  console.log('routes:/getBriefDetail');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getPostViewByManager', async (req, res) => {
  const { id } = req.query;
  const result = await getPostViewByManagerId(id);
  console.log('routes:/getBriefDetail');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});
app.get('/getKolListByBrief', async (req, res) => {
  const { id } = req.query;
  const result = await getKolListByBrief(id);
  console.log('routes:/getKolListByBrief');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getOverview', async (req, res) => {
  const { id, params } = req.query;
  const result = await getOverviewData(params, id);
  console.log('routes:/getOverview');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getCostAndSlotOverview', async (req, res) => {
  const result = await getCostAndSlotOverview();
  console.log('routes:/getCostAndSlotOverview');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/broadcastBrief', async (req, res) => {
  const { body } = req;
  const result = await sendBriefToDestination(body);
  console.log('routes:/broadcastBrief');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/getMonthlyOverview', async (req, res) => {
  const result = await getMonthlyOverview();
  console.log('routes:/getMonthlyOverview');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/bank-list', async (req, res) => {
  const result = await getBankList();
  console.log('routes: GET /bank-list');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/kol/active', async (req, res) => {
  const result = await getActiveKol();
  console.log('routes: GET /kol/active');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.patch('/kol/:id', async (req, res) => {
  const { params: { id }, body } = req;
  const result = await updateKolById(id, body);
  console.log('routes: GET /kol/edit');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.patch('/kontrak/:id', async (req, res) => {
  const { params: { id }, body } = req;
  console.log('id', id);
  const result = await updateKontrakById(id, body);
  console.log('routes: GET /kontrak/:id');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/kol/get-listing', async (req, res) => {
  const { body: { username } } = req;
  const result = await getVideoAndUserStatistic(username);
  console.log('routes: POST /kol/get-listing');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.post('/tiktok/get-video-user-statistic', async (req, res) => {
  const { body: { url } } = req;
  const result = await getVideoAndUserStatistic(url);
  console.log('routes: POST /kol/get-video-user-statisticg');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

// scheduler to update post statistic
cron.schedule('0 1 0 * * *', async () => {
  const date = new Date();

  console.log('Running scheduler to update post statistics at: ', new Date(date));
  await updatePostStatisticScheduler();
  console.log('Updating statistic done');
});

cron.schedule('0 9 * * *', async () => {
  const date = new Date();

  console.log('Running scheduler for post reminder: ', new Date(date));
  await postReminderScheduler();
});

cron.schedule('30 9 * * *', async () => {
  const date = new Date();

  console.log('Running scheduler for contract reminder: ', new Date(date));
  await contractReminderScheduler();
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
