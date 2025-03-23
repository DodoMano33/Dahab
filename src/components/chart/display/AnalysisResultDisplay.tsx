
import { AnalysisResult } from "../../AnalysisResult";
import { AnalysisData } from "@/types/analysis";

interface AnalysisResultDisplayProps {
  analysis: AnalysisData | null;
  isLoading: boolean;
}

export const AnalysisResultDisplay = ({ 
  analysis, 
  isLoading 
}: AnalysisResultDisplayProps) => {
  if (!analysis && !isLoading) return null;
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-right">نتائج التحليل</h2>
      <AnalysisResult analysis={analysis!} isLoading={isLoading} />
    </div>
  );
};
