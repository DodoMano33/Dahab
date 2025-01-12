import { useState } from "react";
import { AutoAnalysisButton } from "./AutoAnalysisButton";
import { useAutoAnalysis } from "./hooks/useAutoAnalysis";
import { toast } from "sonner";
import { SearchHistoryItem } from "@/types/analysis";
import { TradingViewSelector } from "@/components/TradingViewSelector";

interface AutoAnalysisProps {
  selectedTimeframes: string[];
  selectedInterval: string;
  selectedAnalysisTypes: string[];
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
  repetitions: number;
  setIsHistoryOpen: (open: boolean) => void;
}

export const AutoAnalysis = ({
  selectedTimeframes,
  selectedInterval,
  selectedAnalysisTypes,
  onAnalysisComplete,
  repetitions,
  setIsHistoryOpen
}: AutoAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { startAutoAnalysis, stopAutoAnalysis } = useAutoAnalysis();

  const handleAnalysisClick = async () => {
    if (isAnalyzing) {
      stopAutoAnalysis();
      setIsAnalyzing(false);
      return;
    }

    // Get the current price from the price input field
    const priceInput = document.querySelector('input[type="number"]') as HTMLInputElement;
    const currentPrice = priceInput ? Number(priceInput.value) : undefined;

    if (!currentPrice) {
      toast.error("الرجاء إدخال السعر الحالي للتحليل");
      return;
    }

    // Get the symbol from the TradingViewSelector component
    const symbolSelect = document.querySelector('select[value]') as HTMLSelectElement;
    const symbol = symbolSelect?.value;

    if (!symbol) {
      toast.error("الرجاء اختيار رمز العملة أو الزوج");
      return;
    }

    console.log("Starting auto analysis with symbol:", symbol);

    setIsAnalyzing(true);
    try {
      await startAutoAnalysis({
        timeframes: selectedTimeframes,
        interval: selectedInterval,
        analysisTypes: selectedAnalysisTypes,
        repetitions,
        currentPrice,
        symbol,
        onAnalysisComplete: (result) => {
          console.log("Auto analysis result:", result);
          if (result && onAnalysisComplete) {
            onAnalysisComplete(result);
          }
        }
      });
    } catch (error) {
      console.error("Error in auto analysis:", error);
      toast.error("حدث خطأ أثناء التحليل التلقائي");
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