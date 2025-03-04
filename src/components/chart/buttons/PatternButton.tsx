
import { Button } from "@/components/ui/button";
import { Triangle } from "lucide-react";
import { AnalysisTooltip, analysisTypeTooltips } from "@/components/ui/tooltips/AnalysisTooltips";

interface PatternButtonProps {
  isAnalyzing: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const PatternButton = ({ isAnalyzing, onClick }: PatternButtonProps) => {
  return (
    <AnalysisTooltip content={analysisTypeTooltips["Patterns"]}>
      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={onClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4"
      >
        <Triangle className="w-4 h-4" />
        <span className="whitespace-nowrap">تحليل Patterns</span>
      </Button>
    </AnalysisTooltip>
  );
};
