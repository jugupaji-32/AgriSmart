import { Card } from "@/components/custom/Card";
import { Button } from "@/components/custom/Button";
import { Input } from "@/components/custom/Input";
import { MapPin, Calendar, Search, Sun, CloudRain, Cloud, CloudDrizzle, Loader2, Wind, Droplets, Thermometer, Navigation } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import api from "@/services/api";
import { format } from "date-fns";

// Types for backend API response
interface BackendWeatherData {
  location: {
    name: string;
    country: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  temperature: {
    current: number;
    feelsLike: number;
    min: number;
    max: number;
  };
  conditions: {
    humidity: number;
    pressure: number;
    visibility: number;
    windSpeed: number;
    windDirection: number;
    clouds: number;
  };
  sun: {
    sunrise: number;
    sunset: number;
  };
  timestamp: number;
}

interface BackendForecastData {
  location: {
    name: string;
    country: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  list: {
    timestamp: number;
    datetime: string;
    temperature: {
      current: number;
      feelsLike: number;
      min: number;
      max: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    conditions: {
      humidity: number;
      pressure: number;
      windSpeed: number;
      windDirection: number;
      clouds: number;
    };
    pop: number;
  }[];
}

// Legacy types (for component compatibility)
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
}

interface ForecastItem {
  dt: number;
  main: {
    temp_min: number;
    temp_max: number;
    humidity: number;
    temp?: number;
  };
  weather: {
    main: string;
    icon: string;
  }[];
  dt_txt: string;
}

const Weather = memo(() => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationName, setLocationName] = useState("");
  const [advisories, setAdvisories] = useState<Array<{title: string; desc: string; icon: string}>>([]);
  const [advisoryLoading, setAdvisoryLoading] = useState(false);

