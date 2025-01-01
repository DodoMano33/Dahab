import { useState } from "react";
import { ChartInput } from "../ChartInput";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { SearchHistoryItem } from "@/types/analysis";
import { supabase } from "@/lib/supabase";
import { useAnalysisHandler } from "./AnalysisHandler";

interface AnalysisFormProps {
  onAnalysis: (item: SearchHistoryItem) => void;
  isAnalyzing: boolean;
  onHistoryClick: () => void;
}

export const AnalysisForm = ({ onAnalysis, isAnalyzing, onHistoryClick }: AnalysisFormProps) => {
  const { user } = useAuth();
  const { handleTradingViewConfig } = useAnalysisHandler();

  const handleAnalysis = async (
    symbol: string, 
    timeframe: string, 
    providedPrice?: number, 
    isScalping?: boolean,
    isAI?: boolean,
    isSMC?: boolean,
    isICT?: boolean,
    isTurtleSoup?: boolean,
    isGann?: boolean,
    isWaves?: boolean
  ) => {
    try {
      if (!user) {
        toast.error("يرجى تسجيل الدخول لحفظ نتائج التحليل");
        return;
      }

      if (isWaves) {
        toast.info("جاري تحليل البيانات باستخدام نموذج Waves...");
      } else if (isGann) {
        toast.info("جاري تحليل البيانات باستخدام نظرية غان...");
      } else if (isAI) {
        toast.info("جاري تحليل البيانات باستخدام الذكاء الاصطناعي...");
      } else if (isSMC) {
        toast.info("جاري تحليل البيانات باستخدام نموذج SMC...");
      } else if (isICT) {
        toast.info("جاري تحليل البيانات باستخدام نموذج ICT...");
      } else if (isTurtleSoup) {
        toast.info("جاري تحليل البيانات باستخدام نموذج Turtle Soup...");
      }

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
        isWaves
      );
      
      if (result && result.analysisResult) {
        const { analysisResult, currentPrice, symbol: upperSymbol } = result;
        
        const analysisType = isWaves ? "Waves" :
                           isGann ? "Gann" :
                           isTurtleSoup ? "Turtle Soup" : 
                           isICT ? "ICT" : 
                           isSMC ? "SMC" : 
                           isAI ? "ذكي" : 
                           isScalping ? "سكالبينج" : 
                           "عادي";

        console.log("Inserting analysis data:", {
          user_id: user.id,
          symbol: upperSymbol,
          current_price: currentPrice,
          analysis: analysisResult,
          analysis_type: analysisType
        });
        
        // حفظ في Supabase
        const { data, error: saveError } = await supabase
          .from('search_history')
          .insert({
            user_id: user.id,
            symbol: upperSymbol,
            current_price: currentPrice,
            analysis: analysisResult,
            analysis_type: analysisType
          })
          .select()
          .single();

        if (saveError) {
          console.error("Error saving to Supabase:", saveError);
          throw saveError;
        }

        if (!data) {
          throw new Error("No data returned from insert operation");
        }

        // تحديث الحالة المحلية
        const newHistoryEntry: SearchHistoryItem = {
          id: data.id,
          date: new Date(),
          symbol: upperSymbol,
          currentPrice,
          analysis: analysisResult,
          targetHit: false,
          stopLossHit: false,
          analysisType
        };

        onAnalysis(newHistoryEntry);
        console.log("تم تحديث سجل البحث:", newHistoryEntry);
      } else {
        throw new Error("لم يتم استلام نتائج التحليل");
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