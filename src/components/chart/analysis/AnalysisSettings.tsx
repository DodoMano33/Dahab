import { useState } from "react";
import { TimeframeAnalysis } from "./TimeframeAnalysis";
import { IntervalAnalysis } from "./IntervalAnalysis";
import { AnalysisLegend } from "./AnalysisLegend";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

  const handleActivate = () => {
    if (selectedTimeframes.length === 0 && !selectedInterval) {
      toast.error("الرجاء اختيار إطار زمني أو مدة للتحليل");
      return;
    }
    
    console.log("تم تفعيل التحليلات:", {
      timeframes: selectedTimeframes,
      interval: selectedInterval
    });
    
    toast.success("تم تفعيل التحليلات بنجاح");
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

      <div className="flex justify-center">
        <Button 
          onClick={handleActivate}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 text-lg"
        >
          تفعيل
        </Button>
      </div>

      <AnalysisLegend />
    </div>
  );
};