  // Load user's actual location immediately
  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Unable to get your location. Please search for a city or enable location permissions.");
          setLoading(false);
          setInitialLoad(false);
        },
        { timeout: 10000, maximumAge: 0, enableHighAccuracy: false } // Fresh location, 10s timeout
      );
    } else {
      setError("Geolocation is not supported by your browser. Please search for a city.");
      setInitialLoad(false);
    }
  }, []);

  const fetchAdvisories = async (currentWeather: WeatherData, forecastData: ForecastItem[]) => {
    try {
      setAdvisoryLoading(true);
      const weatherSummary = `Current conditions: ${currentWeather.weather[0].description}, ${Math.round(currentWeather.main.temp)}°C, ${currentWeather.main.humidity}% humidity. 5-day forecast shows temperatures ranging from ${Math.round(Math.min(...forecastData.map(f => f.main.temp_min)))}°C to ${Math.round(Math.max(...forecastData.map(f => f.main.temp_max)))}°C.`;
      
      console.log('Fetching agricultural advisories for weather:', weatherSummary);
      
      const response = await api.post('/predict/agricultural-advisory', {
        weather: weatherSummary,
        location: currentWeather.name
      });
      
      console.log('Advisory response:', response.data);
      
      if (response.data.advisories && Array.isArray(response.data.advisories)) {
        setAdvisories(response.data.advisories);
      }
    } catch (err) {
      console.error('Failed to fetch advisories:', err);
      // Fallback to default advisories if API fails
      setAdvisories([
        {
          title: "Weather Monitoring",
          desc: "Keep track of local weather patterns and prepare for any sudden changes.",
          icon: "🌤️"
        },
        {
          title: "Crop Management",
          desc: "Ensure proper irrigation and nutrient management based on current conditions.",
          icon: "🌱"
        },
        {
          title: "Field Inspection",
          desc: "Regularly check crops for any signs of stress or disease.",
          icon: "🔍"
        }
      ]);
    } finally {
      setAdvisoryLoading(false);
    }
  };

  // Helper function to convert backend data to legacy format
  const convertBackendToLegacy = (backendData: BackendWeatherData): WeatherData => ({
    name: backendData.location.name,
    main: {
      temp: backendData.temperature.current,
      humidity: backendData.conditions.humidity,
      pressure: backendData.conditions.pressure,
    },
    weather: [{
      main: backendData.weather.main,
      description: backendData.weather.description,
      icon: backendData.weather.icon,
    }],
    wind: {
      speed: backendData.conditions.windSpeed,
      deg: backendData.conditions.windDirection,
    }
  });

  // Helper function to convert backend forecast to legacy format
  const convertForecastToLegacy = (backendForecast: BackendForecastData): ForecastItem[] => {
    return backendForecast.list.map(item => ({
      dt: item.timestamp,
      main: {
        temp: item.temperature.current,
        temp_min: item.temperature.min,
        temp_max: item.temperature.max,
        humidity: item.conditions.humidity,
      },
      weather: [{
        main: item.weather.main,
        icon: item.weather.icon,
      }],
      dt_txt: item.datetime,
    }));
  };

  const fetchWeatherData = useCallback(async (params: { lat?: number; lon?: number; city?: string }) => {
    try {
      setLoading(true);
      setError(null);

      let weatherParams = {};
      let forecastParams = {};

      if (params.city) {
        weatherParams = { city: params.city };
        forecastParams = { city: params.city };
        console.log('Fetching weather for city:', params.city);
      } else if (params.lat && params.lon) {
        weatherParams = { lat: params.lat, lon: params.lon };
        forecastParams = { lat: params.lat, lon: params.lon };
        console.log('Fetching weather for coordinates:', params.lat, params.lon);
      } else {
        throw new Error("Invalid parameters for weather fetch");
      }

      // Fetch both in parallel for better performance
      const [weatherRes, forecastRes] = await Promise.all([
        api.get('/external/weather', { params: weatherParams }),
        api.get('/external/forecast', { params: forecastParams })
      ]);
      
      console.log('Weather response:', weatherRes.data);
      console.log('Forecast response:', forecastRes.data);
      console.log('Timestamp:', new Date().toISOString());
      
      // Convert backend format to legacy format for component compatibility
      const weatherData = convertBackendToLegacy(weatherRes.data.data);
      const forecastData = convertForecastToLegacy(forecastRes.data.data);
      
      setWeather(weatherData);
      setLocationName(weatherData.name);

      // Process forecast to get daily data (filter for noon readings)
      const dailyForecast = forecastData.filter((reading: ForecastItem) =>
        reading.dt_txt.includes("12:00:00")
      ).slice(0, 5); // Limit to 5 days
      
      setForecast(dailyForecast);
      setInitialLoad(false);
      setLoading(false);
      
      // Fetch dynamic agricultural advisories based on weather
      fetchAdvisories(weatherData, dailyForecast);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to fetch weather data. Please check the city name.";
      setError(errorMessage);
      setInitialLoad(false);
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeatherData({ city: searchQuery });
    }
  }, [searchQuery, fetchWeatherData]);

  const getWeatherIcon = useCallback((condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear": return Sun;
      case "clouds": return Cloud;
      case "rain": return CloudRain;
      case "drizzle": return CloudDrizzle;
      default: return Sun;
    }
  }, []);

  // Prepare chart data from forecast - memoized for performance
  const chartData = useMemo(() => forecast.map(item => ({
    day: format(new Date(item.dt * 1000), "EEE"),
    temp: Math.round(item.main.temp || item.main.temp_max),
    humidity: item.main.humidity
  })), [forecast]);

  // Show skeleton loader only on initial load, not on subsequent updates
  if (initialLoad && loading) {
    return (
      
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
          <div className="animate-pulse space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header skeleton */}
            <div className="space-y-2 sm:space-y-3">
              <div className="h-8 sm:h-10 bg-muted rounded w-2/3 sm:w-1/2 lg:w-1/3"></div>
              <div className="h-4 sm:h-6 bg-muted rounded w-full sm:w-3/4 lg:w-1/2"></div>
            </div>
            
            {/* Search area skeleton */}
            <div className="space-y-3">
              <div className="flex flex-col xs:flex-row gap-3">
                <div className="h-10 bg-muted rounded flex-1"></div>
                <div className="h-10 bg-muted rounded w-full xs:w-32"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-10 bg-muted rounded flex-1"></div>
                <div className="h-10 bg-muted rounded w-16"></div>
                <div className="h-10 bg-muted rounded w-full sm:w-40"></div>
              </div>
            </div>
            
            {/* Hero card skeleton */}
            <div className="h-[240px] sm:h-[280px] lg:h-[320px] bg-muted rounded"></div>
            
            {/* Main content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="h-64 sm:h-80 bg-muted rounded"></div>
              <div className="lg:col-span-2 h-64 sm:h-80 bg-muted rounded"></div>
            </div>
            
            {/* Charts section skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              <div className="h-64 sm:h-80 bg-muted rounded"></div>
              <div className="h-64 sm:h-80 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      
    );
  }

  if (error) {
    return (
      
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <p className="text-lg sm:text-xl text-destructive mb-4 break-words">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full sm:w-auto">
              Retry
            </Button>
          </div>
        </div>
      
    );
  }

  return (
    
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Weather Insights
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Detailed weather information for informed farming decisions.
          </p>
        </div>

        {/* Location and Search - Mobile First */}
        <div className="space-y-4 mb-6">
          {/* Location Info Cards */}
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-card rounded-lg border border-border flex-1 min-w-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base truncate">{locationName}</span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-card rounded-lg border border-border">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">{format(new Date(), "MMM d, yyyy")}</span>
            </div>
          </div>

          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <Input
                placeholder="Search city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm sm:text-base"
                disabled={loading}
              />
              <Button 
                type="submit" 
                variant="primary" 
                disabled={loading || !searchQuery.trim()}
                className="px-3 sm:px-4"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </form>
            <Button
              variant="outline"
              size="sm"
              title="Use Current Location"
              disabled={loading}
              className="px-3 sm:px-4 w-full sm:w-auto"
              onClick={() => {
                if (navigator.geolocation) {
                  setLoading(true);
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      fetchWeatherData({ lat: position.coords.latitude, lon: position.coords.longitude });
                    },
                    (err) => {
                      setError("Unable to access your location. Please check permissions.");
                      setLoading(false);
                    },
                    { timeout: 5000 }
                  );
                } else {
                  setError("Geolocation is not supported by your browser.");
                }
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Navigation className="w-4 h-4 mr-2" />
              )}
              <span className="text-sm">Current Location</span>
            </Button>
          </div>
        </div>

        {/* Hero Weather Card - Mobile Responsive */}
        <Card className="mb-6 sm:mb-8 overflow-hidden relative h-[240px] sm:h-[280px] lg:h-[320px]">
          <img
            src="https://images.unsplash.com/photo-1601134467661-3d775b999c8b"
            alt="Weather background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          <div className="relative h-full flex items-center px-4 sm:px-6 lg:px-12">
            <div className="w-full">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 break-words">
                {weather?.weather[0].main}, {Math.round(weather?.main.temp || 0)}°C
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-1">
                in {locationName}
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-white/80 capitalize">
                {weather?.weather[0].description}
              </p>
            </div>
          </div>
        </Card>

        {/* Main Content Grid - Mobile Responsive */}
        <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-8">
          {/* Current Conditions & Forecast */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Current Conditions */}
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">
                Current Conditions
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 flex-shrink-0" /> 
                    Temperature
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    {Math.round(weather?.main.temp || 0)}°C
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Droplets className="w-3 h-3 flex-shrink-0" /> 
                    Humidity
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    {weather?.main.humidity}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Wind className="w-3 h-3 flex-shrink-0" /> 
                    Wind
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-foreground">
                    {weather?.wind.speed} m/s
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Pressure</p>
                  <p className="text-lg sm:text-xl font-bold text-foreground">
                    {weather?.main.pressure} hPa
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Cloudiness</p>
                  <p className="text-sm sm:text-base font-bold text-foreground capitalize break-words">
                    {weather?.weather[0].description}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Visibility</p>
                  <p className="text-lg sm:text-xl font-bold text-foreground">
                    {weather ? Math.round((weather as any).visibility / 1000) : 0} km
                  </p>
                </div>
              </div>
            </Card>

            {/* Forecast */}
            <Card className="lg:col-span-2 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">
                5-Day Forecast
              </h3>
              {/* Mobile: Vertical Stack */}
              <div className="block sm:hidden space-y-3">
                {forecast.map((day, index) => {
                  const Icon = getWeatherIcon(day.weather[0].main);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-olive/10 hover:bg-card/80 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0">
                          <Icon className="w-full h-full text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {format(new Date(day.dt * 1000), "EEEE")}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {day.weather[0].main}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          {Math.round(day.main.temp_max)}°
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Math.round(day.main.temp_min)}°
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Tablet & Desktop: Grid */}
              <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {forecast.map((day, index) => {
                  const Icon = getWeatherIcon(day.weather[0].main);
                  return (
                    <div key={index} className="text-center p-3 rounded-lg bg-card/50 border border-olive/10 hover:bg-card/80 transition-colors">
                      <p className="font-semibold text-foreground mb-2 text-sm lg:text-base">
                        {format(new Date(day.dt * 1000), "EEE")}
                      </p>
                      <Icon className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-2 text-primary" />
                      <p className="text-base lg:text-lg font-bold text-foreground">
                        {Math.round(day.main.temp_max)}°
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round(day.main.temp_min)}°
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {day.weather[0].main}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              {forecast.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No forecast data available.</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Charts and Advisory Section - Mobile Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* Temperature Trend Chart */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">
              5-Day Temperature Trend
            </h3>
            <div className="h-[250px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                    width={30}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar 
                    dataKey="temp" 
                    fill="hsl(var(--primary))" 
                    name="Temperature (°C)" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Agricultural Advisory */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">
              Agricultural Advisory
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {(advisoryLoading || advisories.length === 0) && [0,1,2].map((i) => (
                <div key={`skeleton-${i}`} className="p-3 sm:p-4 rounded-lg bg-card/30 border border-olive/10 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-muted rounded-full" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-2/3" />
                      <div className="h-3 bg-muted rounded w-full" />
                    </div>
                  </div>
                </div>
              ))}

              {advisories.map((advisory, index) => (
                <div 
                  key={index} 
                  className="p-3 sm:p-4 rounded-lg bg-card/50 border border-olive/10 hover:bg-card/80 transition-colors"
                >
                  <div className="flex gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0 mt-0.5">
                      {advisory.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base">
                        {advisory.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {advisory.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    
  );
});

export default Weather;
