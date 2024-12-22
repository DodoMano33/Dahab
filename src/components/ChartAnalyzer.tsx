import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { AnalysisResult } from "./AnalysisResult";
import { Canvas } from "./Canvas";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { toast } from "sonner";

interface AnalysisData {
  pattern: string;
  direction: string;
  support: number;
  resistance: number;
  targets?: number[];
}

export const ChartAnalyzer = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = (imageData: string) => {
    setImage(imageData);
    analyzeChart(imageData);
  };

  const analyzeChart = async (imageData: string) => {
    setIsAnalyzing(true);
    console.log("Analyzing chart...");
    
    // محاكاة تحليل الصورة - سيتم استبداله بالتحليل الفعلي لاحقاً
    setTimeout(() => {
      const mockAnalysis = {
        pattern: "نموذج الرأس والكتفين",
        direction: "هابط",
        support: 100,
        resistance: 150,
        targets: [95, 90, 85] // أهداف متوقعة
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
      toast.success("تم تحليل الشارت بنجاح");
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-right">تحميل الشارت</h2>
          <ImageUploader onImageCapture={handleImageUpload} />
          
          <div className="flex gap-4 mt-4 justify-center">
            <Button 
              variant="outline"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <Upload className="ml-2" />
              تحميل صورة
            </Button>
            
            <Button
              variant="outline"
              onClick={() => document.getElementById('cameraInput')?.click()}
            >
              <Camera className="ml-2" />
              التقاط صورة
            </Button>
          </div>
        </div>

        {image && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-right">الشارت</h2>
            <Canvas image={image} analysis={analysis!} />
          </div>
        )}
      </div>

      {analysis && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-right">نتائج التحليل</h2>
          <AnalysisResult analysis={analysis} isLoading={isAnalyzing} />
        </div>
      )}
    </div>
  );
};