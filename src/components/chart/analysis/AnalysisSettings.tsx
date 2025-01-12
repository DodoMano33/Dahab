import { useState } from "react";
import { TimeframeAnalysis } from "./TimeframeAnalysis";
import { IntervalAnalysis } from "./IntervalAnalysis";
import { AutoAnalysis } from "./AutoAnalysis";
import { RepetitionInput } from "./RepetitionInput";

interface AnalysisSettingsProps {
  onTimeframesChange: (timeframes: string[]) => void;
  onIntervalChange: (interval: string) => void;
  setIsHistoryOpen: (isOpen: boolean) => void;
  onAnalysisComplete: (newItem: any) => void;
}

export const AnalysisSettings = ({
  onTimeframesChange,
  onIntervalChange,
  setIsHistoryOpen,
  onAnalysisComplete,
}: AnalysisSettingsProps) => {
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
  const [selectedInterval, setSelectedInterval] = useState("");
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
      <div className="grid grid-cols-2 gap-4">
        <TimeframeAnalysis
          selectedTimeframes={selectedTimeframes}
          onTimeframesChange={handleTimeframesChange}
        />
        <IntervalAnalysis
          selectedInterval={selectedInterval}
          onIntervalChange={handleIntervalChange}
        />
      </div>

      <div className="flex items-start gap-4">
        <RepetitionInput
          repetitions={repetitions}
          onRepetitionsChange={setRepetitions}
        />
        <AutoAnalysis
          selectedTimeframes={selectedTimeframes}
          selectedInterval={selectedInterval}
          setIsHistoryOpen={setIsHistoryOpen}
          onAnalysisComplete={onAnalysisComplete}
          repetitions={repetitions ? parseInt(repetitions) : 1}
        />
      </div>
    </div>
  );
};