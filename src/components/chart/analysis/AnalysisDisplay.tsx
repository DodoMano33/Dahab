import { ChartDisplay } from "../../ChartDisplay";
import { AnalysisData } from "@/types/analysis";
import { Card } from "@/components/ui/card";

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
  console.log("AnalysisDisplay - Analysis Data:", analysis);

  if (!analysis && !isAnalyzing && !image) {
    return (
      <Card className="p-6 text-center text-gray-500">
        اختر نوع التحليل لعرض النتائج هنا
      </Card>
    );
  }

  return (
    <div className="sticky top-4">
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