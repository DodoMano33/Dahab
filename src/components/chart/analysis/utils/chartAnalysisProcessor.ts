
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
}

export const processChartAnalysis = async ({
  symbol,
  timeframe,
  providedPrice,
  analysisType,
  selectedTypes,
  isAI,
  options,
  duration
}: ChartAnalysisParams): Promise<{
  analysisResult: AnalysisData;
  currentPrice: number;
  symbol: string;
  duration?: number;
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

    // التحقق من وجود سعر محدث من TradingView عن طريق مناداة حدث
    let finalPrice = providedPrice;
    
    // إرسال حدث للحصول على السعر الحالي من TradingView
    window.dispatchEvent(new CustomEvent('request-current-price'));
    
    // طباعة السعر النهائي المستخدم للتحليل
    console.log("Analysis using price:", finalPrice);

    // تحويل مدة التحليل إلى رقم إذا كانت موجودة
    const durationHours = duration ? parseInt(duration) : 8;
    console.log(`Analysis duration set to: ${durationHours} hours`);

    // Get the chart image
    console.log("Getting TradingView chart image for:", { 
      symbol, 
      timeframe, 
      price: finalPrice,
      analysisType,
      selectedTypes,
      duration: durationHours
    });

    const chartImage = await getTradingViewChartImage(symbol, timeframe, finalPrice);
    console.log("Chart image received successfully");

    // Perform the analysis
    let analysisResult: AnalysisData;
    
    if (isAI && selectedTypes && selectedTypes.length > 0) {
      console.log("Starting AI combined analysis with selected types:", selectedTypes);
      analysisResult = await combinedAnalysis(
        chartImage,
        finalPrice,
        timeframe,
        selectedTypes
      );
      console.log("Combined analysis completed:", analysisResult);
    } else {
      console.log("Starting regular analysis with options:", options);
      analysisResult = await executeAnalysis(
        chartImage,
        finalPrice,
        timeframe,
        options
      );
      console.log("Regular analysis completed:", analysisResult);
    }

    if (!analysisResult) {
      dismissToasts(loadingToastId, messageToastId);
      throw new Error("لم يتم العثور على نتائج التحليل");
    }

    console.log("Analysis completed successfully:", analysisResult);
    
    // Dismiss all toasts when analysis is completed
    dismissToasts(loadingToastId, messageToastId);
    
    // Show success toast
    showSuccessToast(analysisType, timeframe, symbol, finalPrice);
    
    return { 
      analysisResult, 
      currentPrice: finalPrice, 
      symbol,
      duration: durationHours  // تأكيد تمرير قيمة مدة التحليل
    };
    
  } catch (error) {
    console.error("Error in chart analysis:", error);
    // Dismiss any loading toasts on error
    dismissToasts(loadingToastId, messageToastId);
    throw error;
  }
};
