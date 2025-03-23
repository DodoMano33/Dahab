
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { processChartAnalysis, saveAnalysisToDatabase } from "@/components/chart/analysis/utils/chartAnalysisProcessor";
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentPrice } from "@/hooks/useCurrentPrice";
import { useNavigate } from "react-router-dom";

// Define the ChartAnalysisResult interface
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPrice } = useCurrentPrice();

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
      if (!user) {
        toast.error("يجب تسجيل الدخول لاستخدام هذه الميزة");
        navigate("/login");
        return;
      }

      if (!symbol) {
        toast.error("الرجاء تحديد رمز المؤشر.");
        return;
      }

      if (!timeframe) {
        toast.error("الرجاء تحديد الإطار الزمني.");
        return;
      }

      if (!analysisType && (!selectedTypes || selectedTypes.length === 0)) {
        toast.error("الرجاء تحديد نوع التحليل.");
        return;
      }

      if (!chartImage) {
        toast.error("الرجاء تحميل صورة الشارت.");
        return;
      }

      setIsAnalyzing(true);

      try {
        const inputPrice = providedPrice !== undefined ? providedPrice : currentPrice;

        if (inputPrice === null || inputPrice === undefined) {
          throw new Error("السعر الحالي غير متوفر. يرجى المحاولة مرة أخرى لاحقًا.");
        }

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
          chartImage
        };

        const result = await processChartAnalysis(input);
        handleAnalysisResult(result);
      } catch (error: any) {
        console.error("حدث خطأ أثناء معالجة التحليل:", error);
        toast.error(error.message || "حدث خطأ أثناء معالجة التحليل.");
      } finally {
        setIsAnalyzing(false);
      }
    },
    [navigate, symbol, user, currentPrice]
  );

  // نستخدم الخصائص التي أضفناها للنوع ChartAnalysisResult
  const handleAnalysisResult = (result: ChartAnalysisResult) => {
    if (!result || !result.analysisResult) {
      setIsAnalyzing(false);
      return;
    }

    // يمكننا الآن استخدام symbol و currentPrice بأمان
    const symbolName = result.symbol || "";
    const price = result.currentPrice || 0;
    const analysis = result.analysisResult;

    // تحويل البيانات من string إلى number عند الحاجة
    const durationHours: number = 
      typeof result.duration === 'string' 
        ? parseInt(result.duration) 
        : (result.duration as number || 8);

    saveAnalysisToDatabase(
      symbolName,
      analysis.analysisType,
      price,
      analysis.analysisType,
      analysis,
      durationHours
    );

    // تحويل البيانات من string إلى number عند الحاجة
    const analysisDuration: number = 
      typeof result.duration === 'string' 
        ? parseInt(result.duration) 
        : (result.duration as number || 8);

    toast.success(`تم التحليل بنجاح. المدة: ${analysisDuration} ساعة.`);
  };

  return { onSubmit, isAnalyzing };
};
