import { useState } from "react";
import { ChartInput } from "../ChartInput";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { SearchHistoryItem } from "@/types/analysis";
import { useAnalysisHandler } from "./AnalysisHandler";
import { showAnalysisMessage } from "./utils/analysisMessages";
import { getAnalysisType } from "./utils/analysisTypes";
import { saveAnalysis } from "./utils/saveAnalysis";

interface AnalysisFormProps {
  onAnalysis: (item: SearchHistoryItem) => void;
  isAnalyzing: boolean;
  currentAnalysis?: string;
  onHistoryClick?: () => void;
}

export const AnalysisForm = ({ 
  onAnalysis, 
  isAnalyzing, 
  currentAnalysis,
  onHistoryClick 
}: AnalysisFormProps) => {
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
        
        // Validate analysis result before saving
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
            timeframe
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

  return (
    <ChartInput
      mode="tradingview"
      onTradingViewConfig={handleAnalysis}
      onHistoryClick={onHistoryClick}
      isAnalyzing={isAnalyzing}
    />
  );
};