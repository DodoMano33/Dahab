
import { useState } from "react";
import { AutoAnalysisButton } from "./AutoAnalysisButton";
import { useAutoAnalysis } from "./hooks/useAutoAnalysis";
import { toast } from "sonner";
import { SearchHistoryItem } from "@/types/analysis";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";

interface AutoAnalysisProps {
  selectedTimeframes: string[];
  selectedInterval: string;
  selectedAnalysisTypes: string[];
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
  repetitions: number;
  setIsHistoryOpen: (open: boolean) => void;
  duration?: string;
}

export const AutoAnalysis = ({
  selectedTimeframes,
  selectedInterval,
  selectedAnalysisTypes,
  onAnalysisComplete,
  repetitions,
  setIsHistoryOpen,
  duration = "8"
}: AutoAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { startAutoAnalysis, stopAutoAnalysis } = useAutoAnalysis();

  const handleAnalysisClick = async () => {
    if (isAnalyzing) {
      stopAutoAnalysis();
      setIsAnalyzing(false);
      toast.info("تم إيقاف التحليل التلقائي");
      return;
    }

    // محاولة مسح التخزين المؤقت لمخطط قاعدة البيانات
    try {
      await clearSupabaseCache();
      await clearSearchHistoryCache();
      console.log("تم مسح ذاكرة التخزين المؤقت قبل بدء التحليل التلقائي");
    } catch (error) {
      console.error("خطأ أثناء مسح ذاكرة التخزين المؤقت:", error);
      // نستمر رغم الخطأ
    }

    const symbolInput = document.querySelector('input#symbol') as HTMLInputElement;
    const symbol = symbolInput?.value;

    const priceInput = document.querySelector('input#price') as HTMLInputElement;
    const currentPrice = priceInput ? Number(priceInput.value) : undefined;

    console.log("Auto analysis inputs:", { symbol, currentPrice, duration });

    if (!symbol) {
      toast.error("الرجاء إدخال رمز العملة أو الزوج");
      return;
    }

    if (!currentPrice || isNaN(currentPrice) || currentPrice <= 0) {
      toast.error("الرجاء إدخال السعر الحالي بشكل صحيح");
      return;
    }

    const durationHours = Number(duration);
    if (isNaN(durationHours) || durationHours < 1 || durationHours > 72) {
      toast.error("مدة التحليل يجب أن تكون بين 1 و 72 ساعة");
      return;
    }

    if (selectedTimeframes.length === 0) {
      toast.error("الرجاء اختيار إطار زمني واحد على الأقل");
      return;
    }

    if (selectedAnalysisTypes.length === 0) {
      toast.error("الرجاء اختيار نوع تحليل واحد على الأقل");
      return;
    }

    console.log("Starting auto analysis with symbol:", symbol, "and duration:", durationHours);
    console.log("Selected timeframes:", selectedTimeframes);
    console.log("Selected analysis types:", selectedAnalysisTypes);

    setIsAnalyzing(true);
    toast.success("جاري بدء التحليل التلقائي...");
    
    try {
      await startAutoAnalysis({
        timeframes: selectedTimeframes,
        interval: selectedInterval,
        analysisTypes: selectedAnalysisTypes,
        repetitions,
        currentPrice,
        symbol,
        duration: durationHours,
        onAnalysisComplete: (result) => {
          console.log("Auto analysis result:", result);
          if (result && onAnalysisComplete) {
            onAnalysisComplete(result);
          }
        }
      });
    } catch (error) {
      console.error("Error in auto analysis:", error);
      toast.error("حدث خطأ أثناء التحليل التلقائي: " + (error instanceof Error ? error.message : "خطأ غير معروف"));
      setIsAnalyzing(false);
    }
  };

  return (
    <AutoAnalysisButton
      isAnalyzing={isAnalyzing}
      onClick={handleAnalysisClick}
      onBackTestClick={() => {}}
      setIsHistoryOpen={setIsHistoryOpen}
    />
  );
};
