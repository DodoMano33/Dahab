import { Canvas } from "./Canvas";
import { AnalysisResult } from "./AnalysisResult";
import { AnalysisData } from "@/types/analysis";

interface ChartDisplayProps {
  image: string | null;
  analysis: AnalysisData | null;
  isAnalyzing: boolean;
  onClose: () => void;
  symbol?: string;
}

export const ChartDisplay = ({ image, analysis, isAnalyzing, onClose, symbol }: ChartDisplayProps) => {
  if (!image && !analysis) return null;

  return (
    <div className="space-y-8">
      {image && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">تحليل الشارت {symbol && `(${symbol})`}</h2>
          </div>
          <Canvas image={image} analysis={analysis!} onClose={onClose} />
        </div>
      )}

      {analysis && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-right">نتائج التحليل</h2>
          <AnalysisResult analysis={analysis} isLoading={isAnalyzing} />
        </div>
      )}
    </div>
  );
};