import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/custom/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/custom/Card";
import { Badge } from "@/components/custom/Badge";
import { CheckCircle, ArrowLeft, Download, Sprout, Droplets, Thermometer, Wind, Beaker, Leaf, ShoppingBag, Tag, AlertCircle, Info, Loader2, FileText, Calendar, MapPin, TrendingUp } from "lucide-react";

import api from "@/services/api";
import { toast } from "sonner";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

// Map crops to Unsplash images
const cropImages: Record<string, string> = {
  rice: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=800&auto=format&fit=crop",
  maize: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=800&auto=format&fit=crop",
  chickpea: "https://images.unsplash.com/photo-1610415946035-bad6fc9f5b8e?q=80&w=800&auto=format&fit=crop",
  kidneybeans: "https://images.unsplash.com/photo-1583064313642-a7c149480c7e?q=80&w=800&auto=format&fit=crop",
  pigeonpeas: "https://images.unsplash.com/photo-1557844352-761f2565b576?q=80&w=800&auto=format&fit=crop",
  mothbeans: "https://images.unsplash.com/photo-1557844352-761f2565b576?q=80&w=800&auto=format&fit=crop",
  mungbean: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?q=80&w=800&auto=format&fit=crop",
  blackgram: "https://images.unsplash.com/photo-1596040033229-a0b1e2c8f99e?q=80&w=800&auto=format&fit=crop",
  lentil: "https://images.unsplash.com/photo-1558035520-bb3dd8b4695c?q=80&w=800&auto=format&fit=crop",
  pomegranate: "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=800&auto=format&fit=crop",
  banana: "https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=800&auto=format&fit=crop",
  mango: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop",
  grapes: "https://images.unsplash.com/photo-1537640538965-1756fb179c26?q=80&w=800&auto=format&fit=crop",
  watermelon: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop",
  muskmelon: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=800&auto=format&fit=crop",
  apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=800&auto=format&fit=crop",
  orange: "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?q=80&w=800&auto=format&fit=crop",
  papaya: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=800&auto=format&fit=crop",
  coconut: "https://images.unsplash.com/photo-1589499188344-ee8f56d8dbc4?q=80&w=800&auto=format&fit=crop",
  cotton: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=800&auto=format&fit=crop",
  jute: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop",
  coffee: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
};

// Fertilizer Data (Using Unsplash images for reliability)
const fertilizerData: Record<string, { image: string; npk: string; type: string; description: string }> = {
  "Urea": {
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=800&auto=format&fit=crop", // White powder/granules
    npk: "46-0-0",
    type: "Synthetic",
    description: "High nitrogen fertilizer for promoting green leafy growth."
  },
  "DAP": {
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800&auto=format&fit=crop", // Granules
    npk: "18-46-0",
    type: "Synthetic",
    description: "Excellent source of phosphorus and nitrogen for root development."
  },
  "14-35-14": {
    image: "https://images.unsplash.com/photo-1563514227146-8930d4f04494?q=80&w=800&auto=format&fit=crop", // Agriculture generic
    npk: "14-35-14",
    type: "Complex",
    description: "Balanced fertilizer with high phosphorus for flowering and fruiting."
  },
  "28-28": {
    image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=800&auto=format&fit=crop", // Field
    npk: "28-28-0",
    type: "Complex",
    description: "High nitrogen and phosphorus content for vigorous growth."
  },
  "17-17-17": {
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop", // Field
    npk: "17-17-17",
    type: "Balanced",
    description: "Equal balance of nutrients for general purpose crop maintenance."
  },
  "20-20": {
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop", // Field
    npk: "20-20-0",
    type: "Complex",
    description: "Balanced nitrogen and phosphorus for steady growth."
  },
  "10-26-26": {
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=800&auto=format&fit=crop", // Field
    npk: "10-26-26",
    type: "Complex",
    description: "High phosphorus and potassium for quality produce and disease resistance."
  }
};

