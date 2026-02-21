import { useState } from "react";
import { Button } from "@/components/custom/Button";
import { Input } from "@/components/custom/Input";
import { Label } from "@/components/custom/Label";
import { Card, CardHeader, CardContent } from "@/components/custom/Card";
import { UploadArea } from "@/components/custom/UploadArea";
import { Progress } from "@/components/custom/Progress";
import { Badge } from "@/components/custom/Badge";
import { Sparkles, Sprout, Droplets, Thermometer, Wind, Beaker, CloudSun, MapPin, Upload, Zap, Target, Loader2 } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import api from "@/services/api";

const CropRecommender = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fieldName: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    console.log(`${type}: ${message}`);
    // Replace with your preferred toast implementation
  };
  
  const handleAutoFill = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      showToast("Please login to use this feature", 'error');
      return;
    }

    const user = JSON.parse(userData);
    if (!user.city) {
      showToast("Please update your profile with a city to use this feature", 'error');
      return;
    }

    try {
      setIsAutoFilling(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${user.city}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
      );

      setFormData(prev => ({
        ...prev,
        temperature: response.data.main.temp.toFixed(1),
        humidity: response.data.main.humidity.toString(),
      }));
      showToast(`Weather data fetched for ${user.city}`);
    } catch (error) {
      console.error("Error fetching weather:", error);
      showToast("Failed to fetch weather data", 'error');
    } finally {
      setIsAutoFilling(false);
    }
  };
  
  const handleFileSelect = (files: FileList) => {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
  };
  
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        fieldName: formData.fieldName,
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
        temperature: Number(formData.temperature),
        humidity: Number(formData.humidity),
        ph: Number(formData.ph),
        rainfall: Number(formData.rainfall),
      };

      // 1. Call ML Model Directly
      console.log("Calling ML Model...");
      const mlPayload = {
        N: payload.nitrogen,
        P: payload.phosphorus,
        K: payload.potassium,
        temperature: payload.temperature,
        humidity: payload.humidity,
        ph: payload.ph,
        rainfall: payload.rainfall
      };

      const mlResponse = await axios.post(import.meta.env.VITE_CROP_PREDICTION_API_URL, mlPayload);
      console.log("ML Response:", mlResponse.data);

      let predictedCrop = mlResponse.data.prediction;
      // Handle array response from ML model
      if (Array.isArray(predictedCrop)) {
        predictedCrop = predictedCrop[0];
      }

      if (!predictedCrop) {
        throw new Error("No prediction received from ML model");
      }

      // 2. Save to Backend History
      console.log("Saving to backend...");
      const { data } = await api.post("/predict/save", {
        ...payload,
        predictedCrop
      });
      console.log("Saved to backend:", data);

      navigate("/results", {
        state: {
          formData,
          prediction: { prediction: predictedCrop },
          recommendationId: data._id
        }
      });
    } catch (error: any) {
      console.error("Error in recommendation process:", error);
      showToast(error.response?.data?.message || error.message || "Failed to get recommendation", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen px-3 sm:px-4 py-4 sm:py-6 md:py-8 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="text-center px-2 sm:px-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-dark-moss" />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 leading-tight px-4">
            AI-Powered Crop Recommendation
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
            Get personalized crop suggestions based on your soil conditions, climate data, and agricultural best practices
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="mx-1 sm:mx-0">
          <CardContent className="py-3 sm:py-4 md:py-6 px-3 sm:px-4 md:px-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Step {currentStep} of 3
              </span>
              <span className="text-xs sm:text-sm font-medium text-olive">
                {Math.round((currentStep / 3) * 100)}% Complete
              </span>
            </div>
            <Progress value={(currentStep / 3) * 100} className="mb-2 sm:mb-3 md:mb-4" />
            <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4">
              <div className={`flex items-center gap-1 sm:gap-1.5 md:gap-2 ${currentStep >= 1 ? 'text-olive' : 'text-muted-foreground'}`}>
                <div className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0 ${
                  currentStep >= 1 ? 'bg-olive text-white' : 'bg-muted text-muted-foreground'
                }`}>1</div>
                <span className="text-xs sm:text-sm truncate">Soil Data</span>
              </div>
              <div className={`flex items-center gap-1 sm:gap-1.5 md:gap-2 ${currentStep >= 2 ? 'text-olive' : 'text-muted-foreground'}`}>
                <div className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0 ${
                  currentStep >= 2 ? 'bg-olive text-white' : 'bg-muted text-muted-foreground'
                }`}>2</div>
                <span className="text-xs sm:text-sm truncate">Climate</span>
              </div>
              <div className={`flex items-center gap-1 sm:gap-1.5 md:gap-2 ${currentStep >= 3 ? 'text-olive' : 'text-muted-foreground'}`}>
                <div className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0 ${
                  currentStep >= 3 ? 'bg-olive text-white' : 'bg-muted text-muted-foreground'
                }`}>3</div>
                <span className="text-xs sm:text-sm truncate">Review</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Step 1: Soil Data Input */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mx-1 sm:mx-0"
            >
              <Card>
                <CardHeader className="pb-3 sm:pb-4 md:pb-6 px-3 sm:px-4 md:px-6">
                  <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-olive/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                      <Beaker className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-olive" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">Soil Analysis Data</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                        Upload soil images or enter nutrient values manually
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6 md:pb-8">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    {/* Soil Image Upload - Mobile First, Desktop Second */}
                    <div className="space-y-3 sm:space-y-4 md:space-y-6 order-2 xl:order-1">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground flex items-center">
                        <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2 text-olive flex-shrink-0" />
                        <span>Upload Soil Images</span>
                      </h3>
                      <UploadArea
                        onFileSelect={handleFileSelect}
                        accept="image/*"
                        multiple={true}
                        maxSize={10}
                        title="Upload Soil Photos"
                        description="Drag and drop soil images here (max 10MB each)"
                        icon={<Upload className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12" />}
                      />
                      {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs sm:text-sm font-medium text-foreground">
                            Selected Files ({selectedFiles.length})
                          </p>
                          <div className="space-y-1 max-h-20 overflow-y-auto">
                            {selectedFiles.slice(0, 3).map((file, index) => (
                              <div key={index} className="text-xs sm:text-sm text-muted-foreground truncate">
                                📷 {file.name}
                              </div>
                            ))}
                            {selectedFiles.length > 3 && (
                              <div className="text-xs sm:text-sm text-muted-foreground">
                                +{selectedFiles.length - 3} more files
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Manual Soil Data Entry - Mobile First, Desktop First */}
                    <div className="space-y-4 sm:space-y-6 order-1 xl:order-2">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground flex items-center">
                        <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2 text-olive flex-shrink-0" />
                        <span>Nutrient Values (Optional)</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label htmlFor="nitrogen" className="text-xs sm:text-sm">Nitrogen (N)</Label>
                          <Input
                            id="nitrogen"
                            name="nitrogen"
                            placeholder="0-100 kg/ha"
                            type="number"
                            value={formData.nitrogen}
                            onChange={handleChange}
                            className="h-9 sm:h-10 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phosphorus" className="text-xs sm:text-sm">Phosphorus (P)</Label>
                          <Input
                            id="phosphorus"
                            name="phosphorus"
                            placeholder="0-100 kg/ha"
                            type="number"
                            value={formData.phosphorus}
                            onChange={handleChange}
                            className="h-9 sm:h-10 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="potassium" className="text-xs sm:text-sm">Potassium (K)</Label>
                          <Input
                            id="potassium"
                            name="potassium"
                            placeholder="0-100 kg/ha"
                            type="number"
                            value={formData.potassium}
                            onChange={handleChange}
                            className="h-9 sm:h-10 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ph" className="text-xs sm:text-sm">pH Level</Label>
                          <Input
                            id="ph"
                            name="ph"
                            placeholder="0-14"
                            type="number"
                            step="0.1"
                            value={formData.ph}
                            onChange={handleChange}
                            className="h-9 sm:h-10 text-sm"
                          />
                        </div>
                      </div>
                      <div className="p-3 sm:p-4 bg-vanilla/50 rounded-xl">
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          💡 <strong>Tip:</strong> You can upload soil images for automatic analysis or enter values manually if you have soil test results.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Climate & Field Data */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mx-1 sm:mx-0"
            >
              <Card>
                <CardHeader className="pb-3 sm:pb-4 md:pb-6 px-3 sm:px-4 md:px-6">
                  <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-jonquil/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                      <CloudSun className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-olive" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">Climate & Field Information</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                        Environmental conditions and field details
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6 md:pb-8">
                  <div className="space-y-4 sm:space-y-6">
                    {/* Auto-fill Weather Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-arylide-yellow/20 rounded-xl">
                      <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-olive flex-shrink-0 mt-0.5 sm:mt-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm sm:text-base">Quick Fill Weather Data</p>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Automatically fetch current weather for your location
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleAutoFill}
                        disabled={isAutoFilling}
                        size="sm"
                        className="w-full sm:w-auto flex-shrink-0"
                      >
                        {isAutoFilling ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5 sm:mr-2" /> : <Zap className="w-3.5 h-3.5 mr-1.5 sm:mr-2" />}
                        {isAutoFilling ? "Fetching..." : "Auto-fill"}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {/* Field Information */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground flex items-center">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2 text-olive flex-shrink-0" />
                          <span>Field Details</span>
                        </h3>
                        <div>
                          <Label htmlFor="fieldName" className="text-xs sm:text-sm">Field Name</Label>
                          <Input
                            id="fieldName"
                            name="fieldName"
                            placeholder="e.g., North Field, Plot A"
                            value={formData.fieldName}
                            onChange={handleChange}
                            required
                            className="h-9 sm:h-10 text-sm"
                          />
                        </div>
                      </div>

                      {/* Climate Data */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground flex items-center">
                          <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2 text-olive flex-shrink-0" />
                          <span>Climate Conditions</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Label htmlFor="temperature" className="text-xs sm:text-sm">Temperature (°C)</Label>
                            <Input
                              id="temperature"
                              name="temperature"
                              placeholder="20-35"
                              type="number"
                              value={formData.temperature}
                              onChange={handleChange}
                              required
                              className="h-9 sm:h-10 text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="humidity" className="text-xs sm:text-sm">Humidity (%)</Label>
                            <Input
                              id="humidity"
                              name="humidity"
                              placeholder="40-80"
                              type="number"
                              value={formData.humidity}
                              onChange={handleChange}
                              required
                              className="h-9 sm:h-10 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="rainfall" className="text-xs sm:text-sm">Annual Rainfall (mm)</Label>
                          <Input
                            id="rainfall"
                            name="rainfall"
                            placeholder="200-2000"
                            type="number"
                            value={formData.rainfall}
                            onChange={handleChange}
                            required
                            className="h-9 sm:h-10 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mx-1 sm:mx-0"
            >
              <Card>
                <CardHeader className="pb-3 sm:pb-4 md:pb-6 px-3 sm:px-4 md:px-6">
                  <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-olive/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-olive" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">Review Your Data</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                        Verify all information before getting your crop recommendation
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6 md:pb-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {/* Soil Data Summary */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">Soil Analysis</h3>
                      <div className="space-y-2 sm:space-y-3">
                        {[
                          { label: 'Nitrogen (N)', value: formData.nitrogen, unit: 'kg/ha' },
                          { label: 'Phosphorus (P)', value: formData.phosphorus, unit: 'kg/ha' },
                          { label: 'Potassium (K)', value: formData.potassium, unit: 'kg/ha' },
                          { label: 'pH Level', value: formData.ph, unit: '' }
                        ].map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 sm:p-3 bg-vanilla/30 rounded-lg">
                            <span className="text-xs sm:text-sm font-medium">{item.label}</span>
                            <span className="text-xs sm:text-sm text-muted-foreground text-right">
                              {item.value || 'Not specified'} {item.value && item.unit}
                            </span>
                          </div>
                        ))}
                        {selectedFiles.length > 0 && (
                          <div className="flex justify-between items-center p-2 sm:p-3 bg-vanilla/30 rounded-lg">
                            <span className="text-xs sm:text-sm font-medium">Soil Images</span>
                            <Badge variant="info" className="text-xs">{selectedFiles.length} files</Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Climate & Field Summary */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">Field & Climate</h3>
                      <div className="space-y-2 sm:space-y-3">
                        {[
                          { label: 'Field Name', value: formData.fieldName },
                          { label: 'Temperature', value: formData.temperature, unit: '°C' },
                          { label: 'Humidity', value: formData.humidity, unit: '%' },
                          { label: 'Rainfall', value: formData.rainfall, unit: 'mm' }
                        ].map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 sm:p-3 bg-vanilla/30 rounded-lg">
                            <span className="text-xs sm:text-sm font-medium">{item.label}</span>
                            <span className="text-xs sm:text-sm text-muted-foreground text-right">
                              {item.value || 'Not specified'} {item.value && item.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 px-1 sm:px-0">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="w-full sm:w-auto order-2 sm:order-1"
              size="sm"
            >
              Previous
            </Button>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto order-1 sm:order-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setFormData({
                    fieldName: "",
                    nitrogen: "",
                    phosphorus: "",
                    potassium: "",
                    temperature: "",
                    humidity: "",
                    ph: "",
                    rainfall: "",
                  });
                  setSelectedFiles([]);
                  setCurrentStep(1);
                }}
                className="w-full sm:w-auto"
                size="sm"
              >
                Reset Form
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={nextStep}
                  className="w-full sm:w-auto"
                  size="sm"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  size="sm"
                  className="w-full sm:w-auto min-h-[2.5rem] sm:min-h-[2.75rem]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Get Recommendation
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CropRecommender;
