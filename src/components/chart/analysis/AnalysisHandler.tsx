import { useState } from "react";
import { toast } from "sonner";
import { AnalysisData } from "@/types/analysis";
import { getTradingViewChartImage, getCurrentPriceFromTradingView } from "@/utils/tradingViewUtils";
import { analyzeDailyChart } from "./dailyAnalysis";
import { analyzeScalpingChart } from "./scalpingAnalysis";
import { analyzeSMCChart } from "./smcAnalysis";
import { analyzeICTChart } from "./ictAnalysis";
import { analyzeTurtleSoupChart } from "./turtleSoupAnalysis";

export const useAnalysisHandler = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [currentSymbol, setCurrentSymbol] = useState<string>('');

  const handleTradingViewConfig = async (
    symbol: string, 
    timeframe: string, 
    providedPrice?: number,
    isScalping: boolean = false,
    isAI: boolean = false,
    isSMC: boolean = false,
    isICT: boolean = false,
    isTurtleSoup: boolean = false
  ) => {
    try {
      setIsAnalyzing(true);
      const upperSymbol = symbol.toUpperCase();
      setCurrentSymbol(upperSymbol);
      
      console.log("بدء تحليل TradingView:", { 
        symbol: upperSymbol, 
        timeframe, 
        providedPrice,
        نوع_التحليل: isTurtleSoup ? "Turtle Soup" : isICT ? "ICT" : isSMC ? "SMC" : isAI ? "ذكي" : isScalping ? "سكالبينج" : "عادي" 
      });
      
      const chartImage = await getTradingViewChartImage(upperSymbol, timeframe);
      console.log("تم استلام صورة الشارت");
      
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

      let analysisResult;
      if (isTurtleSoup) {
        analysisResult = await analyzeTurtleSoupChart(chartImage, currentPrice, upperSymbol);
      } else if (isICT) {
        analysisResult = await analyzeICTChart(chartImage, currentPrice, upperSymbol);
      } else if (isSMC) {
        analysisResult = await analyzeSMCChart(chartImage, currentPrice, upperSymbol);
      } else if (isScalping) {
        analysisResult = await analyzeScalpingChart(chartImage, currentPrice, upperSymbol);
      } else {
        analysisResult = await analyzeDailyChart(chartImage, currentPrice, upperSymbol);
      }

      setAnalysis(analysisResult);
      setIsAnalyzing(false);
      
      return { analysisResult, currentPrice, symbol: upperSymbol };
      
    } catch (error) {
      console.error("خطأ في تحليل TradingView:", error);
      toast.error("حدث خطأ أثناء جلب الرسم البياني");
      setIsAnalyzing(false);
      return null;
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