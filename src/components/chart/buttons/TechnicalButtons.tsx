
import { Button } from "@/components/ui/button";
import { TrendingUp, Building2, Turtle, Activity } from "lucide-react";
import { AnalysisTooltip, analysisTypeTooltips } from "@/components/ui/tooltips/AnalysisTooltips";

interface TechnicalButtonsProps {
  isAnalyzing: boolean;
  onSMCClick: (e: React.MouseEvent) => void;
  onICTClick: (e: React.MouseEvent) => void;
  onTurtleSoupClick: (e: React.MouseEvent) => void;
  onGannClick: (e: React.MouseEvent) => void;
}

export const TechnicalButtons = ({
  isAnalyzing,
  onSMCClick,
  onICTClick,
  onTurtleSoupClick,
  onGannClick
}: TechnicalButtonsProps) => {
  return (
    <>
      <AnalysisTooltip content={analysisTypeTooltips["SMC"]}>
        <Button
          type="button"
          disabled={isAnalyzing}
          onClick={onSMCClick}
          className="bg-orange-600 hover:bg-orange-700 text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4"
        >
          <TrendingUp className="w-4 h-4" />
          <span className="whitespace-nowrap">تحليل SMC</span>
        </Button>
      </AnalysisTooltip>

      <AnalysisTooltip content={analysisTypeTooltips["ICT"]}>
        <Button
          type="button"
          disabled={isAnalyzing}
          onClick={onICTClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4"
        >
          <Building2 className="w-4 h-4" />
          <span className="whitespace-nowrap">تحليل ICT</span>
        </Button>
      </AnalysisTooltip>

      <AnalysisTooltip content={analysisTypeTooltips["Turtle Soup"]}>
        <Button
          type="button"
          disabled={isAnalyzing}
          onClick={onTurtleSoupClick}
          className="bg-green-600 hover:bg-green-700 text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4"
        >
          <Turtle className="w-4 h-4" />
          <span className="whitespace-nowrap">تحليل Turtle Soup</span>
        </Button>
      </AnalysisTooltip>

      <AnalysisTooltip content={analysisTypeTooltips["Gann"]}>
        <Button
          type="button"
          disabled={isAnalyzing}
          onClick={onGannClick}
          className="bg-yellow-600 hover:bg-yellow-700 text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4"
        >
          <Activity className="w-4 h-4" />
          <span className="whitespace-nowrap">تحليل Gann</span>
        </Button>
      </AnalysisTooltip>
    </>
  );
};
