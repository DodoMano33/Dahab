
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AnalysisType, SearchHistoryItem } from "@/types/analysis";
import { buildAnalysisConfig } from "../utils/analysisConfigBuilder";
import { validateAnalysisInputs } from "../utils/inputValidation";
import { dismissToasts, showErrorToast, showLoadingToast } from "../utils/toastUtils";
import { useAnalysisHandler } from "../AnalysisHandler";
import { saveAnalysis } from "../utils/saveAnalysis";
import { mapToAnalysisType } from "../utils/analysisTypeMapper";

interface UseAnalysisSubmitProps {
  onAnalysis: (item: SearchHistoryItem) => void;
}

export const useAnalysisSubmit = ({ onAnalysis }: UseAnalysisSubmitProps) => {
  const { user } = useAuth();
  const { handleTradingViewConfig } = useAnalysisHandler();

  const handleAnalysis = async (
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
    isNeuralNetwork: boolean = false,
    isRNN: boolean = false,
    isTimeClustering: boolean = false,
    isMultiVariance: boolean = false,
    isCompositeCandlestick: boolean = false,
    isBehavioral: boolean = false,
    isFibonacci: boolean = false,
    isFibonacciAdvanced: boolean = false,
    duration?: string,
    selectedTypes?: string[]
  ) => {
    // Create toast IDs for tracking
    const loadingToastId = showLoadingToast(
      `جاري التحليل للرمز ${symbol} على الإطار الزمني ${timeframe}...`
    );
    
    try {
      if (!user) {
        showErrorToast(new Error("يرجى تسجيل الدخول لحفظ نتائج التحليل"));
        dismissToasts(loadingToastId);
        return;
      }

      // Use the validation utility
      if (!validateAnalysisInputs(symbol, timeframe, providedPrice)) {
        dismissToasts(loadingToastId);
        return;
      }

      // التحقق من صحة مدة التحليل
      const durationHours = duration ? parseInt(duration) : 8;
      if (isNaN(durationHours) || durationHours < 1 || durationHours > 72) {
        showErrorToast(new Error("مدة التحليل يجب أن تكون بين 1 و 72 ساعة"));
        dismissToasts(loadingToastId);
        return;
      }

      // Get the analysis type using the utility function
      const { analysisType } = buildAnalysisConfig(
        isScalping,
        isAI,
        isSMC,
        isICT,
        isTurtleSoup,
        isGann,
        isWaves,
        isPatternAnalysis,
        isPriceAction,
        isNeuralNetwork,
        isRNN,
        isTimeClustering,
        isMultiVariance,
        isCompositeCandlestick,
        isBehavioral,
        isFibonacci,
        isFibonacciAdvanced
      );

      const result = await handleTradingViewConfig(
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
        isNeuralNetwork,
        isRNN,
        isTimeClustering,
        isMultiVariance,
        isCompositeCandlestick,
        isBehavioral,
        isFibonacci,
        isFibonacciAdvanced,
        duration,
        selectedTypes
      );
      
      // Dismiss the loading toast
      dismissToasts(loadingToastId);
      
      if (result && result.analysisResult) {
        const { analysisResult, currentPrice, symbol: upperSymbol, duration: resultDuration } = result;
        
        if (!analysisResult || !analysisResult.pattern || !analysisResult.direction) {
          console.error("Invalid analysis result:", analysisResult);
          showErrorToast(new Error("نتائج التحليل غير صالحة"));
          return;
        }

        try {
          console.log("Saving analysis with duration:", resultDuration || durationHours);
          
          // Map the analysis type to a valid database enum value
          const mappedAnalysisType = mapToAnalysisType(analysisType);
          console.log("Mapped analysis type:", mappedAnalysisType);
          
          const savedData = await saveAnalysis({
            userId: user.id,
            symbol: upperSymbol,
            currentPrice,
            analysisResult,
            analysisType: mappedAnalysisType as AnalysisType, // Cast to AnalysisType
            timeframe,
            durationHours: resultDuration || durationHours // استخدام المدة من النتيجة أو من المدخلات
          });

          if (savedData) {
            const newHistoryEntry: SearchHistoryItem = {
              id: savedData.id,
              date: new Date(),
              symbol: upperSymbol,
              currentPrice,
              analysis: analysisResult,
              targetHit: false,
              stopLossHit: false,
              analysisType: mappedAnalysisType as AnalysisType, // Cast to AnalysisType
              timeframe,
              analysis_duration_hours: resultDuration || durationHours // استخدام المدة من النتيجة أو من المدخلات
            };

            onAnalysis(newHistoryEntry);
            console.log("تم تحديث سجل البحث:", newHistoryEntry);
          }
        } catch (saveError) {
          console.error("Error saving analysis:", saveError);
          showErrorToast(new Error("حدث خطأ أثناء حفظ التحليل"));
        }
      }
    } catch (error) {
      console.error("خطأ في التحليل:", error);
      showErrorToast(error);
      
      // Dismiss any loading toasts
      dismissToasts(loadingToastId);
    }
  };

  return { handleAnalysis };
};
