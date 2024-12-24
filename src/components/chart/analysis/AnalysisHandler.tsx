import { useState } from "react";
import { toast } from "sonner";
import { AnalysisData } from "@/types/analysis";
import { getTradingViewChartImage } from "@/utils/tradingViewUtils";
import { getForexFactoryPrice } from "@/utils/priceFeeds/forexFactory";
import { analyzeScalpingSetup } from "@/utils/analysis/scalping";
import { 
  calculateFibonacciLevels, 
  calculateTargets, 
  calculateStopLoss, 
  calculateSupportResistance, 
  detectTrend,
  calculateBestEntryPoint
} from "@/utils/technicalAnalysis";

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
        currentPrice = await getForexFactoryPrice(upperSymbol);
        console.log("تم جلب السعر من ForexFactory:", currentPrice);
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

  const analyzeChartWithPrice = async (
    imageData: string, 
    currentPrice: number, 
    symbol: string,
    isScalping: boolean = false
  ) => {
    setIsAnalyzing(true);
    console.log("بدء تحليل الشارت مع السعر المحدد:", { currentPrice, isScalping });
    
    try {
      // Generate mock price data for analysis
      const prices = Array.from({ length: 10 }, (_, i) => 
        currentPrice + (i - 5) * (currentPrice * 0.001)
      );

      if (isScalping) {
        const scalpingAnalysis = analyzeScalpingSetup(currentPrice, prices);
        const direction = prices[prices.length - 1] > prices[0] ? "صاعد" : "هابط";
        
        const analysisResult: AnalysisData = {
          pattern: scalpingAnalysis.pattern,
          direction,
          currentPrice,
          support: scalpingAnalysis.support,
          resistance: scalpingAnalysis.resistance,
          stopLoss: scalpingAnalysis.stopLoss,
          targets: scalpingAnalysis.targets,
          bestEntryPoint: scalpingAnalysis.bestEntryPoint
        };

        setAnalysis(analysisResult);
        setIsAnalyzing(false);
        return analysisResult;
      } else {
        // Regular analysis logic
        const direction = detectTrend(prices);
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
        setIsAnalyzing(false);
        return analysisResult;
      }
    } catch (error) {
      console.error("خطأ في تحليل الشارت:", error);
      setIsAnalyzing(false);
      toast.error("حدث خطأ أثناء تحليل الشارت");
      throw error;
    }
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
