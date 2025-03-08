
import { Waves, BarChart2 } from "lucide-react";
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
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out"
            >
              <Waves className="w-4 h-4" />
              <span className="whitespace-nowrap">Waves Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Market movement analysis according to Elliott Wave theory to identify trends and predict price movements</p>
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
              className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out"
            >
              <BarChart2 className="w-4 h-4" />
              <span className="whitespace-nowrap">Price Action Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Analysis of raw price movement without additional indicators, relying on candlestick patterns and market structures</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
