const express = require('express');

const { Router } = express;
const router = Router();

const {
  getKolOverview, getSlotUsagePerYear, getMonthlyPostOverview,
  getTotalViewsByYearAndManager
} = require('../service/MarketingDashboardService');

const baseRoutes = '/marketing/dashboard/';

router.get(`${baseRoutes}kol-overview`, async (req, res) => {
  const result = await getKolOverview();
  console.log(`routes:/${baseRoutes}kol-overview`);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get(`${baseRoutes}slot-usage/:year`, async (req, res) => {
  const { params: { year } } = req;
  const result = await getSlotUsagePerYear(year);
  console.log(`routes:/${baseRoutes}slot-usage`);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get(`${baseRoutes}monthly-post-usage/year/:year/month/:month`, async (req, res) => {
  const { params: { year, month } } = req;
  const result = await getMonthlyPostOverview(month, year);
  console.log(`routes:/${baseRoutes}monthly-post-usage/year/:year/month/:month`);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get(`${baseRoutes}total-views`, async (req, res) => {
  const { query: { year, managerId = null } } = req;
  const managerIdForQuery = managerId === 'ALL' ? null : managerId;

  const result = await getTotalViewsByYearAndManager(year, managerIdForQuery);
  console.log(`routes:/${baseRoutes}monthly-post-usage/year/:year/month/:month`);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

module.exports = router;
