const express = require('express');

const { Router } = express;
const router = Router();

const {
  getKolOverview, getSlotUsagePerYear, getMonthlyPostOverview,
  getTotalViewsByYearAndManager, getPostReminder, getTotalViewsPerCategory,
  getFypByManager
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
  console.log(`routes:/${baseRoutes}total-views`);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get(`${baseRoutes}post-reminder`, async (req, res) => {
  const { query: { managerId = null } } = req;
  const managerIdForQuery = managerId === 'ALL' ? null : managerId;

  const result = await getPostReminder(managerIdForQuery);
  console.log(`routes:/${baseRoutes}post-reminder`);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get(`${baseRoutes}views-per-category`, async (req, res) => {
  const { query: { managerId = null, startDate = null, endDate = null } } = req;
  const managerIdForQuery = managerId === 'ALL' ? null : managerId;
  const startDateForQuery = startDate === 'ALL' ? null : startDate;
  const endDateForQuery = endDate === 'ALL' ? null : endDate;

  const result = await
  getTotalViewsPerCategory(managerIdForQuery, startDateForQuery, endDateForQuery);
  console.log(`routes:/${baseRoutes}views-per-category`);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

router.get(`${baseRoutes}fyp-overview`, async (req, res) => {
  const { query: { managerId = null, startDate = null, endDate = null } } = req;
  const managerIdForQuery = managerId === 'ALL' ? null : managerId;

  const result = await getFypByManager(managerIdForQuery, new Date(startDate), new Date(endDate));
  console.log(`routes:/${baseRoutes}fyp-overview`);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- req:', req.body);
  console.log(Date().toString('YYYY-MM-DD HH:mm:ss'), '- res:', result);
  res.send(result);
});

module.exports = router;
