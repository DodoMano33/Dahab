import { useState } from "react";
import { TimeframeAnalysis } from "./TimeframeAnalysis";
import { IntervalAnalysis } from "./IntervalAnalysis";
import { AnalysisTypes } from "./AnalysisTypes";
import { SymbolPriceInput } from "./SymbolPriceInput";
import { AutoAnalysis } from "./AutoAnalysis";
import { RepetitionInput } from "./RepetitionInput";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

interface AnalysisSettingsProps {
  onTimeframesChange: (timeframes: string[]) => void;
  onIntervalChange: (interval: string) => void;
  setIsHistoryOpen: (open: boolean) => void;
}

export const AnalysisSettings = ({
  onTimeframesChange,
  onIntervalChange,
  setIsHistoryOpen,
}: AnalysisSettingsProps) => {
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<string>("");
  const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState<string[]>([]);
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");
  const [repetitions, setRepetitions] = useState("");

  const handleTimeframesChange = (timeframes: string[]) => {
    setSelectedTimeframes(timeframes);
    onTimeframesChange(timeframes);
  };

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval);
    onIntervalChange(interval);
  };

  return (
    <div className="space-y-6">
      <SymbolPriceInput
        symbol={symbol}
        price={price}
        onSymbolChange={setSymbol}
        onPriceChange={setPrice}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TimeframeAnalysis
          selectedTimeframes={selectedTimeframes}
          onTimeframeChange={handleTimeframesChange}
        />
        <IntervalAnalysis
          selectedInterval={selectedInterval}
          onIntervalChange={handleIntervalChange}
        />
        <AnalysisTypes
          selectedTypes={selectedAnalysisTypes}
          onTypesChange={setSelectedAnalysisTypes}
        />
      </div>

      <RepetitionInput
        repetitions={repetitions}
        onRepetitionsChange={setRepetitions}
      />

      <div className="flex gap-4 items-center justify-center">
        <AutoAnalysis
          symbol={symbol}
          price={price}
          selectedTimeframes={selectedTimeframes}
          selectedInterval={selectedInterval}
          selectedAnalysisTypes={selectedAnalysisTypes}
          onAnalysisComplete={() => setIsHistoryOpen(true)}
          repetitions={repetitions ? parseInt(repetitions) : 1}
        />
        <Button
          onClick={() => setIsHistoryOpen(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <History className="w-4 h-4" />
          سجل البحث
        </Button>
      </div>
    </div>
  );
};