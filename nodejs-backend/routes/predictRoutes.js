const express = require('express');
const router = express.Router();
const { getPrediction, getHistory, generateReport, saveRecommendation, downloadReport, getHealthSummary, getAgriculturalAdvisory } = require('../controllers/predictController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, getPrediction);
router.post('/save', protect, saveRecommendation);
router.get('/history', protect, getHistory);
router.post('/report', protect, generateReport);
router.post('/health-summary', protect, getHealthSummary);
router.post('/download-report', protect, downloadReport);
router.post('/agricultural-advisory', getAgriculturalAdvisory); // Public endpoint

module.exports = router;
