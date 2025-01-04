import { useState } from "react";
import { AnalysisData } from "@/types/analysis";
import { getTradingViewChartImage } from "@/utils/tradingViewUtils";
import { detectAnalysisType } from "./utils/analysisTypeDetector";
import { executeAnalysis } from "./utils/analysisExecutor";
import { combinedAnalysis } from "@/utils/technicalAnalysis/combinedAnalysis";
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
    isPatternAnalysis: boolean = false,
    isPriceAction: boolean = false
  ) => {
    try {
      if (!symbol || !timeframe) {
        throw new Error("جميع الحقول مطلوبة");
      }

      if (!providedPrice) {
        throw new Error("يجب إدخال السعر الحالي للتحليل");
      }

      setIsAnalyzing(true);
      const upperSymbol = symbol.toUpperCase();
      setCurrentSymbol(upperSymbol);
      
      const selectedTypes = [];
      if (isScalping) selectedTypes.push("scalping");
      if (isSMC) selectedTypes.push("smc");
      if (isICT) selectedTypes.push("ict");
      if (isTurtleSoup) selectedTypes.push("turtleSoup");
      if (isGann) selectedTypes.push("gann");
      if (isWaves) selectedTypes.push("waves");
      if (isPatternAnalysis) selectedTypes.push("patterns");
      if (isPriceAction) selectedTypes.push("priceAction");
      
      const analysisType = isAI ? "ذكي" : detectAnalysisType(
        isPatternAnalysis,
        isWaves,
        isGann,
        isTurtleSoup,
        isICT,
        isSMC,
        isAI,
        isScalping,
        isPriceAction
      );
      
      setCurrentAnalysis(analysisType);
      
      console.log("بدء تحليل TradingView:", { 
        symbol: upperSymbol, 
        timeframe, 
        providedPrice,
        نوع_التحليل: analysisType,
        selectedTypes
      });

      const chartImage = await getTradingViewChartImage(upperSymbol, timeframe, providedPrice);
      console.log("تم استلام صورة الشارت");
      setImage(chartImage);

      let analysisResult;
      if (isAI && selectedTypes.length > 0) {
        analysisResult = await combinedAnalysis(
          chartImage,
          providedPrice,
          timeframe,
          selectedTypes
        );
      } else {
        analysisResult = await executeAnalysis(
          chartImage,
          providedPrice,
          timeframe,
          {
            isPatternAnalysis,
            isWaves,
            isGann,
            isTurtleSoup,
            isICT,
            isSMC,
            isScalping,
            isPriceAction
          }
        );
      }

      if (!analysisResult) {
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