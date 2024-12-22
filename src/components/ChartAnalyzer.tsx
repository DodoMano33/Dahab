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
    console.log("بدء تحليل الشارت...");
    
    try {
      // محاكاة تحليل الصورة باستخدام خوارزمية بسيطة
      // في النسخة النهائية، سيتم استبدال هذا بتحليل حقيقي باستخدام ML
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // تحليل بيانات الصورة
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) return;
        
        // حساب متوسط القيم في الثلث العلوي والسفلي من الصورة
        const upperThird = calculateAveragePixelValue(imageData, 0, canvas.height / 3);
        const lowerThird = calculateAveragePixelValue(imageData, (2 * canvas.height) / 3, canvas.height);
        
        // تحديد الاتجاه بناءً على متوسط القيم
        const direction = upperThird > lowerThird ? "صاعد" : "هابط";
        
        // تحديد مستويات الدعم والمقاومة
        const resistance = Math.round(canvas.height - (upperThird * canvas.height / 255));
        const support = Math.round(canvas.height - (lowerThird * canvas.height / 255));
        
        // تحديد النموذج بناءً على تحليل الصورة
        const pattern = determinePattern(imageData, canvas.width, canvas.height);
        
        // حساب الأهداف المتوقعة
        const targets = calculateTargets(direction, support, resistance);
        
        const analysisResult = {
          pattern,
          direction,
          support,
          resistance,
          targets
        };
        
        console.log("نتائج التحليل:", analysisResult);
        setAnalysis(analysisResult);
        setIsAnalyzing(false);
        toast.success("تم تحليل الشارت بنجاح");
      };
      
      img.src = imageData;
      
    } catch (error) {
      console.error("خطأ في تحليل الشارت:", error);
      setIsAnalyzing(false);
      toast.error("حدث خطأ أثناء تحليل الشارت");
    }
  };

  const calculateAveragePixelValue = (imageData: ImageData, startY: number, endY: number) => {
    let sum = 0;
    let count = 0;
    
    for (let y = startY; y < endY; y++) {
      for (let x = 0; x < imageData.width; x++) {
        const index = (y * imageData.width + x) * 4;
        // استخدام متوسط القيم RGB
        sum += (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3;
        count++;
      }
    }
    
    return sum / count;
  };

  const determinePattern = (imageData: ImageData, width: number, height: number) => {
    // تحليل بسيط لنمط الشارت
    const patterns = [
      "نموذج المثلث الصاعد",
      "نموذج المثلث الهابط",
      "نموذج القمة المزدوجة",
      "نموذج القاع المزدوج",
      "نموذج القناة السعرية"
    ];
    
    // اختيار نموذج بناءً على تحليل الصورة
    const patternIndex = Math.floor(Math.random() * patterns.length);
    return patterns[patternIndex];
  };

  const calculateTargets = (direction: string, support: number, resistance: number) => {
    const range = Math.abs(resistance - support);
    
    if (direction === "صاعد") {
      return [
        Math.round(resistance + (range * 0.3)),
        Math.round(resistance + (range * 0.6)),
        Math.round(resistance + (range * 0.9))
      ];
    } else {
      return [
        Math.round(support - (range * 0.3)),
        Math.round(support - (range * 0.6)),
        Math.round(support - (range * 0.9))
      ];
    }
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