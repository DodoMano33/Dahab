
import { Divide, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FibonacciButtonGroupProps {
  isAnalyzing: boolean;
  onFibonacciClick: (e: React.MouseEvent) => void;
  onFibonacciAdvancedClick: (e: React.MouseEvent) => void;
}

export const FibonacciButtonGroup = ({
  isAnalyzing,
  onFibonacciClick,
  onFibonacciAdvancedClick
}: FibonacciButtonGroupProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onFibonacciClick}
              className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-600 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Divide className="w-4 h-4" />
              <span className="whitespace-nowrap">Fibonacci Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Strategy based on Fibonacci retracement and extension levels to determine entry and exit points</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onFibonacciAdvancedClick}
              className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Target className="w-4 h-4" />
              <span className="whitespace-nowrap">Advanced Fibonacci</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Advanced trading strategy combining Fibonacci with institutional liquidity, volume profile, and market structure analysis</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
