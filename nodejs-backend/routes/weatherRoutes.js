const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

/**
 * @route   GET /api/external/weather
 * @desc    Get current weather data for a city or coordinates
 * @access  Public
 * @query   city - City name (e.g., "London" or "New York")
 *          OR
 *          lat - Latitude coordinate
 *          lon - Longitude coordinate
 */
router.get('/weather', weatherController.getWeather);

/**
 * @route   GET /api/external/forecast
 * @desc    Get 5-day weather forecast
 * @access  Public
 * @query   city - City name or lat/lon coordinates
 */
router.get('/forecast', weatherController.getForecast);

/**
 * @route   POST /api/external/weather/clear-cache
 * @desc    Clear weather cache (admin utility)
 * @access  Public (should be protected in production)
 */
router.post('/weather/clear-cache', weatherController.clearCache);

module.exports = router;
