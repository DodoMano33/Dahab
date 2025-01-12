import { useState } from "react";
import { useAnalysisHandler } from "./chart/analysis/AnalysisHandler";
import { AnalysisForm } from "./chart/analysis/AnalysisForm";
import { HistoryDialog } from "./chart/history/HistoryDialog";
import { ChartDisplay } from "./ChartDisplay";
import { AnalysisSettings } from "./chart/analysis/AnalysisSettings";
import { useSearchHistory } from "./hooks/useSearchHistory";
import { useBackTest } from "./hooks/useBackTest";

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
    <div className="p-6">
      <div className="space-y-6">
        <AnalysisSettings
          onTimeframesChange={handleTimeframesChange}
          onIntervalChange={handleIntervalChange}
          setIsHistoryOpen={setIsHistoryOpen}
          onAnalysisComplete={handleAnalysisComplete}
        />
        
        <div className="grid grid-cols-1 gap-6">
          <AnalysisForm
            onAnalysis={addToSearchHistory}
            isAnalyzing={isAnalyzing}
            currentAnalysis={currentAnalysis || ""}
          />
          
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
        </div>
      </div>
      
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