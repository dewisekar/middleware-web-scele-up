const express = require('express');

const { Router } = express;
const router = Router();

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
  getPostStatisticByPostId,
  getContractRenewalList,
  getBriefDetail,
  getPostViewByManagerId,
  getOverviewData,
  getCostAndSlotOverview,
  getKolListByBrief,
  sendBriefToDestination,
  getMonthlyOverview,
  getBankList,
  getActiveKol,
  updateKolById,
  updateKontrakById,
  addCategory,
  editCategory,
  deleteCategory,
  getManagerDetail,
  updateManager,
  deleteManager,
  deletePost,
  deleteContract,
  deletePostView
} = require('../service/Marketing');

router.post('/insertNewKOL', async (req, res) => {
  const result = await insertNewKOL(req.body);
  console.log('routes:/insertNewKOL');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getFormatListKol', async (req, res) => {
  const result = await getFormatListKol('kol');
  console.log('routes:/getFormatListKol');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getListKol', async (req, res) => {
  const result = await getListKol(req.body);
  console.log('routes:/getListKol');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getALLKolName', async (req, res) => {
  const result = await getALLKolName();
  console.log('routes:/getALLKolName');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getKolDetail', async (req, res) => {
  const result = await getKolDetailByID(req.query);
  console.log('routes:/getKolDetail');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getSubMediaById', async (req, res) => {
  const result = await getSubMediaById(req.query);
  console.log('routes:/getSubMediaById');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.post('/insertNewKontrak', async (req, res) => {
  const result = await insertNewKontrak(req.body);
  console.log('routes:/insertNewKontrak');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  // res.download(result.filename);
  res.send(result);
});

router.get('/getFormatListKontrak', async (req, res) => {
  const result = await getFormatListKol('kontrak');
  console.log('routes:/getFormatListKontrak');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getListKontrak', async (req, res) => {
  const result = await getListKontrak();
  console.log('routes:/getListKontrak');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getListKontrakIteration', async (req, res) => {
  const result = await getListKontrakIteration();
  console.log('routes:/getListKontrakIteration');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getKontrakDetail', async (req, res) => {
  const result = await getKontrakDetailByID(req.query);
  console.log('ini query', req.query);
  console.log('routes:/getKontrakDetail');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.post('/insertNewBrief', async (req, res) => {
  const result = await insertNewBrief(req.body);
  console.log('routes:/insertNewBrief');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getFormatListBrief', async (req, res) => {
  const result = await getFormatListKol('brief');
  console.log('routes:/getFormatListKontrak');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getListBrief', async (req, res) => {
  const result = await getListBrief();
  console.log('routes:/getListBrief');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.post('/insertNewManager', async (req, res) => {
  const result = await insertNewManager(req.body);
  console.log('routes:/insertNewManager');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.post('/sendEmail', async (req, res) => {
  const result = await procToSendEmail(req.body);
  console.log('routes:/sendEmail');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.post('/sendQueue', async (req, res) => {
  const result = await sendMessageToQueue(req.body);
  console.log('routes:/sendQueue');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getFormatList', async (req, res) => {
  const result = await getFormatListKol(req.query.menu);
  console.log('routes:/getFormatList');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getListManager', async (req, res) => {
  const result = await getListManager();
  console.log('routes:/getListManager');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/manager/detail/:id', async (req, res) => {
  const { params: { id } } = req;

  const result = await getManagerDetail(id);
  console.log('routes:/manager/detail/:id');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.put('/manager/:id', async (req, res) => {
  const { params: { id }, body } = req;

  const result = await updateManager(id, body);
  console.log('routes:/manager/:id');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.delete('/manager/:id', async (req, res) => {
  const { params: { id } } = req;

  const result = await deleteManager(id);
  console.log('routes:/manager/:id');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/checkFileStatus', async (req, res) => {
  const result = await checkFileStatus(req.query);
  console.log('routes:/checkFileStatus');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.post('/insertNewPost', async (req, res) => {
  const result = await insertNewPost(req.body);
  console.log('routes:/insertNewPost');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.post('/execSPWithoutInput', async (req, res) => {
  const result = await execSPWithoutInput(req.body);
  console.log('routes:/execSPWithoutInput');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.post('/execSPWithInput', async (req, res) => {
  const result = await execSPWithInput(req.body);
  console.log('routes:/execSPWithInput');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.post('/updatePostStatsById', async (req, res) => {
  const result = await updatePostStatsById(req.body);
  console.log('routes:/updatePostStatsById');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getPostDetail', async (req, res) => {
  const result = await getPostDetail(req.query);
  console.log('routes:/getPostDetail');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.patch('/updatePost', async (req, res) => {
  const { query: { id }, body } = req;
  const result = await updatePostById(id, body);
  console.log('routes:/updatePost');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getPostStatisticByPostId', async (req, res) => {
  const { id } = req.query;
  const result = await getPostStatisticByPostId(id);
  console.log('routes:/getPostStatisticByPostId');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getContractRenewalList', async (req, res) => {
  const result = await getContractRenewalList();
  console.log('routes:/getContractRenewalList');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getBriefDetail', async (req, res) => {
  const { id } = req.query;
  const result = await getBriefDetail(id);
  console.log('routes:/getBriefDetail');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getPostViewByManager', async (req, res) => {
  const { id } = req.query;
  const result = await getPostViewByManagerId(id);
  console.log('routes:/getBriefDetail');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});
router.get('/getKolListByBrief', async (req, res) => {
  const { id } = req.query;
  const result = await getKolListByBrief(id);
  console.log('routes:/getKolListByBrief');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getOverview', async (req, res) => {
  const { id, params } = req.query;
  const result = await getOverviewData(params, id);
  console.log('routes:/getOverview');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getCostAndSlotOverview', async (req, res) => {
  const result = await getCostAndSlotOverview();
  console.log('routes:/getCostAndSlotOverview');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.post('/broadcastBrief', async (req, res) => {
  const { body } = req;
  const result = await sendBriefToDestination(body);
  console.log('routes:/broadcastBrief');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/getMonthlyOverview', async (req, res) => {
  const result = await getMonthlyOverview();
  console.log('routes:/getMonthlyOverview');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/bank-list', async (req, res) => {
  const result = await getBankList();
  console.log('routes: GET /bank-list');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get('/kol/active', async (req, res) => {
  const result = await getActiveKol();
  console.log('routes: GET /kol/active');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.patch('/kol/:id', async (req, res) => {
  const { params: { id }, body } = req;
  const result = await updateKolById(id, body);
  console.log('routes: GET /kol/edit');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.patch('/kontrak/:id', async (req, res) => {
  const { params: { id }, body } = req;
  console.log('id', id);
  const result = await updateKontrakById(id, body);
  console.log('routes: GET /kontrak/:id');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.post('/kol/category', async (req, res) => {
  const { body } = req;
  const result = await addCategory(body);
  console.log('routes:/kol/category');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.patch('/kol/category/:id', async (req, res) => {
  const { body, params: { id } } = req;
  const result = await editCategory(id, body);
  console.log('routes:/kol/category');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.delete('/kol/category/:id', async (req, res) => {
  const { params: { id } } = req;
  const result = await deleteCategory(id);
  console.log('routes:/kol/category');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.query);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.delete('/post/:id', async (req, res) => {
  const { params: { id } } = req;

  const result = await deletePost(id);
  console.log('routes:/post/:id');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.delete('/post-view/:id', async (req, res) => {
  const { params: { id } } = req;

  const result = await deletePostView(id);
  console.log('routes:/post-view/:id');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.delete('/contract/:id', async (req, res) => {
  const { params: { id } } = req;

  const result = await deleteContract(id);
  console.log('routes:/contract/:id');
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

module.exports = router;
