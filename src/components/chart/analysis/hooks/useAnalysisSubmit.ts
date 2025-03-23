
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { processChartAnalysis, saveAnalysisToDatabase } from "@/components/chart/analysis/utils/chartAnalysisProcessor";
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentPrice } from "@/hooks/useCurrentPrice";
import { useNavigate } from "react-router-dom";
import { getTradingViewChartImage } from "@/utils/tradingViewUtils";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";

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

      setIsAnalyzing(true);

      try {
        const inputPrice = providedPrice !== undefined ? providedPrice : currentPrice;

        if (inputPrice === null || inputPrice === undefined) {
          throw new Error("السعر الحالي غير متوفر. يرجى المحاولة مرة أخرى لاحقًا.");
        }
        
        // إذا لم يتم توفير صورة، حاول التقاطها تلقائيًا
        let finalChartImage = chartImage;
        if (!finalChartImage) {
          try {
            console.log("Attempting to auto-capture chart image");
            finalChartImage = await getTradingViewChartImage(symbol, timeframe, inputPrice);
            console.log("Auto-captured chart image successfully");
          } catch (error) {
            console.error("Failed to auto-capture chart:", error);
            // استمر بدون صورة، سيتم إنشاء صورة افتراضية في processChartAnalysis
          }
        }

        // مسح التخزين المؤقت قبل إرسال التحليل
        await clearSupabaseCache();
        await clearSearchHistoryCache();

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
        const result = await processChartAnalysis(input);
        console.log("Analysis result:", result);
        
        // لضمان أن نتيجة التحليل مررت إلى وظيفة النجاح بشكل صحيح
        if (result && result.analysisResult) {
          await handleAnalysisResult({
            analysisResult: result.analysisResult,
            duration: result.duration,
            symbol,
            currentPrice: inputPrice
          });
        } else {
          throw new Error("لم يتم الحصول على نتائج التحليل");
        }
      } catch (error: any) {
        console.error("حدث خطأ أثناء معالجة التحليل:", error);
        toast.error(error.message || "حدث خطأ أثناء معالجة التحليل.");
      } finally {
        setIsAnalyzing(false);
      }
    },
    [navigate, symbol, user, currentPrice]
  );

  const handleAnalysisResult = async (result: ChartAnalysisResult) => {
    try {
      if (!result || !result.analysisResult) {
        setIsAnalyzing(false);
        toast.error("لم يتم الحصول على نتائج التحليل");
        return;
      }

      console.log("Handling analysis result:", result);

      // استخدام القيم من النتيجة أو القيم الافتراضية
      const symbolName = result.symbol || symbol;
      const price = result.currentPrice || currentPrice || 0;
      const analysis = result.analysisResult;

      // تحويل البيانات من string إلى number عند الحاجة
      const durationHours: number = 
        typeof result.duration === 'string' 
          ? parseInt(result.duration) 
          : (result.duration as number || 8);

      console.log("Saving analysis with duration:", durationHours);

      // الاتصال المباشر بقاعدة البيانات لحفظ التحليل
      await clearSupabaseCache();
      await clearSearchHistoryCache();

      // حفظ التحليل في قاعدة البيانات
      await saveAnalysisToDatabase(
        symbolName,
        analysis.analysisType,
        price,
        analysis,
        durationHours
      );

      // عرض رسالة النجاح
      toast.success(`تم التحليل بنجاح. المدة: ${durationHours} ساعة.`);
    } catch (error: any) {
      console.error("Error handling analysis result:", error);
      toast.error(error.message || "حدث خطأ أثناء حفظ نتائج التحليل");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { onSubmit, isAnalyzing };
};
