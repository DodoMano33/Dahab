import { Canvas } from "../Canvas";
import { AnalysisResult } from "../AnalysisResult";

interface AnalysisData {
  pattern: string;
  direction: string;
  currentPrice: number;
  support: number;
  resistance: number;
  stopLoss: number;
  targets?: number[];
  fibonacciLevels?: {
    level: number;
    price: number;
  }[];
}

interface ChartDisplayProps {
  image: string | null;
  analysis: AnalysisData | null;
  isAnalyzing: boolean;
  onClose: () => void;
}

export const ChartDisplay = ({ image, analysis, isAnalyzing, onClose }: ChartDisplayProps) => {
  if (!image) return null;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-right">الشارت</h2>
        <Canvas image={image} analysis={analysis!} onClose={onClose} />
      </div>

      {analysis && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-xl font-semibold mb-4 text-right">نتائج التحليل</h2>
          <AnalysisResult analysis={analysis} isLoading={isAnalyzing} />
        </div>
      )}
    </>
  );
};