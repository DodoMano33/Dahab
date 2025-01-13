import { useState } from "react";
import { TimeframeAnalysis } from "./TimeframeAnalysis";
import { IntervalAnalysis } from "./IntervalAnalysis";
import { AnalysisTypes } from "./AnalysisTypes";
import { AutoAnalysis } from "./AutoAnalysis";
import { RepetitionInput } from "./RepetitionInput";
import { SearchHistoryItem } from "@/types/analysis";

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
  const [selectedInterval, setSelectedInterval] = useState<string>("");
  const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState<string[]>([]);
  const [repetitions, setRepetitions] = useState<string>("");

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

      <div className="flex flex-col md:flex-row items-start gap-4">
        <RepetitionInput
          repetitions={repetitions}
          onRepetitionsChange={setRepetitions}
        />
        <div className="flex-1">
          <AutoAnalysis
            selectedTimeframes={selectedTimeframes}
            selectedInterval={selectedInterval}
            selectedAnalysisTypes={selectedAnalysisTypes}
            onAnalysisComplete={onAnalysisComplete}
            repetitions={repetitions ? parseInt(repetitions) : 1}
            setIsHistoryOpen={setIsHistoryOpen}
          />
        </div>
      </div>
    </div>
  );
};