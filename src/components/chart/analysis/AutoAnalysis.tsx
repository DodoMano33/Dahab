import { useState } from "react";
import { AutoAnalysisButton } from "./AutoAnalysisButton";
import { useAutoAnalysis } from "./hooks/useAutoAnalysis";
import { toast } from "sonner";

interface AutoAnalysisProps {
  selectedTimeframes: string[];
  selectedInterval: string;
  selectedAnalysisTypes: string[];
  onAnalysisComplete?: (newItem: any) => void;
  repetitions: number;
  setIsHistoryOpen: (open: boolean) => void;
  currentPrice: string;
}

export const AutoAnalysis = ({
  selectedTimeframes,
  selectedInterval,
  selectedAnalysisTypes,
  onAnalysisComplete,
  repetitions,
  setIsHistoryOpen,
  currentPrice
}: AutoAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { startAutoAnalysis, stopAutoAnalysis } = useAutoAnalysis();

  const handleAnalysisClick = async () => {
    if (isAnalyzing) {
      stopAutoAnalysis();
      setIsAnalyzing(false);
      return;
    }

    if (!selectedTimeframes.length) {
      toast.error("الرجاء اختيار إطار زمني واحد على الأقل");
      return;
    }

    if (!selectedInterval) {
      toast.error("الرجاء اختيار الفاصل الزمني");
      return;
    }

    if (!selectedAnalysisTypes.length) {
      toast.error("الرجاء اختيار نوع تحليل واحد على الأقل");
      return;
    }

    if (!currentPrice || isNaN(Number(currentPrice)) || Number(currentPrice) <= 0) {
      toast.error("الرجاء إدخال السعر الحالي في الخانة العلوية");
      return;
    }

    setIsAnalyzing(true);
    try {
      await startAutoAnalysis({
        timeframes: selectedTimeframes,
        interval: selectedInterval,
        analysisTypes: selectedAnalysisTypes,
        repetitions,
        currentPrice: Number(currentPrice),
        onAnalysisComplete
      });
    } catch (error) {
      console.error("Error in auto analysis:", error);
      toast.error("حدث خطأ أثناء التحليل التلقائي");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <AutoAnalysisButton
        isAnalyzing={isAnalyzing}
        onClick={handleAnalysisClick}
        onBackTestClick={() => {}}
        setIsHistoryOpen={setIsHistoryOpen}
      />
    </div>
  );
};