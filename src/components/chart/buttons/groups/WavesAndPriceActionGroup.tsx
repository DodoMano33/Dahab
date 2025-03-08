
import { Activity, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WavesAndPriceActionGroupProps {
  isAnalyzing: boolean;
  onWavesClick: (e: React.MouseEvent) => void;
  onPriceActionClick: (e: React.MouseEvent) => void;
}

export const WavesAndPriceActionGroup = ({
  isAnalyzing,
  onWavesClick,
  onPriceActionClick
}: WavesAndPriceActionGroupProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onWavesClick}
              className="bg-gradient-to-r from-indigo-400 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Activity className="w-4 h-4" />
              <span className="whitespace-nowrap">Wave Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Analysis based on Elliott Wave Theory to predict market cycles and price movements</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onPriceActionClick}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="whitespace-nowrap">Price Action</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Analysis that focuses on price movement patterns without indicators, using raw market data</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
