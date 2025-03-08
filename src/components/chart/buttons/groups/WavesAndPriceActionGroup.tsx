
import { Waves, CandlestickChart } from "lucide-react";
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
    <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onWavesClick}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <CandlestickChart className="w-4 h-4" />
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
