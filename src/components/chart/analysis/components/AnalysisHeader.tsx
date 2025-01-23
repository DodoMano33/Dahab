import { Badge } from "@/components/ui/badge";

interface AnalysisHeaderProps {
  symbol?: string;
  currentAnalysis?: string;
}

export const AnalysisHeader = ({ symbol, currentAnalysis }: AnalysisHeaderProps) => {
  return (
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
  );
};