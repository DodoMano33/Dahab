
import { Canvas } from "../Canvas";
import { AnalysisResult } from "../AnalysisResult";
import { AnalysisData } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";

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
  if (!image && !analysis && !isAnalyzing) return null;

  console.log("ChartDisplay - Analysis Data:", analysis); // إضافة سجل للتأكد من وصول البيانات

  return (
    <div className="space-y-8">
      {image && (
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              تحليل الشارت {symbol && `(${symbol})`}
            </h2>
            {currentAnalysis && (
              <Badge variant="outline" className="text-sm">
                نوع التحليل: {currentAnalysis}
              </Badge>
            )}
          </div>
          <Canvas image={image} analysis={analysis!} onClose={onClose} />
        </div>
      )}

      {(analysis || isAnalyzing) && (
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-right">نتائج التحليل</h2>
          <AnalysisResult analysis={analysis!} isLoading={isAnalyzing} />
        </div>
      )}
    </div>
  );
};
