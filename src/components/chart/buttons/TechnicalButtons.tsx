
import { Button } from "@/components/ui/button";
import { TrendingUp, Building2, Turtle, Activity } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <div className="grid grid-cols-2 gap-2">
      {/* SMC and ICT buttons */}
      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onSMCClick}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="whitespace-nowrap">SMC Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Market structure analysis to identify key levels and price patterns</p>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>

      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onICTClick}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Building2 className="w-4 h-4" />
              <span className="whitespace-nowrap">ICT Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Advanced trading approach focused on understanding the behavior of banks and large institutions in the market</p>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>

      {/* Turtle Soup and Gann buttons */}
      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onTurtleSoupClick}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Turtle className="w-4 h-4" />
              <span className="whitespace-nowrap">Turtle Soup Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Trading strategy targeting price reversals when support and resistance are broken</p>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>

      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onGannClick}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Activity className="w-4 h-4" />
              <span className="whitespace-nowrap">Gann Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Technical analysis theory connecting price, time, and geometry to predict future market movements</p>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    </div>
  );
};
