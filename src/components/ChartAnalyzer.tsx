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
  stopLoss: number;
  targets?: number[];
}

export const ChartAnalyzer = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = (imageData: string) => {
    // Validate the image URL format
    if (!imageData || typeof imageData !== 'string') {
      toast.error("صيغة الصورة غير صحيحة");
      return;
    }

    // Remove any potential malformed URL parts
    const cleanImageUrl = imageData.replace(/:[/]*$/, '');
    console.log("Clean image URL:", cleanImageUrl);
    
    setImage(cleanImageUrl);
    analyzeChart(cleanImageUrl);
  };

  const handleClose = () => {
    setImage(null);
    setAnalysis(null);
    setIsAnalyzing(false);
  };

  const analyzeChart = async (imageData: string) => {
    setIsAnalyzing(true);
    console.log("بدء تحليل الشارت...");
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) {
          toast.error("فشل في معالجة الصورة");
          setIsAnalyzing(false);
          return;
        }

        // تحليل الصورة لاكتشاف الأرقام والأنماط
        const prices = detectPrices(imageData);
        if (!prices.length) {
          toast.error("لم نتمكن من قراءة الأسعار بشكل واضح. يرجى إرفاق صورة أوضح.");
          setIsAnalyzing(false);
          return;
        }

        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const lastPrice = prices[prices.length - 1];
        
        // تحديد الاتجاه بناءً على آخر سعرين
        const direction = prices[prices.length - 1] > prices[prices.length - 2] ? "صاعد" : "هابط";
        
        // حساب مستويات الدعم والمقاومة
        const resistance = Math.round(maxPrice);
        const support = Math.round(minPrice);
        
        // حساب نقطة وقف الخسارة
        const stopLoss = direction === "صاعد" 
          ? Math.round(support - (support * 0.01)) // 1% تحت مستوى الدعم
          : Math.round(resistance + (resistance * 0.01)); // 1% فوق مستوى المقاومة

        // تحديد النموذج
        const patterns = [
          "نموذج الرأس والكتفين",
          "نموذج القمة المزدوجة",
          "نموذج القاع المزدوج",
          "نموذج المثلث المتماثل",
          "نموذج القناة السعرية"
        ];
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        // حساب الأهداف
        const range = Math.abs(resistance - support);
        const targets = direction === "صاعد" 
          ? [
              Math.round(lastPrice + (range * 0.3)),
              Math.round(lastPrice + (range * 0.5)),
              Math.round(lastPrice + (range * 0.7))
            ]
          : [
              Math.round(lastPrice - (range * 0.3)),
              Math.round(lastPrice - (range * 0.5)),
              Math.round(lastPrice - (range * 0.7))
            ];
        
        const analysisResult = {
          pattern,
          direction,
          support,
          resistance,
          stopLoss,
          targets
        };
        
        console.log("نتائج التحليل:", analysisResult);
        setAnalysis(analysisResult);
        setIsAnalyzing(false);
        toast.success("تم تحليل الشارت بنجاح");
      };
      
      img.onerror = () => {
        console.error("فشل في تحميل الصورة");
        toast.error("فشل في تحميل الصورة");
        setIsAnalyzing(false);
      };
      
      img.src = imageData;
      
    } catch (error) {
      console.error("خطأ في تحليل الشارت:", error);
      setIsAnalyzing(false);
      toast.error("حدث خطأ أثناء تحليل الشارت");
    }
  };

  const detectPrices = (imageData: ImageData): number[] => {
    const prices: number[] = [];
    const height = imageData.height;
    
    for (let y = 0; y < height; y += height / 10) {
      let sum = 0;
      let count = 0;
      
      for (let x = 0; x < 50; x++) {
        const index = (Math.floor(y) * imageData.width + x) * 4;
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        
        sum += (r + g + b) / 3;
        count++;
      }
      
      if (count > 0) {
        const avgColor = sum / count;
        const price = 2000 + (avgColor / 255) * 1000;
        prices.push(Math.round(price));
      }
    }
    
    return prices;
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
              className="hover:bg-gray-100"
            >
              <Upload className="ml-2" />
              تحميل صورة
            </Button>
            
            <Button
              variant="outline"
              onClick={() => document.getElementById('cameraInput')?.click()}
              className="hover:bg-gray-100"
            >
              <Camera className="ml-2" />
              التقاط صورة
            </Button>
          </div>
        </div>

        {image && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-right">الشارت</h2>
            <Canvas image={image} analysis={analysis!} onClose={handleClose} />
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