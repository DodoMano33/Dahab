
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

// تعريف واجهة ChartAnalysisResult للتأكد من وجود الحقول المطلوبة
interface ChartAnalysisResult {
  analysisResult: any;
  duration?: number;
  currentPrice?: number;
  symbol?: string;
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
    const loadingToastId = showLoadingToast(
      `جاري التحليل للرمز ${symbol} على الإطار الزمني ${timeframe}...`
    );
    
    try {
      if (!user) {
        showErrorToast(new Error("يرجى تسجيل الدخول لحفظ نتائج التحليل"));
        dismissToasts(loadingToastId);
        return;
      }

      if (!validateAnalysisInputs(symbol, timeframe, providedPrice)) {
        dismissToasts(loadingToastId);
        return;
      }

      const durationHours = duration ? parseInt(duration) : 36;
      console.log("Using duration hours:", durationHours);
      
      if (isNaN(durationHours) || durationHours < 1 || durationHours > 72) {
        showErrorToast(new Error("مدة التحليل يجب أن تكون بين 1 و 72 ساعة"));
        dismissToasts(loadingToastId);
        return;
      }

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

      console.log("Starting analysis with duration:", duration);
      
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
      
      dismissToasts(loadingToastId);
      
      if (result && result.analysisResult) {
        // استخدام البيانات من النتيجة أو من المدخلات الأصلية
        const symbolToUse = result.symbol || symbol.toUpperCase();
        const priceToUse = result.currentPrice || providedPrice || 0;
        const { analysisResult } = result;
        
        if (!analysisResult || !analysisResult.pattern || !analysisResult.direction) {
          console.error("Invalid analysis result:", analysisResult);
          showErrorToast(new Error("نتائج التحليل غير صالحة"));
          return;
        }

        try {
          // تحويل المدة إلى رقم للتأكد من نوع البيانات
          const finalDuration = typeof result.duration === 'number' 
            ? result.duration 
            : (durationHours || 36);
                             
          console.log("Saving analysis with duration:", finalDuration);
          
          const mappedAnalysisType = mapToAnalysisType(analysisType);
          console.log("Mapped analysis type:", mappedAnalysisType);
          
          const savedData = await saveAnalysis({
            userId: user.id,
            symbol: symbolToUse,
            currentPrice: priceToUse,
            analysisResult,
            analysisType: mappedAnalysisType as AnalysisType,
            timeframe,
            durationHours: finalDuration
          });

          if (savedData) {
            const newHistoryEntry: SearchHistoryItem = {
              id: savedData.id,
              date: new Date(),
              symbol: symbolToUse,
              currentPrice: priceToUse,
              analysis: analysisResult,
              targetHit: false,
              stopLossHit: false,
              analysisType: mappedAnalysisType as AnalysisType,
              timeframe,
              analysis_duration_hours: finalDuration
            };

            onAnalysis(newHistoryEntry);
            console.log("تم تحديث سجل البحث مع مدة تحليل:", finalDuration, newHistoryEntry);
          }
        } catch (saveError) {
          console.error("Error saving analysis:", saveError);
          showErrorToast(new Error("حدث خطأ أثناء حفظ التحليل"));
        }
      }
    } catch (error) {
      console.error("خطأ في التحليل:", error);
      showErrorToast(error);
      
      dismissToasts(loadingToastId);
    }
  };

  return { handleAnalysis };
};
