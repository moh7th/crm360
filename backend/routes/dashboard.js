const express = require('express');
const router = express.Router();
const {
  getMetrics,
  getRecentActivities,
  getSalesPipeline,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/metrics', getMetrics);
router.get('/recent-activities', getRecentActivities);
router.get('/sales-pipeline', getSalesPipeline);

module.exports = router;
