import { ChartDisplay } from "@/components/ChartDisplay";
import { AnalysisData } from "@/types/analysis";

interface AnalysisContainerProps {
  image: string | null;
  analysis: AnalysisData | null;
  isAnalyzing: boolean;
  onClose: () => void;
  symbol?: string;
  currentAnalysis?: string;
}

export const AnalysisContainer = ({
  image,
  analysis,
  isAnalyzing,
  onClose,
  symbol,
  currentAnalysis
}: AnalysisContainerProps) => {
  if (!image && !analysis && !isAnalyzing) return null;

  return (
    <div className="space-y-8">
      <ChartDisplay
        image={image}
        analysis={analysis}
        isAnalyzing={isAnalyzing}
        onClose={onClose}
        symbol={symbol}
        currentAnalysis={currentAnalysis}
      />
    </div>
  );
};