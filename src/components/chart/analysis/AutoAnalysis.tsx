import { useState } from "react";
import { Button } from "@/components/ui/button";
import { History, Play, Square } from "lucide-react";
import { toast } from "sonner";
import { useAutoAnalysis } from "./hooks/useAutoAnalysis";
import { SearchHistoryItem } from "@/types/analysis";
import { BackTestResultsDialog } from "../backtest/BackTestResultsDialog";

interface AutoAnalysisProps {
  selectedTimeframes: string[];
  selectedInterval: string;
  selectedAnalysisTypes: string[];
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
  repetitions: number;
  setIsHistoryOpen: (open: boolean) => void;
  defaultSymbol?: string;
  defaultPrice?: number | null;
}

export const AutoAnalysis = ({
  selectedTimeframes,
  selectedInterval,
  selectedAnalysisTypes,
  onAnalysisComplete,
  repetitions,
  setIsHistoryOpen,
  defaultSymbol,
  defaultPrice
}: AutoAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBackTestOpen, setIsBackTestOpen] = useState(false);
  const [isEntryPointBackTestOpen, setIsEntryPointBackTestOpen] = useState(false);
  const { startAutoAnalysis, stopAutoAnalysis } = useAutoAnalysis();

  const handleAnalysisClick = async () => {
    if (isAnalyzing) {
      stopAutoAnalysis();
      setIsAnalyzing(false);
      return;
    }

    if (!defaultSymbol) {
      toast.error("الرجاء إدخال رمز العملة أو الزوج");
      return;
    }

    if (!defaultPrice) {
      toast.error("الرجاء انتظار تحميل السعر من الشارت");
      return;
    }

    console.log("Starting auto analysis with symbol:", defaultSymbol, "and price:", defaultPrice);

    setIsAnalyzing(true);
    try {
      await startAutoAnalysis({
        timeframes: selectedTimeframes,
        interval: selectedInterval,
        analysisTypes: selectedAnalysisTypes,
        repetitions,
        currentPrice: defaultPrice,
        symbol: defaultSymbol,
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

  // تحديث شرط تعطيل الزر بشكل أكثر دقة
  const isButtonDisabled = !defaultSymbol || !defaultPrice || defaultPrice <= 0;

  return (
    <div className="flex flex-col gap-6">
      <Button 
        onClick={handleAnalysisClick}
        disabled={isButtonDisabled}
        className={`${
          isAnalyzing 
            ? 'bg-red-600 hover:bg-red-700' 
            : !isButtonDisabled
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400'
        } text-white px-8 py-2 text-lg flex items-center gap-2 h-17 max-w-[600px] w-full transition-all duration-200`}
      >
        {isAnalyzing ? (
          <>
            <Square className="w-5 h-5" />
            إيقاف التفعيل
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            تفعيل
          </>
        )}
      </Button>

      <div className="grid grid-cols-1 gap-4 mt-4">
        <Button
          onClick={() => setIsBackTestOpen(true)}
          className="bg-[#800000] hover:bg-[#600000] text-white h-20 flex items-center gap-2 max-w-[600px] w-full"
        >
          <History className="w-5 h-20" />
          Back Test Results
        </Button>

        <Button
          onClick={() => setIsEntryPointBackTestOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white h-20 flex items-center gap-2 max-w-[600px] w-full"
        >
          <History className="w-5 h-20" />
          Back Test Results (أفضل نقطة دخول)
        </Button>

        <Button
          variant="outline"
          className="h-20 flex items-center gap-2 max-w-[600px] w-full"
          onClick={() => setIsHistoryOpen(true)}
        >
          <History className="w-5 h-20" />
          سجل البحث
        </Button>
      </div>

      <BackTestResultsDialog 
        isOpen={isBackTestOpen}
        onClose={() => setIsBackTestOpen(false)}
      />

      <BackTestResultsDialog 
        isOpen={isEntryPointBackTestOpen}
        onClose={() => setIsEntryPointBackTestOpen(false)}
        useEntryPoint={true}
      />
    </div>
  );
};