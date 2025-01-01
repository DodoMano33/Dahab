import { Button } from "@/components/ui/button";
import { TrendingUp, Building2, Turtle, Activity, Waves } from "lucide-react";

interface TechnicalButtonsProps {
  isAnalyzing: boolean;
  onSMCClick: (e: React.MouseEvent) => void;
  onICTClick: (e: React.MouseEvent) => void;
  onTurtleSoupClick: (e: React.MouseEvent) => void;
  onGannClick: (e: React.MouseEvent) => void;
  onWavesClick: (e: React.MouseEvent) => void;
}

export const TechnicalButtons = ({
  isAnalyzing,
  onSMCClick,
  onICTClick,
  onTurtleSoupClick,
  onGannClick,
  onWavesClick
}: TechnicalButtonsProps) => {
  return (
    <>
      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={onSMCClick}
        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
      >
        <TrendingUp className="w-4 h-4" />
        تحليل SMC
      </Button>

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={onICTClick}
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
      >
        <Building2 className="w-4 h-4" />
        تحليل ICT
      </Button>

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={onTurtleSoupClick}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
      >
        <Turtle className="w-4 h-4" />
        تحليل Turtle Soup
      </Button>

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={onGannClick}
        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2"
      >
        <Activity className="w-4 h-4" />
        تحليل Gann
      </Button>

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={onWavesClick}
        className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
      >
        <Waves className="w-4 h-4" />
        تحليل Waves
      </Button>
    </>
  );
};