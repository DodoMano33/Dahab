
import { useCallback } from "react";
import { toast } from "sonner";
import { processChartAnalysis } from "@/components/chart/analysis/utils/chartAnalysisProcessor";
import { AnalysisType } from "@/types/analysis";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentPrice } from "@/hooks/useCurrentPrice";
import { useNavigate } from "react-router-dom";
import { getTradingViewChartImage } from "@/utils/tradingViewUtils";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";
import { useAnalysisState, useValidation, useAnalysisResult } from "./analysisState";

// Interface for chart analysis result
export interface ChartAnalysisResult {
  analysisResult: AnalysisData | null;
  duration?: string | number;
  symbol?: string;
  currentPrice?: number;
}

interface UseAnalysisSubmitProps {
  symbol: string;
}

export const useAnalysisSubmit = ({ symbol }: UseAnalysisSubmitProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPrice } = useCurrentPrice();
  const { isAnalyzing, startAnalyzing, stopAnalyzing } = useAnalysisState();
  const { validateAnalysisInput } = useValidation();
  const { handleAnalysisResult } = useAnalysisResult();

  const onSubmit = useCallback(
    async (
      timeframe: string,
      analysisType: AnalysisType,
      selectedTypes: string[],
      providedPrice?: number,
      isAI?: boolean,
      isSMC?: boolean,
      isICT?: boolean,
      isTurtleSoup?: boolean,
      isGann?: boolean,
      isWaves?: boolean,
      isPatternAnalysis?: boolean,
      isPriceAction?: boolean,
      isNeuralNetwork?: boolean,
      isRNN?: boolean,
      isTimeClustering?: boolean,
      isMultiVariance?: boolean,
      isCompositeCandlestick?: boolean,
      isBehavioral?: boolean,
      isFibonacci?: boolean,
      isFibonacciAdvanced?: boolean,
      duration?: string,
      chartImage?: string
    ) => {
      // Validate input data
      const isValid = validateAnalysisInput({
        user,
        symbol,
        timeframe,
        analysisType,
        selectedTypes,
        navigate
      });

      if (!isValid) return;

      startAnalyzing();

      try {
        const inputPrice = providedPrice !== undefined ? providedPrice : currentPrice;

        if (inputPrice === null || inputPrice === undefined) {
          throw new Error("السعر الحالي غير متوفر. يرجى المحاولة مرة أخرى لاحقًا.");
        }
        
        // محاولة التقاط صورة الشارت إذا لم يتم توفيرها
        let finalChartImage = chartImage;
        if (!finalChartImage) {
          try {
            console.log("Attempting to auto-capture chart image");
            finalChartImage = await getTradingViewChartImage(symbol, timeframe, inputPrice);
            console.log("Auto-captured chart image successfully");
          } catch (error) {
            console.error("Failed to auto-capture chart:", error);
          }
        }

        // مسح التخزين المؤقت قبل إرسال التحليل
        await clearSupabaseCache();
        await clearSearchHistoryCache();

        // تجميع بيانات الإدخال للتحليل
        const input = {
          symbol,
          timeframe,
          providedPrice: inputPrice,
          analysisType,
          selectedTypes,
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
          chartImage: finalChartImage
        };

        console.log("Submitting analysis with input:", input);
        
        // معالجة تحليل الشارت
        const result = await processChartAnalysis(input);
        console.log("Analysis result:", result);
        
        // معالجة نتيجة التحليل
        if (result && result.analysisResult) {
          await handleAnalysisResult({
            analysisResult: result.analysisResult,
            duration: result.duration,
            symbol,
            currentPrice: inputPrice
          }, symbol, inputPrice);
        } else {
          throw new Error("لم يتم الحصول على نتائج التحليل");
        }
      } catch (error: any) {
        console.error("حدث خطأ أثناء معالجة التحليل:", error);
        toast.error(error.message || "حدث خطأ أثناء معالجة التحليل.");
      } finally {
        stopAnalyzing();
      }
    },
    [
      user, 
      symbol, 
      currentPrice, 
      navigate, 
      validateAnalysisInput, 
      startAnalyzing, 
      stopAnalyzing, 
      handleAnalysisResult
    ]
  );

  return { onSubmit, isAnalyzing };
};

import { AnalysisData } from "@/types/analysis";
