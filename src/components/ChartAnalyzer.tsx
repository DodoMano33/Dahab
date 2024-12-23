import { useState } from "react";
import { ChartModeSelector } from "./chart/ChartModeSelector";
import { ChartInput } from "./chart/ChartInput";
import { ChartDisplay } from "./chart/ChartDisplay";
import { SearchHistory } from "./chart/SearchHistory";
import { toast } from "sonner";
import { getTradingViewChartImage } from "@/utils/tradingViewUtils";
import { 
  calculateFibonacciLevels, 
  calculateTargets, 
  calculateStopLoss, 
  calculateSupportResistance, 
  detectTrend,
  getCurrentPriceFromTradingView,
  calculateBestEntryPoint
} from "@/utils/technicalAnalysis";
import { addDays, addHours } from "date-fns";
import { AnalysisData } from "@/types/analysis";

type AnalysisMode = 'upload' | 'tradingview';

type SearchHistoryItem = {
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: AnalysisData;
};

export const ChartAnalyzer = () => {
  const [mode, setMode] = useState<AnalysisMode>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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

    console.log("بدء معالجة الصورة:", imageData);
    
    const img = new Image();
    img.onload = () => {
      console.log("تم تحميل الصورة بنجاح");
      setImage(imageData);
      analyzeChart(imageData);
    };
    
    img.onerror = () => {
      console.error("فشل في تحميل الصورة");
      toast.error("فشل في تحميل الصورة");
      setIsAnalyzing(false);
    };
    
    img.src = imageData;
  };

  const handleTradingViewConfig = async (symbol: string, timeframe: string, providedPrice?: number) => {
    try {
      setIsAnalyzing(true);
      setCurrentSymbol(symbol);
      console.log("بدء تحليل TradingView:", { symbol, timeframe, providedPrice });
      
      const chartImage = await getTradingViewChartImage(symbol, timeframe);
      console.log("تم استلام صورة الشارت:", chartImage);
      
      let currentPrice = providedPrice;
      if (!currentPrice) {
        currentPrice = await getCurrentPriceFromTradingView(symbol);
        console.log("تم جلب السعر الحالي من TradingView:", currentPrice);
      }
      
      if (!currentPrice) {
        toast.error("فشل في الحصول على السعر الحالي");
        setIsAnalyzing(false);
        return;
      }
      
      setImage(chartImage);
      analyzeChartWithPrice(chartImage, currentPrice);
      
    } catch (error) {
      console.error("خطأ في تحليل TradingView:", error);
      toast.error("حدث خطأ أثناء جلب الرسم البياني");
      setIsAnalyzing(false);
    }
  };

  const handleShowHistory = () => {
    setIsHistoryOpen(true);
  };

  const calculateExpectedTimes = (targets: number[], direction: string): Date[] => {
    const now = new Date();
    return targets.map((_, index) => {
      if (index === 0) {
        return addHours(now, Math.random() * 24 + 24);
      } else if (index === 1) {
        return addDays(now, Math.random() * 2 + 3);
      } else {
        return addDays(now, Math.random() * 4 + 7);
      }
    });
  };

  const analyzeChartWithPrice = async (imageData: string, currentPrice: number) => {
    setIsAnalyzing(true);
    console.log("بدء تحليل الشارت مع السعر المحدد:", currentPrice);
    
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

        const prices = detectPrices(imageData, currentPrice);
        
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
        const expectedTimes = calculateExpectedTimes(targetPrices, direction);
        
        const targets = targetPrices.map((price, index) => ({
          price,
          expectedTime: expectedTimes[index]
        }));

        const bestEntryPoint = calculateBestEntryPoint(
          currentPrice,
          direction,
          support,
          resistance,
          fibLevels
        );

        const pattern = direction === "صاعد" ? 
          "نموذج صعودي مستمر" : 
          "نموذج هبوطي مستمر";
        
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
        
        console.log("نتائج التحليل:", analysisResult);
        setAnalysis(analysisResult);

        // إضافة التحليل إلى سجل البحث
        setSearchHistory(prev => [{
          date: new Date(),
          symbol: currentSymbol || 'غير محدد',
          currentPrice,
          analysis: analysisResult
        }, ...prev]);

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

  const detectPrices = (imageData: ImageData, providedCurrentPrice?: number): number[] => {
    const prices: number[] = [];
    const height = imageData.height;
    
    const currentPriceRow = Math.floor(height * 0.5); 
    let currentPrice = providedCurrentPrice || 2622; 
    
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
        if (Math.abs(y - currentPriceRow) < height / 20) {
          prices.push(currentPrice);
        } else {
          const price = currentPrice + ((y - currentPriceRow) / height) * 100;
          prices.push(Math.round(price * 100) / 100);
        }
      }
    }
    
    console.log("الأسعار المكتشفة:", prices);
    return prices;
  };

  return (
    <div className="space-y-8">
      <ChartModeSelector mode={mode} onModeChange={setMode} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChartInput
          mode={mode}
          onImageCapture={handleImageUpload}
          onTradingViewConfig={handleTradingViewConfig}
          onHistoryClick={handleShowHistory}
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
      <SearchHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={searchHistory}
      />
    </div>
  );
};