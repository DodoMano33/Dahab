
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
    isPriceAction: boolean = false,
    isNeuralNetwork: boolean = false
  ) => {
    let messageToastId: string | undefined;
    let loadingToastId: string | undefined;
    
    try {
      console.log("Starting analysis with parameters:", {
        symbol,
        timeframe,
        providedPrice,
        isScalping,
        isAI,
        isSMC,
        isICT,
        isTurtleSoup,
        isGann,
        isWaves,
        isPatternAnalysis,
        isPriceAction,
        isNeuralNetwork
      });

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
      if (isNeuralNetwork) selectedTypes.push("neuralNetworks");
      
      const analysisType = isAI ? "ذكي" : detectAnalysisType(
        isPatternAnalysis,
        isWaves,
        isGann,
        isTurtleSoup,
        isICT,
        isSMC,
        isAI,
        isScalping,
        isPriceAction,
        isNeuralNetwork
      );
      
      setCurrentAnalysis(analysisType);
      
      // Use a unique ID for the loading toast
      loadingToastId = "analysis-loading-" + Date.now();
      
      toast.loading(`جاري تحليل ${analysisType} للرمز ${upperSymbol} على الإطار الزمني ${timeframe}...`, {
        id: loadingToastId,
        duration: Infinity,
      });
      
      // Show the specialized analysis message toast - using async/await properly
      try {
        const messagesModule = await import("./utils/analysisMessages");
        messageToastId = messagesModule.showAnalysisMessage(
          isPatternAnalysis,
          isWaves,
          isGann,
          isTurtleSoup,
          isICT,
          isSMC,
          isAI,
          isNeuralNetwork
        );
      } catch (messageError) {
        console.error("Error showing analysis message:", messageError);
      }
      
      console.log("Getting TradingView chart image for:", { 
        symbol: upperSymbol, 
        timeframe, 
        providedPrice,
        analysisType,
        selectedTypes
      });

      try {
        const chartImage = await getTradingViewChartImage(upperSymbol, timeframe, providedPrice);
        console.log("Chart image received successfully");
        setImage(chartImage);

        let analysisResult;
        if (isAI && selectedTypes.length > 0) {
          console.log("Starting AI combined analysis");
          analysisResult = await combinedAnalysis(
            chartImage,
            providedPrice,
            timeframe,
            selectedTypes
          );
        } else {
          console.log("Starting regular analysis");
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
              isPriceAction,
              isNeuralNetwork
            }
          );
        }

        if (!analysisResult) {
          // Make sure to dismiss all toasts on error
          if (loadingToastId) toast.dismiss(loadingToastId);
          if (messageToastId) toast.dismiss(messageToastId);
          throw new Error("لم يتم العثور على نتائج التحليل");
        }

        console.log("Analysis completed successfully:", analysisResult);
        setAnalysis(analysisResult);
        setIsAnalyzing(false);
        
        // Always dismiss all toasts when analysis is completed
        if (loadingToastId) toast.dismiss(loadingToastId);
        if (messageToastId) toast.dismiss(messageToastId);
        
        toast.success(`تم إكمال تحليل ${analysisType} بنجاح على الإطار الزمني ${timeframe}`, {
          description: `${upperSymbol} | السعر: ${providedPrice}`,
          duration: 5000,
        });
        
        return { analysisResult, currentPrice: providedPrice, symbol: upperSymbol };
        
      } catch (chartError) {
        console.error("Error getting chart image or performing analysis:", chartError);
        // Make sure to dismiss all toasts on error
        if (loadingToastId) toast.dismiss(loadingToastId);
        if (messageToastId) toast.dismiss(messageToastId);
        throw new Error("فشل في الحصول على صورة الشارت أو إجراء التحليل");
      }
      
    } catch (error) {
      console.error("Error in TradingView analysis:", error);
      setIsAnalyzing(false);
      
      // Make sure to dismiss any loading toasts
      if (loadingToastId) toast.dismiss(loadingToastId);
      if (messageToastId) toast.dismiss(messageToastId);
      
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
