
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SearchHistoryItem } from "@/types/analysis";
import { buildAnalysisConfig } from "../utils/analysisConfigBuilder";
import { validateAnalysisInputs } from "../utils/inputValidation";
import { dismissToasts, showErrorToast, showLoadingToast } from "../utils/toastUtils";
import { useAnalysisHandler } from "../AnalysisHandler";
import { saveAnalysis } from "../utils/saveAnalysis";

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
    duration?: string
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
        isNeuralNetwork
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
        isNeuralNetwork
      );
      
      // Dismiss the loading toast
      dismissToasts(loadingToastId);
      
      if (result && result.analysisResult) {
        const { analysisResult, currentPrice, symbol: upperSymbol } = result;
        
        if (!analysisResult || !analysisResult.pattern || !analysisResult.direction) {
          console.error("Invalid analysis result:", analysisResult);
          showErrorToast(new Error("نتائج التحليل غير صالحة"));
          return;
        }

        try {
          console.log("Saving analysis with duration:", durationHours);
          const savedData = await saveAnalysis({
            userId: user.id,
            symbol: upperSymbol,
            currentPrice,
            analysisResult,
            analysisType,
            timeframe,
            durationHours
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
              analysisType,
              timeframe,
              analysis_duration_hours: durationHours
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
