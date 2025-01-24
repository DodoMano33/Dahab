import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { SearchHistoryItem } from "@/types/analysis";
import { showAnalysisMessage } from "../utils/analysisMessages";
import { getAnalysisType } from "../utils/analysisTypes";
import { saveAnalysis } from "../utils/saveAnalysis";
import { useAnalysisHandler } from "../AnalysisHandler";

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
    customHours: number = 8,
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
      if (!user) {
        toast.error("يرجى تسجيل الدخول لحفظ نتائج التحليل");
        return;
      }

      if (!symbol || !timeframe || !providedPrice) {
        toast.error("جميع الحقول مطلوبة");
        return;
      }

      if (customHours < 1 || customHours > 72) {
        toast.error("مدة التحليل يجب أن تكون بين 1 و 72 ساعة");
        return;
      }

      showAnalysisMessage(
        isPatternAnalysis,
        isWaves,
        isGann,
        isTurtleSoup,
        isICT,
        isSMC,
        isAI
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
        isPriceAction
      );
      
      if (result && result.analysisResult) {
        const { analysisResult, currentPrice, symbol: upperSymbol } = result;
        
        if (!analysisResult || !analysisResult.pattern || !analysisResult.direction) {
          console.error("Invalid analysis result:", analysisResult);
          toast.error("نتائج التحليل غير صالحة");
          return;
        }

        const analysisType = isAI ? "ذكي" : getAnalysisType(
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

        try {
          const savedData = await saveAnalysis({
            userId: user.id,
            symbol: upperSymbol,
            currentPrice,
            analysisResult,
            analysisType,
            timeframe,
            customHours
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
              timeframe
            };

            onAnalysis(newHistoryEntry);
            console.log("تم تحديث سجل البحث:", newHistoryEntry);
          }
        } catch (saveError) {
          console.error("Error saving analysis:", saveError);
          toast.error("حدث خطأ أثناء حفظ التحليل");
        }
      }
    } catch (error) {
      console.error("خطأ في التحليل:", error);
      toast.error("حدث خطأ أثناء التحليل");
    }
  };

  return { handleAnalysis };
};