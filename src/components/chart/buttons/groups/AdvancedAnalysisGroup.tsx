
import { AlignJustify, BarChart3, BoxSelect, Waypoints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AdvancedAnalysisGroupProps {
  isAnalyzing: boolean;
  onSMCClick: (e: React.MouseEvent) => void;
  onICTClick: (e: React.MouseEvent) => void;
  onTurtleSoupClick: (e: React.MouseEvent) => void;
  onGannClick: (e: React.MouseEvent) => void;
  onNeuralNetworkClick?: (e: React.MouseEvent) => void;
  onRNNClick?: (e: React.MouseEvent) => void;
  onTimeClusteringClick?: (e: React.MouseEvent) => void;
  onMultiVarianceClick?: (e: React.MouseEvent) => void;
  onCompositeCandlestickClick?: (e: React.MouseEvent) => void;
  onBehavioralClick?: (e: React.MouseEvent) => void;
}

export const AdvancedAnalysisGroup = ({
  isAnalyzing,
  onSMCClick,
  onICTClick,
  onTurtleSoupClick,
  onGannClick,
  onNeuralNetworkClick,
  onRNNClick,
  onTimeClusteringClick,
  onMultiVarianceClick,
  onCompositeCandlestickClick,
  onBehavioralClick
}: AdvancedAnalysisGroupProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onSMCClick}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <BoxSelect className="w-4 h-4" />
              <span className="whitespace-nowrap">SMC Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Smart Money Concept analysis that identifies institutional orders, liquidity pools, and market structure</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onICTClick}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <AlignJustify className="w-4 h-4" />
              <span className="whitespace-nowrap">ICT Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Inner Circle Trader methodology for identifying institutional manipulation and market inefficiencies</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onTurtleSoupClick}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Waypoints className="w-4 h-4" />
              <span className="whitespace-nowrap">Turtle Soup Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Contrarian strategy that fades breakouts, designed to capitalize on false breakouts</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onGannClick}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="whitespace-nowrap">Gann Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Strategy using W.D. Gann's methods combining geometric angles, time cycles, and price patterns</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
