import { AutoAnalysisButton } from "./AutoAnalysisButton";
import { RepetitionInput } from "./RepetitionInput";
import { TimeframeAnalysis } from "./TimeframeAnalysis";
import { IntervalAnalysis } from "./IntervalAnalysis";
import { AnalysisTypes } from "./AnalysisTypes";
import { useState } from "react";

interface AnalysisSettingsProps {
  onTimeframesChange: (timeframes: string[]) => void;
  onIntervalChange: (interval: string) => void;
  setIsHistoryOpen: (open: boolean) => void;
  onAnalysisComplete: (newItem: any) => void;
}

export const AnalysisSettings = ({
  onTimeframesChange,
  onIntervalChange,
  setIsHistoryOpen,
  onAnalysisComplete
}: AnalysisSettingsProps) => {
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<string>("");
  const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState<string[]>([]);
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

  const handleAnalysisTypesChange = (types: string[]) => {
    setSelectedAnalysisTypes(types);
  };

  const handleRepetitionsChange = (value: number) => {
    setRepetitions(value);
  };

  const handleAnalysisClick = () => {
    setIsAnalyzing(!isAnalyzing);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <TimeframeAnalysis
        selectedTimeframes={selectedTimeframes}
        onTimeframesChange={handleTimeframesChange}
      />
      
      <IntervalAnalysis
        selectedInterval={selectedInterval}
        onIntervalChange={handleIntervalChange}
      />
      
      <AnalysisTypes
        selectedTypes={selectedAnalysisTypes}
        onTypesChange={handleAnalysisTypesChange}
      />
      
      <RepetitionInput
        value={repetitions}
        onChange={handleRepetitionsChange}
      />
      
      <AutoAnalysisButton
        isAnalyzing={isAnalyzing}
        onClick={handleAnalysisClick}
        disabled={selectedTimeframes.length === 0 || !selectedInterval || selectedAnalysisTypes.length === 0}
        setIsHistoryOpen={setIsHistoryOpen}
      />
    </div>
  );
};