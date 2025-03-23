
import { Canvas } from "../../Canvas";
import { AnalysisData } from "@/types/analysis";
import { ChartHeader } from "./ChartHeader";

interface ChartImageDisplayProps {
  image: string;
  analysis: AnalysisData | null;
  onClose: () => void;
  symbol?: string;
  currentAnalysis?: string;
}

export const ChartImageDisplay = ({ 
  image, 
  analysis, 
  onClose, 
  symbol, 
  currentAnalysis 
}: ChartImageDisplayProps) => {
  if (!image) return null;
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <ChartHeader symbol={symbol} currentAnalysis={currentAnalysis} />
      <Canvas image={image} analysis={analysis!} onClose={onClose} />
    </div>
  );
};
