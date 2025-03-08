
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
      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onSMCClick}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out"
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
              className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out"
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

      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onTurtleSoupClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out"
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
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out"
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
