import { useState } from "react";
import { TimeframeAnalysis } from "./TimeframeAnalysis";
import { IntervalAnalysis } from "./IntervalAnalysis";
import { AnalysisLegend } from "./AnalysisLegend";

interface AnalysisSettingsProps {
  onTimeframesChange: (timeframes: string[]) => void;
  onIntervalChange: (interval: string) => void;
}

export const AnalysisSettings = ({
  onTimeframesChange,
  onIntervalChange,
}: AnalysisSettingsProps) => {
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<string>("");

  const handleTimeframeChange = (timeframes: string[]) => {
    setSelectedTimeframes(timeframes);
    onTimeframesChange(timeframes);
  };

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval);
    onIntervalChange(interval);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-white bg-red-600 py-4">
        تفعيل التحليلات
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TimeframeAnalysis
          selectedTimeframes={selectedTimeframes}
          onTimeframeChange={handleTimeframeChange}
        />
        <IntervalAnalysis
          selectedInterval={selectedInterval}
          onIntervalChange={handleIntervalChange}
        />
      </div>

      <AnalysisLegend />
    </div>
  );
};