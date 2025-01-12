import { AutoAnalysis } from "./AutoAnalysis";
import { useState } from "react";
import { SearchHistoryItem } from "@/types/analysis";

interface AnalysisSettingsProps {
  onTimeframesChange: (timeframes: string[]) => void;
  onIntervalChange: (interval: string) => void;
  setIsHistoryOpen: (isOpen: boolean) => void;
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
}

export const AnalysisSettings = ({
  onTimeframesChange,
  onIntervalChange,
  setIsHistoryOpen,
  onAnalysisComplete
}: AnalysisSettingsProps) => {
  const [selectedTimeframes] = useState<string[]>([]);
  const [selectedInterval] = useState<string>("");
  const [selectedAnalysisTypes] = useState<string[]>([]);
  const [repetitions] = useState<number>(1);

  return (
    <div className="space-y-8">
      <AutoAnalysis
        selectedTimeframes={selectedTimeframes}
        selectedInterval={selectedInterval}
        selectedAnalysisTypes={selectedAnalysisTypes}
        onAnalysisComplete={onAnalysisComplete}
        repetitions={repetitions}
        onHistoryClick={() => setIsHistoryOpen(true)}
      />
    </div>
  );
};