const express = require('express');

const app = express();
const port = 5002;
const cron = require('node-cron');
const cors = require('cors');
const routes = require('./routes');
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
} = require('./service/ValidateUsername');

const { getRekapPengirimanByMonth } = require('./service/Rekap');
const {
  updatePostStatisticScheduler,
  postReminderScheduler,
  contractReminderScheduler
} = require('./service/Marketing');
const {
  getVideoAndUserStatistic, getUserCpmByCost,
  fetchKolListing
} = require('./service/TiktokService');
const { upload } = require('./utility/multer');

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname }); // server responds by sending the index.html file to the client's browser
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

app.post('/tiktok/get-listing', async (req, res) => {
  const { body: { username, costPerSlot } } = req;
  const result = await getUserCpmByCost(username, costPerSlot);
  console.log('routes: POST /kol/get-listing');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

app.get('/tiktok/fetch-listing', async (req, res) => {
  const result = await fetchKolListing();
  console.log('routes: POST /kol/fetch-listing');
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
cron.schedule('0 1 * * *', async () => {
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
