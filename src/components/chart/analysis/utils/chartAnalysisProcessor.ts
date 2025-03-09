
import { AnalysisData } from "@/types/analysis";
import { getTradingViewChartImage } from "@/utils/tradingViewUtils";
import { executeAnalysis } from "./analysisExecutor";
import { combinedAnalysis } from "@/utils/technicalAnalysis/combinedAnalysis";
import { dismissToasts, showLoadingToast, showSuccessToast } from "./toastUtils";

interface ChartAnalysisParams {
  symbol: string;
  timeframe: string;
  providedPrice: number;
  analysisType: string;
  selectedTypes: string[];
  isAI: boolean;
  options: {
    isPatternAnalysis: boolean;
    isWaves: boolean;
    isGann: boolean;
    isTurtleSoup: boolean;
    isICT: boolean;
    isSMC: boolean;
    isScalping: boolean;
    isPriceAction: boolean;
    isNeuralNetwork: boolean;
  };
  duration?: string;
  isAutomatic?: boolean;
}

export const processChartAnalysis = async ({
  symbol,
  timeframe,
  providedPrice,
  analysisType,
  selectedTypes,
  isAI,
  options,
  duration,
  isAutomatic = false
}: ChartAnalysisParams): Promise<{
  analysisResult: AnalysisData;
  currentPrice: number;
  symbol: string;
}> => {
  // Create toast IDs for tracking
  const loadingToastId = showLoadingToast(
    `جاري تحليل ${analysisType} للرمز ${symbol} على الإطار الزمني ${timeframe}...`
  );
  let messageToastId: string | undefined;

  try {
    // Import and show the specialized analysis message
    try {
      const messagesModule = await import("../utils/analysisMessages");
      messageToastId = messagesModule.showAnalysisMessage(
        options.isPatternAnalysis,
        options.isWaves,
        options.isGann,
        options.isTurtleSoup,
        options.isICT,
        options.isSMC,
        isAI,
        options.isNeuralNetwork
      );
    } catch (messageError) {
      console.error("Error showing analysis message:", messageError);
    }

    // Get the chart image
    console.log("Getting TradingView chart image for:", { 
      symbol, 
      timeframe, 
      providedPrice,
      analysisType,
      selectedTypes,
      duration,
      isAutomatic
    });

    const chartImage = await getTradingViewChartImage(symbol, timeframe, providedPrice);
    console.log("Chart image received successfully");

    // Perform the analysis
    let analysisResult: AnalysisData;
    
    if (isAI && selectedTypes && selectedTypes.length > 0) {
      console.log("Starting AI combined analysis with selected types:", selectedTypes);
      analysisResult = await combinedAnalysis(
        chartImage,
        providedPrice,
        timeframe,
        selectedTypes
      );
      console.log("Combined analysis completed:", analysisResult);
    } else {
      console.log("Starting regular analysis with options:", options);
      analysisResult = await executeAnalysis(
        chartImage,
        providedPrice,
        timeframe,
        options
      );
      console.log("Regular analysis completed:", analysisResult);
    }

    if (!analysisResult) {
      dismissToasts(loadingToastId, messageToastId);
      throw new Error("لم يتم العثور على نتائج التحليل");
    }

    // تعيين نوع التنشيط بناءً بشكل صريح على كيفية إجراء التحليل
    analysisResult.activation_type = isAutomatic ? "تلقائي" : "يدوي";
    console.log(`Setting activation_type explicitly to ${analysisResult.activation_type} based on isAutomatic=${isAutomatic}`);

    // Double-check the analysis type to ensure it's compatible with the database
    if (analysisResult.analysisType) {
      // Use the mapper to ensure valid database format
      const { mapToAnalysisType } = await import("./analysisTypeMapper");
      analysisResult.analysisType = mapToAnalysisType(analysisResult.analysisType);
      console.log("Double-checked and normalized analysis type:", analysisResult.analysisType);
    }

    console.log("Analysis completed successfully:", analysisResult);
    
    // Dismiss all toasts when analysis is completed
    dismissToasts(loadingToastId, messageToastId);
    
    // Show success toast
    showSuccessToast(analysisType, timeframe, symbol, providedPrice);
    
    return { 
      analysisResult, 
      currentPrice: providedPrice, 
      symbol 
    };
    
  } catch (error) {
    console.error("Error in chart analysis:", error);
    // Dismiss any loading toasts on error
    dismissToasts(loadingToastId, messageToastId);
    throw error;
  }
};
