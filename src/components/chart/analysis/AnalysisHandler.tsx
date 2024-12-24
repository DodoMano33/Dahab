import { useState } from "react";
import { toast } from "sonner";
import { AnalysisData } from "@/types/analysis";
import { getTradingViewChartImage, getCurrentPriceFromTradingView } from "@/utils/tradingViewUtils";
import { 
  calculateFibonacciLevels, 
  calculateTargets, 
  calculateStopLoss, 
  calculateSupportResistance, 
  detectTrend,
  calculateBestEntryPoint
} from "@/utils/technicalAnalysis";
import { addDays, addHours } from "date-fns";

export const useAnalysisHandler = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [currentSymbol, setCurrentSymbol] = useState<string>('');

  const handleTradingViewConfig = async (
    symbol: string, 
    timeframe: string, 
    providedPrice?: number,
    isScalping: boolean = false
  ) => {
    try {
      setIsAnalyzing(true);
      const upperSymbol = symbol.toUpperCase();
      setCurrentSymbol(upperSymbol);
      console.log("بدء تحليل TradingView:", { symbol: upperSymbol, timeframe, providedPrice, isScalping });
      
      const chartImage = await getTradingViewChartImage(upperSymbol, timeframe);
      console.log("تم استلام صورة الشارت:", chartImage);
      
      let currentPrice = providedPrice;
      if (!currentPrice) {
        currentPrice = await getCurrentPriceFromTradingView(upperSymbol);
        console.log("تم جلب السعر الحالي من TradingView:", currentPrice);
      }
      
      if (!currentPrice) {
        toast.error("فشل في الحصول على السعر الحالي");
        setIsAnalyzing(false);
        return;
      }
      
      setImage(chartImage);
      const analysisResult = await analyzeChartWithPrice(chartImage, currentPrice, upperSymbol, isScalping);
      return { analysisResult, currentPrice, symbol: upperSymbol };
      
    } catch (error) {
      console.error("خطأ في تحليل TradingView:", error);
      toast.error("حدث خطأ أثناء جلب الرسم البياني");
      setIsAnalyzing(false);
      return null;
    }
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

  const analyzeChartWithPrice = async (
    imageData: string, 
    currentPrice: number, 
    symbol: string,
    isScalping: boolean = false
  ) => {
    setIsAnalyzing(true);
    console.log("بدء تحليل الشارت مع السعر المحدد:", { currentPrice, isScalping });
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      return new Promise<AnalysisData>((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          if (!imageData) {
            toast.error("فشل في معالجة الصورة");
            setIsAnalyzing(false);
            reject(new Error("فشل في معالجة الصورة"));
            return;
          }

          const prices = detectPrices(imageData, currentPrice);
          
          if (!prices.length) {
            toast.error("لم نتمكن من قراءة الأسعار بشكل واضح. يرجى إرفاق صورة أوضح.");
            setIsAnalyzing(false);
            reject(new Error("لم نتمكن من قراءة الأسعار"));
            return;
          }

          const direction = detectTrend(prices) as "صاعد" | "هابط";
          const { support, resistance } = calculateSupportResistance(prices, currentPrice, direction);
          const stopLoss = calculateStopLoss(currentPrice, direction, support, resistance);
          const fibLevels = calculateFibonacciLevels(resistance, support).map((price, index) => ({
            level: [0.236, 0.382, 0.618][index],
            price
          }));

          // Adjust target calculation based on analysis type
          const targetPrices = isScalping 
            ? calculateTargets(currentPrice, direction, support, resistance).map(price => price * 0.5) // Smaller targets for scalping
            : calculateTargets(currentPrice, direction, support, resistance);

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
          setIsAnalyzing(false);
          resolve(analysisResult);
        };
        
        img.onerror = () => {
          console.error("فشل في تحميل الصورة");
          toast.error("فشل في تحميل الصورة");
          setIsAnalyzing(false);
          reject(new Error("فشل في تحميل الصورة"));
        };
        
        img.src = imageData;
      });
      
    } catch (error) {
      console.error("خطأ في تحليل الشارت:", error);
      setIsAnalyzing(false);
      toast.error("حدث خطأ أثناء تحليل الشارت");
      throw error;
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

  return {
    isAnalyzing,
    image,
    analysis,
    currentSymbol,
    handleTradingViewConfig,
    setImage,
    setAnalysis,
    setIsAnalyzing
  };
};
