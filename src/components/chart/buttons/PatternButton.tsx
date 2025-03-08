
import { Button } from "@/components/ui/button";
import { Triangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PatternButtonProps {
  isAnalyzing: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const PatternButton = ({ isAnalyzing, onClick }: PatternButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            disabled={isAnalyzing}
            onClick={onClick}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4 rounded-lg transition-all duration-300 ease-in-out"
          >
            <Triangle className="w-4 h-4" />
            <span className="whitespace-nowrap">Patterns Analysis</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <p>Analysis of recurring technical patterns on the chart to predict future price movements</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
