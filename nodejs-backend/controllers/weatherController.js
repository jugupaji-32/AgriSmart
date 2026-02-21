const axios = require('axios');
const NodeCache = require('node-cache');

// Initialize cache with 10 minutes TTL (600 seconds)
const weatherCache = new NodeCache({ stdTTL: 600 });

/**
 * Get weather data from OpenWeatherMap API with caching
 * Accepts either city name or lat/lon coordinates
 */
exports.getWeather = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    // Validate input
    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either city name or latitude and longitude'
      });
    }

    // Create cache key based on parameters
    const cacheKey = city 
      ? `weather_city_${city.toLowerCase()}` 
      : `weather_coords_${lat}_${lon}`;

    // Check cache first
    const cachedData = weatherCache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for: ${cacheKey}`);
      return res.status(200).json({
        success: true,
        data: cachedData,
        cached: true
      });
    }

    // Prepare API URL based on input type
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'OpenWeatherMap API key not configured'
      });
    }

    let apiUrl;
    if (city) {
      apiUrl = `${baseUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    } else {
      apiUrl = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    }

    // Fetch from OpenWeatherMap API
    console.log(`Fetching weather data from API for: ${cacheKey}`);
    const response = await axios.get(apiUrl);

    // Process and structure the response data
    const weatherData = {
      location: {
        name: response.data.name,
        country: response.data.sys.country,
        coordinates: {
          lat: response.data.coord.lat,
          lon: response.data.coord.lon
        }
      },
      weather: {
        main: response.data.weather[0].main,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon
      },
      temperature: {
        current: response.data.main.temp,
        feelsLike: response.data.main.feels_like,
        min: response.data.main.temp_min,
        max: response.data.main.temp_max
      },
      conditions: {
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        visibility: response.data.visibility,
        windSpeed: response.data.wind.speed,
        windDirection: response.data.wind.deg,
        clouds: response.data.clouds.all
      },
      sun: {
        sunrise: response.data.sys.sunrise,
        sunset: response.data.sys.sunset
      },
      timestamp: response.data.dt
    };

    // Store in cache
    weatherCache.set(cacheKey, weatherData);
    console.log(`Cached weather data for: ${cacheKey}`);

    return res.status(200).json({
      success: true,
      data: weatherData,
      cached: false
    });

  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message);
    
    // Handle specific API errors
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return res.status(404).json({
          success: false,
          message: 'City not found. Please check the city name and try again.'
        });
      } else if (status === 401) {
        return res.status(500).json({
          success: false,
          message: 'Invalid API key configuration'
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data',
      error: error.message
    });
  }
};

/**
 * Get 5-day weather forecast with caching
 */
exports.getForecast = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    // Validate input
    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either city name or latitude and longitude'
      });
    }

    // Create cache key
    const cacheKey = city 
      ? `forecast_city_${city.toLowerCase()}` 
      : `forecast_coords_${lat}_${lon}`;

    // Check cache
    const cachedData = weatherCache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for: ${cacheKey}`);
      return res.status(200).json({
        success: true,
        data: cachedData,
        cached: true
      });
    }

    // Prepare API URL
    const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'OpenWeatherMap API key not configured'
      });
    }

    let apiUrl;
    if (city) {
      apiUrl = `${baseUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    } else {
      apiUrl = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    }

    // Fetch forecast data
    console.log(`Fetching forecast data from API for: ${cacheKey}`);
    const response = await axios.get(apiUrl);

    // Process forecast data
    const forecastData = {
      location: {
        name: response.data.city.name,
        country: response.data.city.country,
        coordinates: {
          lat: response.data.city.coord.lat,
          lon: response.data.city.coord.lon
        }
      },
      list: response.data.list.map(item => ({
        timestamp: item.dt,
        datetime: item.dt_txt,
        temperature: {
          current: item.main.temp,
          feelsLike: item.main.feels_like,
          min: item.main.temp_min,
          max: item.main.temp_max
        },
        weather: {
          main: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon
        },
        conditions: {
          humidity: item.main.humidity,
          pressure: item.main.pressure,
          windSpeed: item.wind.speed,
          windDirection: item.wind.deg,
          clouds: item.clouds.all
        },
        pop: item.pop // Probability of precipitation
      }))
    };

    // Store in cache
    weatherCache.set(cacheKey, forecastData);
    console.log(`Cached forecast data for: ${cacheKey}`);

    return res.status(200).json({
      success: true,
      data: forecastData,
      cached: false
    });

  } catch (error) {
    console.error('Forecast API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'City not found. Please check the city name and try again.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch forecast data',
      error: error.message
    });
  }
};

/**
 * Clear weather cache (admin utility)
 */
exports.clearCache = (req, res) => {
  weatherCache.flushAll();
  return res.status(200).json({
    success: true,
    message: 'Weather cache cleared successfully'
  });
};
