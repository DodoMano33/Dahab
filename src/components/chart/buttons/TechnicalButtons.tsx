import { Button } from "@/components/ui/button";
import { TrendingUp, Building2, Turtle, Activity } from "lucide-react";

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
      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={onSMCClick}
        className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1.5 text-sm py-1.5 px-2 md:px-4"
      >
        <TrendingUp className="w-4 h-4" />
        <span className="whitespace-nowrap">تحليل SMC</span>
      </Button>

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={onICTClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 text-sm py-1.5 px-2 md:px-4"
      >
        <Building2 className="w-4 h-4" />
        <span className="whitespace-nowrap">تحليل ICT</span>
      </Button>

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={onTurtleSoupClick}
        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5 text-sm py-1.5 px-2 md:px-4"
      >
        <Turtle className="w-4 h-4" />
        <span className="whitespace-nowrap">تحليل Turtle Soup</span>
      </Button>

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={onGannClick}
        className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-1.5 text-sm py-1.5 px-2 md:px-4"
      >
        <Activity className="w-4 h-4" />
        <span className="whitespace-nowrap">تحليل Gann</span>
      </Button>
    </>
  );
};