
import { ChartImageDisplay } from "./ChartImageDisplay";
import { AnalysisResultDisplay } from "./AnalysisResultDisplay";
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
  console.log("ChartDisplay rendering", { hasImage: !!image, hasAnalysis: !!analysis, isAnalyzing });

  if (!image && !analysis && !isAnalyzing) return null;

  return (
    <div className="space-y-8">
      {image && (
        <ChartImageDisplay 
          image={image} 
          analysis={analysis} 
          onClose={onClose} 
          symbol={symbol} 
          currentAnalysis={currentAnalysis} 
        />
      )}

      {(analysis || isAnalyzing) && (
        <AnalysisResultDisplay 
          analysis={analysis} 
          isLoading={isAnalyzing} 
        />
      )}
    </div>
  );
};

export default ChartDisplay;
