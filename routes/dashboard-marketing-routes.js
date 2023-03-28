const express = require('express');

const { Router } = express;
const router = Router();

const {
  getKolOverview
} = require('../service/MarketingDashboardService');

const baseRoutes = '/marketing/dashboard/';

router.get('/marketing/dashboard/kol-overview', async (req, res) => {
  const result = await getKolOverview();
  console.log(`routes:/${baseRoutes}kol-overview`);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

module.exports = router;
