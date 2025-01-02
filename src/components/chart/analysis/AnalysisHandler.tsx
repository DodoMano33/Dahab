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
  const [currentAnalysis, setCurrentAnalysis] = useState<string>('');

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
      
      const analysisType = isPatternAnalysis ? 'Patterns' : 
                          isWaves ? 'Waves' : 
                          isGann ? 'Gann' : 
                          isTurtleSoup ? 'Turtle Soup' : 
                          isICT ? 'ICT' : 
                          isSMC ? 'SMC' : 
                          isAI ? 'ذكي' : 
                          isScalping ? 'سكالبينج' : 'عادي';
      
      setCurrentAnalysis(analysisType);
      
      console.log("بدء تحليل TradingView:", { 
        symbol: upperSymbol, 
        timeframe, 
        providedPrice,
        نوع_التحليل: analysisType
      });

      const chartImage = await getTradingViewChartImage(upperSymbol, timeframe);
      console.log("تم استلام صورة الشارت");
      setImage(chartImage);

      if (!providedPrice) {
        throw new Error("الرجاء إدخال السعر الحالي");
      }

      let analysisResult: AnalysisData | null = null;
      
      if (isPatternAnalysis) {
        console.log("بدء تحليل النمط مع البيانات:", { chartImage, providedPrice, timeframe });
        analysisResult = await analyzePattern(chartImage, providedPrice, timeframe);
      } else if (isWaves) {
        analysisResult = await analyzeWavesChart(chartImage, providedPrice, timeframe);
      } else if (isGann) {
        analysisResult = await analyzeGannChart(chartImage, providedPrice, timeframe);
      } else if (isTurtleSoup) {
        analysisResult = await analyzeTurtleSoupChart(chartImage, providedPrice, timeframe);
      } else if (isICT) {
        analysisResult = await analyzeICTChart(chartImage, providedPrice, timeframe);
      } else if (isSMC) {
        analysisResult = await analyzeSMCChart(chartImage, providedPrice, timeframe);
      } else if (isScalping) {
        analysisResult = await analyzeScalpingChart(chartImage, providedPrice, timeframe);
      }

      if (!analysisResult) {
        console.error("لم يتم العثور على نتائج التحليل");
        throw new Error("لم يتم العثور على نتائج التحليل");
      }

      console.log("تم إكمال التحليل:", analysisResult);
      setAnalysis(analysisResult);
      setIsAnalyzing(false);
      
      toast.success(`تم إكمال تحليل ${analysisType} بنجاح على الإطار الزمني ${timeframe}`);
      return { analysisResult, currentPrice: providedPrice, symbol: upperSymbol };
      
    } catch (error) {
      console.error("خطأ في تحليل TradingView:", error);
      setIsAnalyzing(false);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("حدث خطأ أثناء التحليل");
      }
      throw error;
    }
  };

  return {
    isAnalyzing,
    image,
    analysis,
    currentSymbol,
    currentAnalysis,
    handleTradingViewConfig,
    setImage,
    setAnalysis,
    setIsAnalyzing
  };
};