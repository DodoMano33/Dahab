import { useState } from "react";
import { useAnalysisHandler } from "./chart/analysis/AnalysisHandler";
import { AnalysisForm } from "./chart/analysis/AnalysisForm";
import { HistoryDialog } from "./chart/history/HistoryDialog";
import { ChartDisplay } from "./ChartDisplay";
import { AnalysisSettings } from "./chart/analysis/AnalysisSettings";
import { useSearchHistory } from "./hooks/useSearchHistory";
import { useBackTest } from "./hooks/useBackTest";
import { Button } from "./ui/button";
import { History as HistoryIcon } from "lucide-react";

export const ChartAnalyzer = () => {
  const {
    isAnalyzing,
    image,
    analysis,
    currentSymbol,
    currentAnalysis,
    setImage,
    setAnalysis,
  } = useAnalysisHandler();

  const {
    searchHistory = [],
    isHistoryOpen,
    setIsHistoryOpen,
    handleDeleteHistoryItem,
    addToSearchHistory
  } = useSearchHistory();

  useBackTest();

  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<string>("");
  const [isBackTestOpen, setIsBackTestOpen] = useState(false);

  const handleTimeframesChange = (timeframes: string[]) => {
    if (!timeframes) {
      console.log("No timeframes provided");
      return;
    }
    setSelectedTimeframes(timeframes);
    console.log("Selected timeframes:", timeframes);
  };

  const handleIntervalChange = (interval: string) => {
    if (!interval) {
      console.log("No interval provided");
      return;
    }
    setSelectedInterval(interval);
    console.log("Selected interval:", interval);
  };

  const handleAnalysisComplete = (newItem: any) => {
    console.log("New analysis completed, adding to history:", newItem);
    addToSearchHistory(newItem);
    setIsHistoryOpen(true);
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Symbol, Price, and Timeframe Form */}
      <AnalysisForm
        onAnalysis={addToSearchHistory}
        isAnalyzing={isAnalyzing}
        currentAnalysis={currentAnalysis || ""}
      />
      
      {/* History and Back Test Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => setIsHistoryOpen(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <HistoryIcon className="w-4 h-4" />
          سجل البحث
        </Button>
        <Button
          onClick={() => setIsBackTestOpen(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          Back Test Results
        </Button>
      </div>

      {/* Auto Analysis Settings */}
      <AnalysisSettings
        onTimeframesChange={handleTimeframesChange}
        onIntervalChange={handleIntervalChange}
        setIsHistoryOpen={setIsHistoryOpen}
        onAnalysisComplete={handleAnalysisComplete}
      />
      
      {/* Manual Analysis Display */}
      {(image || analysis || isAnalyzing) && (
        <ChartDisplay
          image={image}
          analysis={analysis}
          isAnalyzing={isAnalyzing}
          onClose={() => {
            setImage(null);
            setAnalysis(null);
          }}
          symbol={currentSymbol}
          currentAnalysis={currentAnalysis}
        />
      )}
      
      {isHistoryOpen && (
        <HistoryDialog
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={searchHistory}
          onDelete={handleDeleteHistoryItem}
        />
      )}
    </div>
  );
};