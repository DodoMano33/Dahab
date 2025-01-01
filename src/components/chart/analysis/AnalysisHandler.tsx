import { useState } from "react";
import { AnalysisData } from "@/types/analysis";
import { getTradingViewChartImage } from "@/utils/tradingViewUtils";
import { analyzeScalpingChart } from "./scalpingAnalysis";
import { analyzeSMCChart } from "./smcAnalysis";
import { analyzeICTChart } from "./ictAnalysis";
import { analyzeTurtleSoupChart } from "./turtleSoupAnalysis";
import { analyzeGannChart } from "./gannAnalysis";
import { analyzeWavesChart } from "./wavesAnalysis";
import { analyzePattern } from "@/utils/patternAnalysis";
import { toast } from "sonner";

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
    isTurtleSoup: boolean = false,
    isGann: boolean = false,
    isWaves: boolean = false,
    isPatternAnalysis: boolean = false
  ) => {
    try {
      setIsAnalyzing(true);
      const upperSymbol = symbol.toUpperCase();
      setCurrentSymbol(upperSymbol);
      
      console.log("بدء تحليل TradingView:", { 
        symbol: upperSymbol, 
        timeframe, 
        providedPrice,
        نوع_التحليل: isPatternAnalysis ? "Patterns" : isWaves ? "Waves" : isGann ? "Gann" : isTurtleSoup ? "Turtle Soup" : isICT ? "ICT" : isSMC ? "SMC" : isAI ? "ذكي" : isScalping ? "سكالبينج" : "عادي" 
      });
      
      const chartImage = await getTradingViewChartImage(upperSymbol, timeframe);
      console.log("تم استلام صورة الشارت");
      setImage(chartImage);
      
      let currentPrice = providedPrice;
      if (!currentPrice) {
        currentPrice = 0; // يمكن تحديث هذا لاحقاً للحصول على السعر الحالي من API
        console.log("تم جلب السعر الحالي من TradingView:", currentPrice);
      }

      let analysisResult;
      if (isPatternAnalysis) {
        console.log("بدء تحليل النمط مع البيانات:", { chartImage, currentPrice });
        analysisResult = await analyzePattern(chartImage, currentPrice);
      } else if (isWaves) {
        analysisResult = await analyzeWavesChart(chartImage, currentPrice, upperSymbol);
      } else if (isGann) {
        analysisResult = await analyzeGannChart(chartImage, currentPrice, upperSymbol);
      } else if (isTurtleSoup) {
        analysisResult = await analyzeTurtleSoupChart(chartImage, currentPrice, upperSymbol);
      } else if (isICT) {
        analysisResult = await analyzeICTChart(chartImage, currentPrice, upperSymbol);
      } else if (isSMC) {
        analysisResult = await analyzeSMCChart(chartImage, currentPrice, upperSymbol);
      } else if (isScalping) {
        analysisResult = await analyzeScalpingChart(chartImage, currentPrice, upperSymbol);
      }

      if (analysisResult) {
        console.log("تم إكمال التحليل:", analysisResult);
        setAnalysis(analysisResult);
        return { analysisResult, currentPrice, symbol: upperSymbol };
      }

      setIsAnalyzing(false);
      throw new Error("فشل في تحليل النمط");
      
    } catch (error) {
      console.error("خطأ في تحليل TradingView:", error);
      toast.error("حدث خطأ أثناء التحليل");
      setIsAnalyzing(false);
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