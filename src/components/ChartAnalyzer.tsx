import { useState } from "react";
import { ChartModeSelector } from "./chart/ChartModeSelector";
import { ChartInput } from "./chart/ChartInput";
import { ChartDisplay } from "./chart/ChartDisplay";
import { toast } from "sonner";
import { getTradingViewChartImage } from "@/utils/tradingViewUtils";
import { 
  calculateFibonacciLevels, 
  calculateTargets, 
  calculateStopLoss, 
  calculateSupportResistance, 
  detectTrend,
  getCurrentPriceFromTradingView,
} from "@/utils/technicalAnalysis";
import { analyzeAdvancedEntryPoint } from "@/utils/advancedAnalysis";
import { AnalysisData, SearchHistoryItem } from "@/types/analysis";
import { saveAnalysisToHistory, loadAnalysisHistory } from "@/utils/storageUtils";
import { processImageData, getImageDataFromCanvas } from "@/utils/imageProcessing";

type AnalysisMode = 'upload' | 'tradingview';

export const ChartAnalyzer = () => {
  const [mode, setMode] = useState<AnalysisMode>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(loadAnalysisHistory());

  const handleSaveToHistory = (analysisData: AnalysisData, imageData: string) => {
    const historyItem: SearchHistoryItem = {
      id: Date.now().toString(),
      date: new Date(),
      symbol: currentSymbol,
      analysis: analysisData,
      image: imageData
    };
    
    const newHistory = saveAnalysisToHistory(historyItem);
    setSearchHistory(newHistory);
  };

  const analyzeChart = (imageData: string) => {
    setIsAnalyzing(true);
    getCurrentPriceFromTradingView(currentSymbol)
      .then(currentPrice => {
        if (currentPrice) {
          analyzeChartWithPrice(imageData, currentPrice);
        } else {
          toast.error("فشل في الحصول على السعر الحالي");
          setIsAnalyzing(false);
        }
      })
      .catch(error => {
        console.error("خطأ في جلب السعر الحالي:", error);
        toast.error("فشل في الحصول على السعر الحالي");
        setIsAnalyzing(false);
      });
  };

  const handleImageUpload = (imageData: string) => {
    if (!imageData || typeof imageData !== 'string') {
      toast.error("صيغة الصورة غير صحيحة");
      return;
    }

    console.log("Processing uploaded image");
    
    const img = new Image();
    img.onload = () => {
      console.log("Image loaded successfully");
      setImage(imageData);
      analyzeChart(imageData);
    };
    
    img.onerror = () => {
      console.error("Failed to load image");
      toast.error("فشل في تحميل الصورة");
      setIsAnalyzing(false);
    };
    
    img.src = imageData;
  };

  const handleTradingViewConfig = async (symbol: string, timeframe: string, providedPrice?: number) => {
    try {
      setIsAnalyzing(true);
      setCurrentSymbol(symbol);
      console.log("Starting TradingView analysis:", { symbol, timeframe, providedPrice });
      
      const chartImage = await getTradingViewChartImage(symbol, timeframe);
      if (!chartImage) {
        toast.error("فشل في جلب صورة الشارت");
        setIsAnalyzing(false);
        return;
      }
      
      let currentPrice = providedPrice;
      if (!currentPrice) {
        currentPrice = await getCurrentPriceFromTradingView(symbol);
      }
      
      if (!currentPrice) {
        toast.error("فشل في الحصول على السعر الحالي");
        setIsAnalyzing(false);
        return;
      }
      
      setImage(chartImage);
      analyzeChartWithPrice(chartImage, currentPrice);
      
    } catch (error) {
      console.error("Error in TradingView analysis:", error);
      toast.error("حدث خطأ أثناء جلب الرسم البياني");
      setIsAnalyzing(false);
    }
  };

  const analyzeChartWithPrice = async (imageData: string, currentPrice: number) => {
    setIsAnalyzing(true);
    console.log("Starting chart analysis with price:", currentPrice);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (!ctx) {
          toast.error("فشل في معالجة الصورة");
          setIsAnalyzing(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageDataRaw = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const prices = processImageData(imageDataRaw, currentPrice);
        
        if (!prices.length) {
          toast.error("لم نتمكن من قراءة الأسعار بشكل واضح. يرجى إرفاق صورة أوضح.");
          setIsAnalyzing(false);
          return;
        }

        const direction = detectTrend(prices) as "صاعد" | "هابط";
        const { support, resistance } = calculateSupportResistance(prices, currentPrice, direction);
        const stopLoss = calculateStopLoss(currentPrice, direction, support, resistance);
        const fibLevels = calculateFibonacciLevels(resistance, support).map((price, index) => ({
          level: [0.236, 0.382, 0.618][index],
          price
        }));
        
        const targetPrices = calculateTargets(currentPrice, direction, support, resistance);
        const targets = targetPrices.map((price, index) => ({
          price,
          expectedTime: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000)
        }));

        const advancedAnalysis = analyzeAdvancedEntryPoint(
          { prices },
          currentPrice,
          direction,
          support,
          resistance
        );

        const pattern = direction === "صاعد" ? 
          "نموذج صعودي مستمر" : 
          "نموذج هبوطي مستمر";

        const bestEntryPoint = {
          price: advancedAnalysis.entryPoint,
          reason: advancedAnalysis.reasons.join(' | ')
        };
        
        const analysisResult: AnalysisData = {
          pattern,
          direction,
          currentPrice,
          support,
          resistance,
          stopLoss,
          targets,
          fibonacciLevels: fibLevels,
          bestEntryPoint
        };
        
        console.log("Analysis results:", analysisResult);
        setAnalysis(analysisResult);
        
        // Save compressed image data
        const compressedImageData = getImageDataFromCanvas(canvas);
        handleSaveToHistory(analysisResult, compressedImageData);
        
        setIsAnalyzing(false);
        toast.success("تم تحليل الشارت بنجاح");
      };
      
      img.onerror = () => {
        console.error("Failed to load image for analysis");
        toast.error("فشل في تحميل الصورة");
        setIsAnalyzing(false);
      };
      
      img.src = imageData;
      
    } catch (error) {
      console.error("Error analyzing chart:", error);
      setIsAnalyzing(false);
      toast.error("حدث خطأ أثناء تحليل الشارت");
    }
  };

  return (
    <div className="space-y-8">
      <ChartModeSelector mode={mode} onModeChange={setMode} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChartInput
          mode={mode}
          onImageCapture={handleImageUpload}
          onTradingViewConfig={handleTradingViewConfig}
          onHistoryClick={() => toast.info("تم تحميل سجل البحث")}
          isAnalyzing={isAnalyzing}
        />
        <ChartDisplay
          image={image}
          analysis={analysis}
          isAnalyzing={isAnalyzing}
          onClose={() => {
            setImage(null);
            setAnalysis(null);
            setIsAnalyzing(false);
          }}
          symbol={currentSymbol}
        />
      </div>
    </div>
  );
};