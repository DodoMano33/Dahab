import { useState } from "react";
import { ChartInput } from "../ChartInput";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { SearchHistoryItem } from "@/types/analysis";
import { useAnalysisHandler } from "./AnalysisHandler";
import { showAnalysisMessage } from "./utils/analysisMessages";
import { detectAnalysisType } from "./utils/analysisTypeDetector";
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

      // التحقق من اختيار نوع تحليل
      const analysisType = detectAnalysisType(
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

      if (!analysisType) {
        toast.error("يرجى اختيار نوع تحليل واحد على الأقل");
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

        const savedData = await saveAnalysis({
          userId: user.id,
          symbol: upperSymbol,
          currentPrice,
          analysisResult,
          analysisType,
          timeframe
        });

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