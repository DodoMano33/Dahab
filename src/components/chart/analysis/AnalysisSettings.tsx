import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TimeframeAnalysis } from "./TimeframeAnalysis";
import { IntervalAnalysis } from "./IntervalAnalysis";
import { RepetitionInput } from "./RepetitionInput";
import { AutoAnalysisButton } from "./AutoAnalysisButton";
import { SearchHistoryItem } from "@/types/analysis";
import { toast } from "sonner";

interface AnalysisSettingsProps {
  onTimeframesChange: (timeframes: string[]) => void;
  onIntervalChange: (interval: string) => void;
  setIsHistoryOpen: (open: boolean) => void;
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
  defaultSymbol?: string;
  defaultPrice?: number | null;
}

export const AnalysisSettings = ({
  onTimeframesChange,
  onIntervalChange,
  setIsHistoryOpen,
  onAnalysisComplete,
  defaultSymbol,
  defaultPrice
}: AnalysisSettingsProps) => {
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<string>("1h");
  const [repetitions, setRepetitions] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTimeframesChange = (timeframes: string[]) => {
    setSelectedTimeframes(timeframes);
    onTimeframesChange(timeframes);
  };

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval);
    onIntervalChange(interval);
  };

  const handleAutoAnalysis = () => {
    if (isAnalyzing) {
      setIsAnalyzing(false);
      return;
    }

    // Get the current values from the input fields
    const symbolInput = document.querySelector('input#symbol') as HTMLInputElement;
    const priceInput = document.querySelector('input#price') as HTMLInputElement;

    const symbol = symbolInput?.value || defaultSymbol;
    const price = priceInput?.value ? Number(priceInput.value) : defaultPrice;

    if (!symbol) {
      toast.error("الرجاء إدخال رمز العملة أو انتظار تحميل الشارت");
      return;
    }

    if (!price) {
      toast.error("الرجاء إدخال السعر أو انتظار تحميل السعر من الشارت");
      return;
    }

    if (selectedTimeframes.length === 0) {
      toast.error("الرجاء اختيار إطار زمني واحد على الأقل");
      return;
    }

    console.log("Starting auto analysis with:", {
      symbol,
      price,
      timeframes: selectedTimeframes,
      interval: selectedInterval,
      repetitions
    });

    setIsAnalyzing(true);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">إعدادات التحليل التلقائي</h2>
      
      <TimeframeAnalysis
        selectedTimeframes={selectedTimeframes}
        onTimeframesChange={handleTimeframesChange}
      />
      
      <IntervalAnalysis
        selectedInterval={selectedInterval}
        onIntervalChange={handleIntervalChange}
      />
      
      <RepetitionInput
        repetitions={repetitions}
        onRepetitionsChange={setRepetitions}
      />
      
      <AutoAnalysisButton
        isAnalyzing={isAnalyzing}
        onClick={handleAutoAnalysis}
        disabled={selectedTimeframes.length === 0}
        setIsHistoryOpen={setIsHistoryOpen}
      />
    </div>
  );
};