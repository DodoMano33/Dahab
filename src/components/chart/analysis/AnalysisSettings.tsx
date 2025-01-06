import { useState } from "react";
import { TimeframeAnalysis } from "./TimeframeAnalysis";
import { IntervalAnalysis } from "./IntervalAnalysis";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
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

  const handleTimeframesChange = (timeframes: string[]) => {
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

  const handleHistoryClick = () => {
    console.log("فتح سجل البحث المختبر");
    // TODO: Implement history view functionality
    toast.info("سيتم عرض سجل البحث المختبر قريباً");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-white bg-red-600 py-4">
        إختيار التحليلات
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TimeframeAnalysis
          selectedTimeframes={selectedTimeframes}
          onTimeframeChange={handleTimeframesChange}
        />
        <IntervalAnalysis
          selectedInterval={selectedInterval}
          onIntervalChange={handleIntervalChange}
        />
      </div>

      <div className="flex flex-col gap-4 items-center">
        <Button 
          onClick={handleActivate}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 text-lg w-full md:w-auto"
        >
          تفعيل
        </Button>

        <Button
          onClick={handleHistoryClick}
          variant="outline"
          className="flex items-center gap-2 w-full md:w-auto"
        >
          <History className="w-5 h-5" />
          سجل البحث الذي تم اختباره
        </Button>
      </div>
    </div>
  );
};