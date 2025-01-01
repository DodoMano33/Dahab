import { ChartDisplay } from "../ChartDisplay";
import { AnalysisData } from "@/types/analysis";

interface AnalysisDisplayProps {
  image: string | null;
  analysis: AnalysisData | null;
  isAnalyzing: boolean;
  onClose: () => void;
  symbol?: string;
  currentAnalysis?: string;
}

export const AnalysisDisplay = ({
  image,
  analysis,
  isAnalyzing,
  onClose,
  symbol,
  currentAnalysis
}: AnalysisDisplayProps) => {
  return (
    <ChartDisplay
      image={image}
      analysis={analysis}
      isAnalyzing={isAnalyzing}
      onClose={onClose}
      symbol={symbol}
      currentAnalysis={currentAnalysis}
    />
  );
};