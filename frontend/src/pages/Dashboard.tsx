import { Button } from "@/components/custom/Button";
import { Card, CardHeader, CardContent } from "@/components/custom/Card";
import { Badge } from "@/components/custom/Badge";
import { Progress } from "@/components/custom/Progress";
import { Skeleton, CardSkeleton, RecommendationSkeleton, QuickActionSkeleton, WeatherDetailSkeleton } from "@/components/custom/Skeleton";
import { 
  LayoutDashboard, Sparkles, FileText, Cloud, MessageSquare, 
  UserCog, Loader2, Wheat, Droplets, Thermometer, Sun, 
  TrendingUp, Activity, MapPin 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/services/api";

interface Recommendation {
  _id: string;
  crop: string;
  date: string;
  status: string;
  image: string;
  fieldName: string;
  predictedCrop: string;
  createdAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string; image?: string } | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [healthSummary, setHealthSummary] = useState<string>("Loading insights...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Weather - NON-BLOCKING in background
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                console.log('Fetching weather for coordinates:', latitude, longitude);
                const weatherRes = await api.get('/external/weather', {
                  params: { lat: latitude, lon: longitude }
                });
                console.log('Weather API Response:', weatherRes.data);
                
                // Backend returns structured data, convert to OpenWeatherMap-like format
                const backendData = weatherRes.data.data;
                const weatherData = {
                  main: {
                    temp: backendData.temperature.current,
                    humidity: backendData.conditions.humidity,
                    pressure: backendData.conditions.pressure
                  },
                  weather: [{
                    main: backendData.weather.main,
                    description: backendData.weather.description,
                    icon: backendData.weather.icon
                  }],
                  name: backendData.location.name
                };
                console.log('Converted weather data:', weatherData);
                setWeather(weatherData);
              } catch (err) {
                console.error("Failed to fetch weather:", err);
              }
            },
            (err) => {
              console.warn("Geolocation unavailable:", err);
            },
            { timeout: 10000, maximumAge: 0 }
          );
        } else {
          console.warn('Geolocation not supported');
        }

        // 2. Fetch Recommendations History - PRIORITY DATA
        const { data: historyData } = await api.get("/predict/history");

        // Map history to display format
        const formattedRecs = historyData.map((rec: any) => ({
          _id: rec._id,
          crop: rec.predictedCrop,
          date: new Date(rec.createdAt).toLocaleDateString(),
          status: "Completed",
          image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
          fieldName: rec.fieldName,
          predictedCrop: rec.predictedCrop,
          ...rec
        }));

        setRecommendations(formattedRecs);

        // 3. Get Health Summary for the latest recommendation
        if (historyData.length > 0) {
          const latestRec = historyData[0];
          try {
            const { data: summaryData } = await api.post("/predict/health-summary", latestRec);
            setHealthSummary(summaryData.summary);
          } catch (err) {
            console.error("Failed to fetch health summary", err);
            setHealthSummary("Health insights unavailable.");
          }
        } else {
          setHealthSummary("No soil data available yet.");
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user) return null;

  return (
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* Welcome Header */}
        <div className="bg-gradient-to-br from-arylide-yellow/40 via-vanilla to-vanilla/60 rounded-xl sm:rounded-2xl p-3 sm:p-6 md:p-8 lg:p-10 shadow-lg border border-jonquil/20 transition-all duration-300">
          <div className="flex flex-col gap-2 sm:gap-3">
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-dark-moss flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="break-words">Welcome back, {user.name?.split(' ')[0] || "Farmer"}! 🌾</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-olive/80 font-medium leading-relaxed">
              Here's an overview of your smart farming journey today
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {loading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
          <>
          {/* Weather Card */}
          <Card className="relative overflow-hidden border-2 border-jonquil/20 hover:border-jonquil/40 transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-jonquil/20 to-transparent rounded-full -mr-8 sm:-mr-12 -mt-8 sm:-mt-12" />
            <CardContent className="flex flex-col h-full p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-jonquil to-arylide-yellow rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                  <Cloud className="w-5 h-5 sm:w-7 sm:h-7 text-dark-moss drop-shadow" />
                </div>
                {weather && weather.weather && weather.weather[0] && (
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                    alt="weather"
                    className="w-8 h-8 sm:w-12 sm:h-12"
                  />
                )}
              </div>
              
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Today's Weather</h3>
              
              <div className="flex-1 mb-3 sm:mb-4">
                {weather && weather.main ? (
                  <>
                    <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                      <span className="text-2xl sm:text-3xl font-bold text-foreground">
                        {Math.round(weather.main.temp)}°
                      </span>
                      <span className="text-sm sm:text-lg text-muted-foreground">C</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground capitalize leading-tight">
                      {weather.weather && weather.weather[0] ? weather.weather[0].description : 'N/A'}
                    </p>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Loading...</span>
                  </div>
                )}
              </div>
              
              <Button variant="outline" size="sm" onClick={() => navigate('/weather')} className="flex items-center mt-auto border-jonquil/40 text-olive hover:bg-jonquil/20 hover:border-jonquil hover:text-dark-moss transition-all duration-200 text-xs sm:text-sm h-8 sm:h-10">
                <Cloud className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span>Full Forecast</span>
              </Button>
            </CardContent>
          </Card>

          {/* Soil Health Card */}
          <Card className="relative overflow-hidden border-2 border-olive/20 hover:border-olive/40 transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-olive/20 to-transparent rounded-full -mr-8 sm:-mr-12 -mt-8 sm:-mt-12" />
            <CardContent className="flex flex-col h-full p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-olive to-olive/80 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                  <Activity className="w-5 h-5 sm:w-7 sm:h-7 text-white drop-shadow" />
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Soil Health</h3>
              
              <div className="flex-1 mb-3 sm:mb-4">
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="text-lg sm:text-2xl font-bold text-foreground">
                    {recommendations.length > 0 ? 'Good' : 'Pending'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-tight">
                  {healthSummary}
                </p>
              </div>
              
              <Button variant="outline" size="sm" onClick={() => navigate('/soil-reports')} className="flex items-center mt-auto border-olive/40 text-olive hover:bg-olive/20 hover:border-olive hover:text-dark-moss transition-all duration-200 text-xs sm:text-sm h-8 sm:h-10">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span>View Reports</span>
              </Button>
            </CardContent>
          </Card>

          {/* Recommendations Card */}
          <Card className="relative overflow-hidden border-2 border-arylide-yellow/30 hover:border-arylide-yellow/50 transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-arylide-yellow/30 to-transparent rounded-full -mr-8 sm:-mr-12 -mt-8 sm:-mt-12" />
            <CardContent className="flex flex-col h-full p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-arylide-yellow to-jonquil rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                  <Wheat className="w-5 h-5 sm:w-7 sm:h-7 text-dark-moss drop-shadow" />
                </div>
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-olive" />
              </div>
              
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Recommendations</h3>
              
              <div className="flex-1 mb-3 sm:mb-4">
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">{recommendations.length}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
                  Total generated this season
                </p>
              </div>
              
              <Button variant="outline" size="sm" onClick={() => navigate('/crop-recommender')} className="flex items-center mt-auto border-arylide-yellow/50 text-olive hover:bg-arylide-yellow/30 hover:border-arylide-yellow hover:text-dark-moss transition-all duration-200 text-xs sm:text-sm h-8 sm:h-10">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span>New Analysis</span>
              </Button>
            </CardContent>
          </Card>

          {/* Farm Status Card */}
          <Card className="relative overflow-hidden border-2 border-jonquil/20 hover:border-jonquil/40 transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-jonquil/20 to-transparent rounded-full -mr-8 sm:-mr-12 -mt-8 sm:-mt-12" />
            <CardContent className="flex flex-col h-full p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-jonquil/80 to-arylide-yellow/70 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                  <Sun className="w-5 h-5 sm:w-7 sm:h-7 text-dark-moss drop-shadow" />
                </div>
                <Badge variant="info">Active</Badge>
              </div>
              
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Farm Status</h3>
              
              <div className="flex-1 mb-3 sm:mb-4">
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="text-lg sm:text-2xl font-bold text-foreground">Healthy</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
                  All systems operational
                </p>
              </div>
              
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="flex items-center mt-auto border-jonquil/40 text-olive hover:bg-jonquil/20 hover:border-jonquil hover:text-dark-moss transition-all duration-200 text-xs sm:text-sm h-8 sm:h-10">
                <LayoutDashboard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span>Overview</span>
              </Button>
            </CardContent>
          </Card>
          </>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Recent Recommendations */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-arylide-yellow/20 shadow-xl">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-dark-moss flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-arylide-yellow to-jonquil rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                      <Wheat className="w-4 h-4 sm:w-5 sm:h-5 text-dark-moss flex-shrink-0 drop-shadow" />
                    </div>
                    <span>Recent Recommendations</span>
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/soil-reports')}
                    className="self-start sm:self-auto text-xs sm:text-sm"
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {loading ? (
                    <>
                      <RecommendationSkeleton />
                      <RecommendationSkeleton />
                      <RecommendationSkeleton />
                    </>
                  ) : recommendations.length > 0 ? (
                    recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-5 bg-gradient-to-r from-vanilla/50 to-arylide-yellow/20 rounded-lg sm:rounded-xl border border-arylide-yellow/30 hover:border-arylide-yellow/50 transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center space-x-3 w-full sm:w-auto">
                          <div className="w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0 bg-gradient-to-br from-olive to-olive/80 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                            <Wheat className="w-4 h-4 sm:w-6 sm:h-6 text-white drop-shadow" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate text-sm sm:text-base">{rec.predictedCrop}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {rec.fieldName} • {rec.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
                          <Badge variant="success" className="text-xs">{rec.status}</Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate('/results')}
                            className="hover:bg-olive/10 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-arylide-yellow/30 to-jonquil/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                        <Wheat className="w-8 h-8 sm:w-10 sm:h-10 text-olive" />
                      </div>
                      <p className="text-muted-foreground mb-3 sm:mb-4 font-medium text-sm sm:text-base">No recommendations yet</p>
                      <Button 
                        variant="primary"
                        onClick={() => navigate('/crop-recommender')}
                        className="shadow-md hover:shadow-lg transition-all duration-200 text-sm"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-2 border-olive/20 shadow-xl">
              <CardHeader className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-dark-moss">Quick Actions</h3>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {loading ? (
                  <QuickActionSkeleton />
                ) : (
                <div className="space-y-2 sm:space-y-3">
                  <Button 
                    variant="primary" 
                    className="w-full flex items-center justify-start shadow-md hover:shadow-lg transition-all duration-200 text-sm h-10 sm:h-11"
                    onClick={() => navigate('/crop-recommender')}
                  >
                    <Sparkles className="w-4 h-4 mr-2 sm:mr-3" />
                    <span>New Crop Analysis</span>
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="w-full flex items-center justify-start shadow-sm hover:shadow-md transition-all duration-200 text-sm h-10 sm:h-11"
                    onClick={() => navigate('/weather')}
                  >
                    <Cloud className="w-4 h-4 mr-2 sm:mr-3" />
                    <span>Weather Forecast</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-start border-olive/40 text-olive hover:bg-olive/20 hover:border-olive hover:text-dark-moss transition-all duration-200 text-sm h-10 sm:h-11"
                    onClick={() => navigate('/soil-reports')}
                  >
                    <FileText className="w-4 h-4 mr-2 sm:mr-3" />
                    <span>Soil Reports</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-start border-olive/40 text-olive hover:bg-olive/20 hover:border-olive hover:text-dark-moss transition-all duration-200 text-sm h-10 sm:h-11"
                    onClick={() => navigate('/market-rates')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2 sm:mr-3" />
                    <span>Market Prices</span>
                  </Button>
                </div>
                )}
              </CardContent>
            </Card>

            {/* Weather Summary */}
            {weather && (
              <Card className="border-2 border-jonquil/20 shadow-xl bg-gradient-to-br from-vanilla to-arylide-yellow/20">
                <CardHeader className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-dark-moss">Weather Details</h3>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  {loading || !weather ? (
                    <WeatherDetailSkeleton />
                  ) : (
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-vanilla/40 rounded-lg hover:bg-vanilla/60 transition-colors">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-jonquil/30 to-arylide-yellow/20 rounded-md sm:rounded-lg flex items-center justify-center">
                          <Thermometer className="w-3 h-3 sm:w-4 sm:h-4 text-olive" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium">Temperature</span>
                      </div>
                      <span className="font-semibold text-dark-moss text-xs sm:text-sm">{weather?.main?.temp ? Math.round(weather.main.temp) : 'N/A'}°C</span>
                    </div>
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-vanilla/40 rounded-lg hover:bg-vanilla/60 transition-colors">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-jonquil/30 to-arylide-yellow/20 rounded-md sm:rounded-lg flex items-center justify-center">
                          <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-olive" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium">Humidity</span>
                      </div>
                      <span className="font-semibold text-dark-moss text-xs sm:text-sm">{weather?.main?.humidity ?? 'N/A'}%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-vanilla/40 rounded-lg hover:bg-vanilla/60 transition-colors">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-jonquil/30 to-arylide-yellow/20 rounded-md sm:rounded-lg flex items-center justify-center">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-olive" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium">Location</span>
                      </div>
                      <span className="font-semibold text-dark-moss text-xs sm:text-sm truncate ml-2">{weather?.name ?? 'Unknown'}</span>
                    </div>
                  </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
