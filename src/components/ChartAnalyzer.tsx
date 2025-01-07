import { useState } from "react";
import { useAnalysisHandler } from "./chart/analysis/AnalysisHandler";
import { AnalysisForm } from "./chart/analysis/AnalysisForm";
import { HistoryDialog } from "./chart/history/HistoryDialog";
import { ChartDisplay } from "./ChartDisplay";
import { AnalysisSettings } from "./chart/analysis/AnalysisSettings";
import { useSearchHistory } from "./hooks/useSearchHistory";

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

  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<string>("");
  const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState<string[]>([]);

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

  const handleAnalysisTypesChange = (types: string[]) => {
    setSelectedAnalysisTypes(types);
    console.log("Selected analysis types:", types);
  };

  return (
    <div className="space-y-8">
      <AnalysisSettings
        onTimeframesChange={handleTimeframesChange}
        onIntervalChange={handleIntervalChange}
        onAnalysisTypesChange={handleAnalysisTypesChange}
        setIsHistoryOpen={setIsHistoryOpen}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
        <div>
          <AnalysisForm
            onAnalysis={addToSearchHistory}
            isAnalyzing={isAnalyzing}
            currentAnalysis={currentAnalysis || ""}
            selectedTimeframes={selectedTimeframes}
            selectedInterval={selectedInterval}
            selectedAnalysisTypes={selectedAnalysisTypes}
          />
        </div>
        {(image || analysis || isAnalyzing) && (
          <div>
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
          </div>
        )}
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