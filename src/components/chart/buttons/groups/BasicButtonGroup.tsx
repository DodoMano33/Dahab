
import { Brain, Candlestick, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BasicButtonGroupProps {
  isAnalyzing: boolean;
  onNormalClick: (e: React.MouseEvent) => void;
  onScalpingClick: (e: React.MouseEvent) => void;
  onAIClick: (e: React.MouseEvent) => void;
}

export const BasicButtonGroup = ({
  isAnalyzing,
  onNormalClick,
  onScalpingClick,
  onAIClick
}: BasicButtonGroupProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onNormalClick}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Gem className="w-4 h-4" />
              <span className="whitespace-nowrap">Standard Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Basic technical analysis and trading strategy based on price action and key levels</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onScalpingClick}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Candlestick className="w-4 h-4" />
              <span className="whitespace-nowrap">Scalping Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Short-term trading strategy focused on making small profits frequently using price volatility</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onAIClick}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 col-span-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Brain className="w-4 h-4" />
              <span className="whitespace-nowrap">AI-Powered Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Advanced AI-powered analysis that combines multiple strategies and identifies optimal entry and exit points</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
