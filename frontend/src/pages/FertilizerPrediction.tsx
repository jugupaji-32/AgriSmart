import { useState } from "react";
import { Button } from "@/components/custom/Button";
import { Input } from "@/components/custom/Input";
import { Label } from "@/components/custom/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/custom/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/custom/Card";
import { Sparkles, Sprout, Droplets, Thermometer, Beaker, CloudSun, Leaf, TrendingUp } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

const FertilizerPrediction = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nitrogen: "",
        phosphorus: "",
        potassium: "",
        temperature: "",
        humidity: "",
        moisture: "",
        ph: "", // Added pH
        soilType: "",
        cropType: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isAutoFilling, setIsAutoFilling] = useState(false);
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    const handleAutoFill = async () => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            toast.error("Please login to use this feature");
            return;
        }

        const user = JSON.parse(userData);
        if (!user.city) {
            toast.error("Please update your profile with a city to use this feature");
            return;
        }

        try {
            setIsAutoFilling(true);
            const response = await axios.get(
                `${import.meta.env.VITE_OPENWEATHER_API_URL}/weather?q=${user.city}&appid=${API_KEY}&units=metric`
            );

            setFormData(prev => ({
                ...prev,
                temperature: response.data.main.temp.toFixed(1),
                humidity: response.data.main.humidity.toString(),
            }));
            toast.success(`Weather data fetched for ${user.city}`);
        } catch (error) {
            console.error("Error fetching weather:", error);
            toast.error("Failed to fetch weather data");
        } finally {
            setIsAutoFilling(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                "Temparature": Number(formData.temperature),
                "Humidity": Number(formData.humidity),
                "Moisture": Number(formData.moisture),
                "Soil Type": formData.soilType,
                "Crop Type": formData.cropType,
                "Nitrogen": Number(formData.nitrogen),
                "Potassium": Number(formData.potassium),
                "Phosphorous": Number(formData.phosphorus)
            };

            const response = await axios.post(import.meta.env.VITE_FERTILIZER_ML_API_URL, payload);

            navigate("/results", { state: { formData, prediction: response.data, type: "fertilizer" } });
        } catch (error) {
            console.error("Error calling ML model:", error);
            toast.error("Failed to get prediction. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="min-h-screen p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Hero Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-arylide-yellow/40 via-vanilla to-vanilla/60 rounded-2xl p-4 sm:p-6 shadow-lg border border-jonquil/20 transition-all duration-300"
                >
                    <div className="flex flex-col gap-3">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-moss flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-jonquil to-arylide-yellow rounded-xl flex items-center justify-center shadow-md">
                                    <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-dark-moss" />
                                </div>
                                <span>Fertilizer Prediction</span>
                            </div>
                            <span className="text-2xl drop-shadow">🌱</span>
                        </h1>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm sm:text-base text-olive/80 font-medium leading-relaxed">
                                Get AI-powered fertilizer recommendations based on your soil and crop conditions
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAutoFill}
                                disabled={isAutoFilling}
                                className="flex items-center gap-2 text-sm h-9 px-4 w-full sm:w-fit justify-center sm:justify-start"
                            >
                                {isAutoFilling ? (
                                    <div className="w-4 h-4 border-2 border-olive border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <CloudSun className="w-4 h-4" />
                                )}
                                <span>Auto-fill Weather</span>
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Feature Cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    <Card className="relative overflow-hidden border-2 border-jonquil/20 hover:border-jonquil/40 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-vanilla to-vanilla/80">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-olive/20 to-olive/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Sprout className="w-5 h-5 text-olive" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold text-dark-moss">Nutrient Analysis</h3>
                                <p className="text-xs text-olive/70">Optimize NPK levels</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-2 border-jonquil/20 hover:border-jonquil/40 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-vanilla to-vanilla/80">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-jonquil/30 to-jonquil/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Beaker className="w-5 h-5 text-olive" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold text-dark-moss">Soil Analysis</h3>
                                <p className="text-xs text-olive/70">Tailored soil conditions</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-2 border-jonquil/20 hover:border-jonquil/40 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-vanilla to-vanilla/80 sm:col-span-2 lg:col-span-1">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-arylide-yellow/30 to-arylide-yellow/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-5 h-5 text-olive" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold text-dark-moss">Maximize Yield</h3>
                                <p className="text-xs text-olive/70">AI-powered insights</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="relative overflow-hidden border-2 border-jonquil/20 hover:border-jonquil/40 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-vanilla to-vanilla/80">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-olive/10 to-transparent rounded-full -mr-16 -mt-16" />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg sm:text-xl font-bold flex flex-col sm:flex-row items-start sm:items-center gap-2 text-dark-moss relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-olive to-olive/80 rounded-lg flex items-center justify-center shadow-md">
                                        <Beaker className="w-4 h-4 text-white" />
                                    </div>
                                    <span>Enter Soil & Crop Details</span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Input Fields Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {/* Nitrogen */}
                                    <div className="space-y-2">
                                        <Label htmlFor="nitrogen" className="text-sm font-medium flex items-center gap-2">
                                            <Sprout className="w-4 h-4 text-olive" /> 
                                            <span>Nitrogen (N)</span>
                                        </Label>
                                        <Input
                                            id="nitrogen"
                                            name="nitrogen"
                                            type="number"
                                            placeholder="e.g., 37"
                                            value={formData.nitrogen}
                                            onChange={handleChange}
                                            className="h-10 sm:h-9"
                                            required
                                        />
                                    </div>

                                    {/* Phosphorus */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phosphorus" className="text-sm font-medium flex items-center gap-2">
                                            <Sprout className="w-4 h-4 text-olive" /> 
                                            <span>Phosphorus (P)</span>
                                        </Label>
                                        <Input
                                            id="phosphorus"
                                            name="phosphorus"
                                            type="number"
                                            placeholder="e.g., 0"
                                            value={formData.phosphorus}
                                            onChange={handleChange}
                                            className="h-10 sm:h-9"
                                            required
                                        />
                                    </div>

                                    {/* Potassium */}
                                    <div className="space-y-2">
                                        <Label htmlFor="potassium" className="text-sm font-medium flex items-center gap-2">
                                            <Sprout className="w-4 h-4 text-olive" /> 
                                            <span>Potassium (K)</span>
                                        </Label>
                                        <Input
                                            id="potassium"
                                            name="potassium"
                                            type="number"
                                            placeholder="e.g., 0"
                                            value={formData.potassium}
                                            onChange={handleChange}
                                            className="h-10 sm:h-9"
                                            required
                                        />
                                    </div>

                                    {/* Temperature */}
                                    <div className="space-y-2">
                                        <Label htmlFor="temperature" className="text-sm font-medium flex items-center gap-2">
                                            <Thermometer className="w-4 h-4 text-olive" /> 
                                            <span>Temperature (°C)</span>
                                        </Label>
                                        <Input
                                            id="temperature"
                                            name="temperature"
                                            type="number"
                                            step="0.1"
                                            placeholder="e.g., 26"
                                            value={formData.temperature}
                                            onChange={handleChange}
                                            className="h-10 sm:h-9"
                                            required
                                        />
                                    </div>

                                    {/* Humidity */}
                                    <div className="space-y-2">
                                        <Label htmlFor="humidity" className="text-sm font-medium flex items-center gap-2">
                                            <Droplets className="w-4 h-4 text-olive" /> 
                                            <span>Humidity (%)</span>
                                        </Label>
                                        <Input
                                            id="humidity"
                                            name="humidity"
                                            type="number"
                                            step="0.1"
                                            placeholder="e.g., 52"
                                            value={formData.humidity}
                                            onChange={handleChange}
                                            className="h-10 sm:h-9"
                                            required
                                        />
                                    </div>

                                    {/* Moisture */}
                                    <div className="space-y-2">
                                        <Label htmlFor="moisture" className="text-sm font-medium flex items-center gap-2">
                                            <Droplets className="w-4 h-4 text-olive" /> 
                                            <span>Moisture</span>
                                        </Label>
                                        <Input
                                            id="moisture"
                                            name="moisture"
                                            type="number"
                                            step="0.1"
                                            placeholder="e.g., 38"
                                            value={formData.moisture}
                                            onChange={handleChange}
                                            className="h-10 sm:h-9"
                                            required
                                        />
                                    </div>

                                    {/* Soil pH */}
                                    <div className="space-y-2">
                                        <Label htmlFor="ph" className="text-sm font-medium flex items-center gap-2">
                                            <Beaker className="w-4 h-4 text-olive" /> 
                                            <span>Soil pH</span>
                                        </Label>
                                        <Input
                                            id="ph"
                                            name="ph"
                                            type="number"
                                            step="0.1"
                                            placeholder="e.g., 6.5"
                                            value={formData.ph}
                                            onChange={handleChange}
                                            className="h-10 sm:h-9"
                                            required
                                        />
                                    </div>

                                    {/* Soil Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="soilType" className="text-sm font-medium flex items-center gap-2">
                                            <Beaker className="w-4 h-4 text-olive" /> 
                                            <span>Soil Type</span>
                                        </Label>
                                        <Select 
                                            name="soilType" 
                                            value={formData.soilType}
                                            onValueChange={(value) => handleSelectChange("soilType", value)}
                                            required
                                        >
                                            <SelectTrigger className="h-10 sm:h-9">
                                                <SelectValue placeholder="Select Soil Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Sandy">Sandy</SelectItem>
                                                <SelectItem value="Loamy">Loamy</SelectItem>
                                                <SelectItem value="Black">Black</SelectItem>
                                                <SelectItem value="Red">Red</SelectItem>
                                                <SelectItem value="Clayey">Clayey</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Crop Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="cropType" className="text-sm font-medium flex items-center gap-2">
                                            <Sprout className="w-4 h-4 text-olive" /> 
                                            <span>Crop Type</span>
                                        </Label>
                                        <Select 
                                            name="cropType" 
                                            value={formData.cropType}
                                            onValueChange={(value) => handleSelectChange("cropType", value)}
                                            required
                                        >
                                            <SelectTrigger className="h-10 sm:h-9">
                                                <SelectValue placeholder="Select Crop Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Wheat">Wheat</SelectItem>
                                                <SelectItem value="Maize">Maize</SelectItem>
                                                <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                                                <SelectItem value="Cotton">Cotton</SelectItem>
                                                <SelectItem value="Ground Nuts">Ground Nuts</SelectItem>
                                                <SelectItem value="Oil seeds">Oil seeds</SelectItem>
                                                <SelectItem value="Tobacco">Tobacco</SelectItem>
                                                <SelectItem value="Barley">Barley</SelectItem>
                                                <SelectItem value="Millets">Millets</SelectItem>
                                                <SelectItem value="Paddy">Paddy</SelectItem>
                                                <SelectItem value="Pulses">Pulses</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        className="btn-accent flex-1 flex items-center justify-center gap-2 h-12 sm:h-10 text-sm font-semibold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                                <span>Analyzing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4" />
                                                <span>Predict Fertilizer</span>
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full sm:w-auto h-12 sm:h-10 px-6 text-sm"
                                        onClick={() => setFormData({
                                            nitrogen: "",
                                            phosphorus: "",
                                            potassium: "",
                                            temperature: "",
                                            humidity: "",
                                            moisture: "",
                                            ph: "",
                                            soilType: "",
                                            cropType: "",
                                        })}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default FertilizerPrediction;
