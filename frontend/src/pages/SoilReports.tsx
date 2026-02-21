import { useState, useEffect } from "react";
import { Card } from "@/components/custom/Card";
import { Button } from "@/components/custom/Button";
import { Badge } from "@/components/custom/Badge";
import { Skeleton } from "@/components/custom/Skeleton";
import { FileText, Download, Calendar, MapPin, Loader2, Sprout } from "lucide-react";

import { Link } from "react-router-dom";
import api from "@/services/api";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface Report {
  _id: string;
  fieldName: string;
  createdAt: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  predictedCrop: string;
}

const SoilReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await api.get("/predict/history");
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async (report: Report) => {
    try {
      setGeneratingId(report._id);
      const { data } = await api.post("/predict/report", report);

      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(40, 167, 69); // Green color
      doc.text("Soil Analysis & Crop Report", 20, 20);

      // Meta Info
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Field Name: ${report.fieldName}`, 20, 35);
      doc.text(`Date: ${new Date(report.createdAt).toLocaleDateString()}`, 20, 42);
      doc.text(`Recommended Crop: ${report.predictedCrop}`, 20, 49);

      // Parameters Table-like structure
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 55, 190, 55);

      doc.setFontSize(10);
      doc.text(`Nitrogen: ${report.nitrogen}`, 20, 62);
      doc.text(`Phosphorus: ${report.phosphorus}`, 70, 62);
      doc.text(`Potassium: ${report.potassium}`, 120, 62);

      doc.text(`pH Level: ${report.ph}`, 20, 69);
      doc.text(`Temperature: ${report.temperature}°C`, 70, 69);
      doc.text(`Humidity: ${report.humidity}%`, 120, 69);

      doc.line(20, 75, 190, 75);

      // AI Analysis Content
      doc.setFontSize(14);
      doc.setTextColor(40, 167, 69);
      doc.text("Detailed Analysis", 20, 85);

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);

      // Split text to fit page
      const splitText = doc.splitTextToSize(data.report, 170);
      let y = 95;

      // Add text with pagination
      for (let i = 0; i < splitText.length; i++) {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(splitText[i], 20, y);
        y += 7;
      }

      doc.save(`Soil_Report_${report.fieldName.replace(/\s+/g, '_')}.pdf`);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate report");
    } finally {
      setGeneratingId(null);
    }
  };

  const getAverage = (key: keyof Report) => {
    if (reports.length === 0) return 0;
    const sum = reports.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
    return (sum / reports.length).toFixed(1);
  };

  return (
    
      <div className="container mx-auto px-4 py-6 sm:py-12 max-w-6xl">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 gap-0 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">Soil Test Reports</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              View and download your soil analysis reports
            </p>
          </div>
          <div className="w-full sm:w-auto sm:flex-shrink-0">
            <Link to="/crop-recommender">
              <Button size="lg" className="bg-jonquil hover:bg-jonquil/90 text-dark-moss w-full sm:w-auto flex items-center justify-center">
                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>New Analysis</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-3 sm:p-6 border-l-4 border-l-olive bg-card/50 backdrop-blur-sm">
            <h3 className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Total Reports</h3>
            <p className="text-xl sm:text-3xl font-bold text-olive">{reports.length}</p>
          </Card>
          <Card className="p-3 sm:p-6 border-l-4 border-l-jonquil bg-card/50 backdrop-blur-sm">
            <h3 className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Avg Nitrogen</h3>
            <p className="text-xl sm:text-3xl font-bold text-foreground">{getAverage('nitrogen')}</p>
          </Card>
          <Card className="p-3 sm:p-6 border-l-4 border-l-arylide-yellow bg-card/50 backdrop-blur-sm">
            <h3 className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Avg Phosphorus</h3>
            <p className="text-xl sm:text-3xl font-bold text-foreground">{getAverage('phosphorus')}</p>
          </Card>
          <Card className="p-3 sm:p-6 border-l-4 border-l-olive bg-card/50 backdrop-blur-sm">
            <h3 className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Avg Potassium</h3>
            <p className="text-xl sm:text-3xl font-bold text-foreground">{getAverage('potassium')}</p>
          </Card>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm border border-olive/10">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-6 w-48" />
                          <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-32" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pl-0 sm:pl-13">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="space-y-1">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-5 w-12" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <Skeleton className="h-10 w-full sm:w-32" />
                  </div>
                </Card>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4 text-muted-foreground">
              <p className="text-sm sm:text-base">No reports found. Start by creating a new analysis.</p>
            </div>
          ) : (
            reports.map((report) => (
              <Card key={report._id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border border-olive/10">
                <div className="flex flex-col gap-4 sm:gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-olive/20 flex items-center justify-center flex-shrink-0">
                        <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-olive" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground text-base sm:text-lg truncate">{report.fieldName}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                          <Badge variant="default" className="bg-olive/10 text-olive border border-olive/20 text-xs self-start sm:self-auto">
                            {report.predictedCrop}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">pH Level</p>
                        <p className="font-semibold text-foreground text-sm sm:text-base">{report.ph}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Nitrogen</p>
                        <p className="font-semibold text-foreground text-sm sm:text-base">{report.nitrogen}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phosphorus</p>
                        <p className="font-semibold text-foreground text-sm sm:text-base">{report.phosphorus}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Potassium</p>
                        <p className="font-semibold text-foreground text-sm sm:text-base">{report.potassium}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Temp</p>
                        <p className="font-semibold text-foreground text-sm sm:text-base">{report.temperature}°C</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Humidity</p>
                        <p className="font-semibold text-foreground text-sm sm:text-base">{report.humidity}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center sm:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-jonquil hover:bg-jonquil/90 text-dark-moss border-jonquil w-full sm:w-auto flex items-center justify-center"
                      onClick={() => handleGenerateReport(report)}
                      disabled={generatingId === report._id}
                    >
                      {generatingId === report._id ? (
                        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                      ) : (
                        <Download className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span>{generatingId === report._id ? "Generating..." : "AI Report"}</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    
  );
};

export default SoilReports;
