
import { ChartDisplay as EnhancedChartDisplay } from "./chart/display/ChartDisplay";
import { AnalysisData } from "@/types/analysis";

interface ChartDisplayProps {
  image: string | null;
  analysis: AnalysisData | null;
  isAnalyzing: boolean;
  onClose: () => void;
  symbol?: string;
  currentAnalysis?: string;
}

export const ChartDisplay = ({ 
  image, 
  analysis, 
  isAnalyzing, 
  onClose, 
  symbol,
  currentAnalysis 
}: ChartDisplayProps) => {
  console.log("ChartDisplay - Analysis Data:", analysis);

  return (
    <EnhancedChartDisplay
      image={image}
      analysis={analysis}
      isAnalyzing={isAnalyzing}
      onClose={onClose}
      symbol={symbol}
      currentAnalysis={currentAnalysis}
    />
  );
};