// Branded Products Data (Using Unsplash/Placeholder images for reliability)
const brandedProducts: Record<string, Array<{ id: string; brand: string; name: string; price: string; weight: string; image: string }>> = {
  "Urea": [
    { id: "u1", brand: "IFFCO", name: "Neem Coated Urea", price: "₹266.50", weight: "45 kg", image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=400&auto=format&fit=crop" },
    { id: "u2", brand: "Coromandel", name: "Gromor Urea", price: "₹300.00", weight: "50 kg", image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=400&auto=format&fit=crop" },
    { id: "u3", brand: "Yara", name: "YaraVera Urea", price: "₹350.00", weight: "50 kg", image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=400&auto=format&fit=crop" }
  ],
  "DAP": [
    { id: "d1", brand: "IFFCO", name: "DAP 18-46-0", price: "₹1,350.00", weight: "50 kg", image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=400&auto=format&fit=crop" },
    { id: "d2", brand: "Coromandel", name: "Gromor DAP", price: "₹1,400.00", weight: "50 kg", image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=400&auto=format&fit=crop" }
  ]
};

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(location.state?.formData);
  const [resultType, setResultType] = useState(location.state?.type); // 'crop' or 'fertilizer'
  const [prediction, setPrediction] = useState(location.state?.prediction);
  const [isLoading, setIsLoading] = useState(false);
  const [allRecommendations, setAllRecommendations] = useState<any[]>([]);
  const [showList, setShowList] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch all recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/predict/history');
        setAllRecommendations(data || []);
        
        // If coming from navigation state, show the result directly
        if (formData && prediction) {
          setShowList(false);
        } else if (data && data.length > 0) {
          // If no state data, show the list
          setShowList(true);
        }
      } catch (error: any) {
        console.error('Error fetching recommendations:', error);
        toast.error('Failed to load analysis history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Handle selecting a specific recommendation
  const handleSelectRecommendation = (rec: any) => {
    setFormData({
      fieldName: rec.fieldName,
      nitrogen: rec.nitrogen,
      phosphorus: rec.phosphorus,
      potassium: rec.potassium,
      temperature: rec.temperature,
      humidity: rec.humidity,
      ph: rec.ph,
      rainfall: rec.rainfall,
    });
    
    setPrediction({ prediction: rec.predictedCrop });
    setResultType('crop');
    setShowList(false);
  };

  // Parse prediction
  const rawPrediction = prediction?.prediction;
  const predictionName = Array.isArray(rawPrediction) ? rawPrediction[0] : rawPrediction;
  const formattedName = predictionName ? predictionName.charAt(0).toUpperCase() + predictionName.slice(1) : "Unknown";

  // --- FERTILIZER VIEW ---
  if (resultType === 'fertilizer') {
    // Case-insensitive lookup
    const fertilizerKey = Object.keys(fertilizerData).find(key => key.toLowerCase() === predictionName?.toLowerCase()) || "Urea";
    const fertilizer = fertilizerData[fertilizerKey] || fertilizerData["Urea"];

    const products = brandedProducts[fertilizerKey] || brandedProducts["Urea"]; // Fallback for demo

    // Prepare chart data
    const npkValues = fertilizer.npk.split('-').map(Number);
    const chartData = [
      { name: 'Nitrogen', value: npkValues[0] || 0, fill: '#60a5fa' },
      { name: 'Phosphorus', value: npkValues[1] || 0, fill: '#c084fc' },
      { name: 'Potassium', value: npkValues[2] || 0, fill: '#f472b6' },
      { name: 'Soil pH', value: Number(formData?.ph) || 0, fill: '#34d399' },
    ];

    return (
        <div className="min-h-full p-4 md:p-6 lg:p-8">
          <div className="mb-6 md:mb-8">
            <Link to="/fertilizer-prediction">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Back to Predictor</span>
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-moss mb-2">Recommended Fertilizer: {formattedName}</h1>
            <p className="text-sm md:text-base text-muted-foreground">Based on analysis for your soil conditions</p>
          </div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-64 md:h-80 rounded-2xl overflow-hidden relative mb-6 md:mb-8"
          >
            <img
              src={fertilizer.image}
              alt={formattedName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-moss/90 via-dark-moss/50 to-transparent flex items-end p-6 md:p-8">
              <div className="text-white">
                <Badge variant="success" className="mb-2 text-sm md:text-base">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Best Match
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{formattedName}</h2>
                <p className="text-vanilla/90 text-sm md:text-base">{fertilizer.description}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & Guide */}
            <div className="lg:col-span-2 space-y-8">

              {/* Nutrient Levels Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Nutrient Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAD465" opacity={0.3} />
                        <XAxis dataKey="name" tick={{ fill: '#7E8407', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#7E8407', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          cursor={{ fill: '#F5EAB9' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: '#FFFEF9' }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Application Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Fertilizer Application Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 md:space-y-6">
                    {[
                      { title: "Measure Correctly", desc: "Calculate the required amount based on your field size. Avoid over-application." },
                      { title: "Apply Evenly", desc: "Broadcast granules uniformly across the soil surface or use a spreader." },
                      { title: "Incorporate into Soil", desc: "Lightly rake the soil to mix the fertilizer into the top layer." },
                      { title: "Water Thoroughly", desc: "Water the field immediately after application to help nutrients dissolve." }
                    ].map((step, idx) => (
                      <div key={idx} className="flex gap-3 md:gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-jonquil/20 text-olive flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground text-sm md:text-base">{step.title}</h4>
                          <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Available Products List */}
              {products.length > 0 && (
                <div className="pt-4">
                  <h2 className="text-xl md:text-2xl font-bold text-dark-moss mb-4 md:mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-olive" />
                    Available Brands & Prices
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-all">
                          <CardContent className="flex p-0">
                            <div className="w-1/3 bg-vanilla/30 p-4 flex items-center justify-center">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div className="w-2/3 p-4 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{product.brand}</p>
                                  <Badge variant="info" className="text-xs">{product.weight}</Badge>
                                </div>
                                <h3 className="text-sm md:text-base font-bold text-foreground">{product.name}</h3>
                              </div>
                              <div className="flex items-center justify-between mt-4">
                                <span className="text-base md:text-lg font-bold text-olive">{product.price}</span>
                                <Button size="sm" variant="outline" className="h-8 text-xs">View</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Side Cards */}
            <div className="space-y-4 md:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex gap-2 text-xs md:text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-olive flex-shrink-0" />
                      <span>Promotes rapid growth</span>
                    </li>
                    <li className="flex gap-2 text-xs md:text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-olive flex-shrink-0" />
                      <span>Increases crop yield</span>
                    </li>
                    <li className="flex gap-2 text-xs md:text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-olive flex-shrink-0" />
                      <span>Improves soil health</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Precautions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-arylide-yellow/20 p-4 rounded-xl border border-jonquil/30">
                    <div className="flex gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-olive" />
                      <span className="font-semibold text-dark-moss text-sm">Handle with Care</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Store in a cool, dry place. Keep away from children and pets. Wear gloves during application.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Market Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4 leading-relaxed">
                    Current market trends show stable prices for {formattedName}. Consider buying in bulk for better rates.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="w-3 h-3" />
                    <span>Updated today</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    );
  }

  // --- CROP RECOMMENDATION VIEW (EXISTING) ---

  // Get image or default
  const cropImage = cropImages[predictionName?.toLowerCase()] || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop";

  // Data for Radar Chart (Environmental Profile)
  const radarData = formData ? [
    { subject: 'Temp', A: (Number(formData.temperature) / 50) * 100, fullMark: 100 },
    { subject: 'Humidity', A: Number(formData.humidity), fullMark: 100 },
    { subject: 'pH', A: (Number(formData.ph) / 14) * 100, fullMark: 100 },
    { subject: 'Rainfall', A: (Number(formData.rainfall) / 300) * 100, fullMark: 100 },
  ] : [];

  // Data for Bar Chart (Nutrients)
  const nutrientData = formData ? [
    { name: 'N', value: Number(formData.nitrogen), color: '#3b82f6' },
    { name: 'P', value: Number(formData.phosphorus), color: '#8b5cf6' },
    { name: 'K', value: Number(formData.potassium), color: '#ec4899' },
  ] : [];

  const [isGenerating, setIsGenerating] = useState(false);

  const [aiReportText, setAiReportText] = useState<string>("");

  const handleAIReport = async () => {
    try {
      setIsGenerating(true);

      const payload = {
        ...formData,
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
        temperature: Number(formData.temperature),
        humidity: Number(formData.humidity),
        ph: Number(formData.ph),
        rainfall: Number(formData.rainfall),
        predictedCrop: predictionName,
        fieldName: formData.fieldName || "Field"
      };

      // 1. Get AI Report Text
      const { data } = await api.post("/predict/report", payload);
      setAiReportText(data.report);
      
      // Show success notification with detailed message
      toast.success("AI Report Generated Successfully!", {
        description: "Your comprehensive soil analysis report is ready. Click 'Save Result' to download the PDF.",
        duration: 5000,
      });

    } catch (error: any) {
      console.error("Error generating AI report:", error);
      toast.error(error.response?.data?.message || "Failed to generate AI report");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!aiReportText) {
      toast.error("Please generate the AI report first.");
      return;
    }
    setIsDownloading(true);

    try {
      const payload = {
        cropName: formattedName,
        soilData: {
          N: formData.nitrogen,
          P: formData.phosphorus,
          K: formData.potassium,
          ph: formData.ph,
          humidity: formData.humidity,
          temperature: formData.temperature,
          rainfall: formData.rainfall
        },
        aiReport: aiReportText
      };

      const response = await api.post('/predict/download-report', payload, {
        responseType: 'blob'
      });

      // Create a URL for the file and trigger download
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Soil_Report_${formattedName}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-full flex items-center justify-center p-8">
          <Card className="text-center p-8">
            <Loader2 className="w-12 h-12 animate-spin text-olive mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-dark-moss">Loading Results...</h2>
            <p className="text-muted-foreground">Please wait while we fetch your analysis data.</p>
          </Card>
        </div>
    );
  }

  // Show list of all analyses
  if (showList) {
    return (
        <div className="min-h-full p-4 md:p-6 lg:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-moss mb-2">Analysis History</h1>
            <p className="text-sm md:text-base text-muted-foreground">Select any analysis to view detailed results</p>
          </div>

          {allRecommendations.length === 0 ? (
            <Card className="text-center p-8">
              <Sprout className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-dark-moss">No Analysis Found</h2>
              <p className="text-muted-foreground mb-6">You haven't performed any crop analysis yet.</p>
              <Link to="/crop-recommender">
                <Button>Start New Analysis</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {allRecommendations.map((rec, index) => {
                const cropName = rec.predictedCrop?.charAt(0).toUpperCase() + rec.predictedCrop?.slice(1);
                const cropImg = cropImages[rec.predictedCrop?.toLowerCase()] || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop";
                const date = new Date(rec.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                });

                return (
                  <motion.div
                    key={rec._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card 
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                      onClick={() => handleSelectRecommendation(rec)}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={cropImg}
                          alt={cropName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-moss/90 to-transparent flex items-end p-4">
                          <div className="text-white">
                            <Badge variant="success" className="mb-2 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" /> Analyzed
                            </Badge>
                            <h3 className="text-xl font-bold">{cropName}</h3>
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 text-olive" />
                            <span className="font-medium">{rec.fieldName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 text-olive" />
                            <span>{date}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">N</p>
                              <p className="font-bold text-sm text-olive">{rec.nitrogen}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">P</p>
                              <p className="font-bold text-sm text-olive">{rec.phosphorus}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">K</p>
                              <p className="font-bold text-sm text-olive">{rec.potassium}</p>
                            </div>
                          </div>

                          <Button className="w-full mt-4" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
    );
  }

  if (!formData) {
    return (
        <div className="min-h-full flex items-center justify-center p-8">
          <Card className="text-center p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-dark-moss">No Data Found</h2>
            <p className="text-muted-foreground mb-6">Please start a new analysis to see results.</p>
            <Link to="/crop-recommender">
              <Button>Go Back</Button>
            </Link>
          </Card>
        </div>
    );
  }

  return (
      <div className="h-full overflow-hidden flex flex-col p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6 shrink-0">
          <div className="flex gap-2">
            {allRecommendations.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowList(true)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>All Analyses</span>
              </Button>
            )}
            <Link to="/crop-recommender">
              <Button variant="outline" size="sm">
                <Sprout className="w-4 h-4 mr-2" />
                <span>New Analysis</span>
              </Button>
            </Link>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAIReport}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              <span className="hidden sm:inline">AI Report</span>
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2"
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span className="hidden sm:inline">Save Result</span>
            </Button>
          </div>
        </div>

        {/* Main Content Area to be Captured */}
        <div ref={resultRef} className="flex-1 bg-background rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-full">

          {/* Left Column: Image & Key Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 relative h-full"
          >
            <div className="absolute inset-0">
              <img
                src={cropImage}
                alt={formattedName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-moss/95 via-dark-moss/60 to-transparent flex flex-col justify-end p-6 md:p-8">
                <Badge variant="success" className="self-start mb-4">
                  <CheckCircle className="w-3 h-3 mr-1" /> Best Match
                </Badge>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vanilla mb-2">
                  {formattedName}
                </h1>
                <p className="text-vanilla/80 text-xs md:text-sm mb-4 md:mb-6 leading-relaxed">
                  Optimal growth conditions detected based on your soil profile.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-vanilla/10 backdrop-blur-md p-3 rounded-xl border border-vanilla/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="w-4 h-4 text-jonquil" />
                      <span className="text-xs text-vanilla/90 font-medium">Water</span>
                    </div>
                    <p className="text-vanilla font-bold text-sm">Moderate</p>
                  </div>
                  <div className="bg-vanilla/10 backdrop-blur-md p-3 rounded-xl border border-vanilla/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Sprout className="w-4 h-4 text-jonquil" />
                      <span className="text-xs text-vanilla/90 font-medium">Growth</span>
                    </div>
                    <p className="text-vanilla font-bold text-sm">Fast</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Charts & Data */}
          <div className="lg:col-span-8 p-4 md:p-6 lg:p-8 flex flex-col h-full overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6 shrink-0">
              {/* Radar Chart */}
              <Card className="p-4">
                <h3 className="text-xs md:text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-olive" /> Environmental Profile
                </h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#EAD465" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#7E8407', fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Conditions" dataKey="A" stroke="#7E8407" strokeWidth={2} fill="#7E8407" fillOpacity={0.2} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px', backgroundColor: '#FFFEF9' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Bar Chart */}
              <Card className="p-4">
                <h3 className="text-xs md:text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-olive" /> Nutrient Analysis
                </h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={nutrientData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAD465" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fill: '#7E8407', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#7E8407', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#F5EAB9' }} contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px', backgroundColor: '#FFFEF9' }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                        {nutrientData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Detailed Stats Grid */}
            <div className="flex-1">
              <h3 className="text-xs md:text-sm font-semibold text-foreground mb-4">Detailed Parameters</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-3">
                {[
                  { label: "N", value: formData.nitrogen, unit: "kg/ha", color: "text-olive", bg: "bg-jonquil/10" },
                  { label: "P", value: formData.phosphorus, unit: "kg/ha", color: "text-olive", bg: "bg-arylide-yellow/20" },
                  { label: "K", value: formData.potassium, unit: "kg/ha", color: "text-olive", bg: "bg-vanilla/70" },
                  { label: "Temp", value: formData.temperature, unit: "°C", color: "text-olive", bg: "bg-jonquil/10" },
                  { label: "Humid", value: formData.humidity, unit: "%", color: "text-olive", bg: "bg-arylide-yellow/20" },
                  { label: "pH", value: formData.ph, unit: "", color: "text-olive", bg: "bg-vanilla/70" },
                  { label: "Rain", value: formData.rainfall, unit: "mm", color: "text-olive", bg: "bg-jonquil/10" },
                ].map((item, index) => (
                  <div key={index} className={`p-2 md:p-3 rounded-xl text-center ${item.bg}`}>
                    <p className={`text-xs font-bold ${item.color} mb-1`}>{item.label}</p>
                    <p className="font-bold text-foreground text-xs md:text-sm">{item.value}</p>
                    <p className="text-[10px] text-muted-foreground">{item.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Results;
