
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
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
