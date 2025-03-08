
import { Button } from "@/components/ui/button";
import { Network, Cpu, Clock, Layers, BarChart3, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AdvancedAnalysisGroupProps {
  isAnalyzing: boolean;
  onNeuralNetworkClick: (e: React.MouseEvent) => void;
  onRNNClick: (e: React.MouseEvent) => void;
  onTimeClusteringClick: (e: React.MouseEvent) => void;
  onMultiVarianceClick: (e: React.MouseEvent) => void;
  onCompositeCandlestickClick: (e: React.MouseEvent) => void;
  onBehavioralClick: (e: React.MouseEvent) => void;
}

export const AdvancedAnalysisGroup = ({
  isAnalyzing,
  onNeuralNetworkClick,
  onRNNClick,
  onTimeClusteringClick,
  onMultiVarianceClick,
  onCompositeCandlestickClick,
  onBehavioralClick
}: AdvancedAnalysisGroupProps) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onNeuralNetworkClick}
              className="w-full bg-red-500 hover:bg-red-600 text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out"
            >
              <Network className="w-4 h-4" />
              <span className="whitespace-nowrap">Neural Networks</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Using artificial neural networks to analyze data and predict price movement</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onRNNClick}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out"
            >
              <Cpu className="w-4 h-4" />
              <span className="whitespace-nowrap">Recurrent Neural Networks</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Advanced neural networks used to predict time series and recurring patterns</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onTimeClusteringClick}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out"
            >
              <Clock className="w-4 h-4" />
              <span className="whitespace-nowrap">Time Clustering</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Analysis based on repetition of time patterns and price clusters in specific time periods</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onMultiVarianceClick}
              className="w-full bg-lime-500 hover:bg-lime-600 text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out"
            >
              <Layers className="w-4 h-4" />
              <span className="whitespace-nowrap">Multi Variance</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Analysis studying the relationship between multiple variables to predict price movement</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onCompositeCandlestickClick}
              className="w-full bg-violet-500 hover:bg-violet-600 text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="whitespace-nowrap">Composite Candlestick</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Analysis strategy that combines multiple candle patterns to infer more accurate entry and exit signals</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onBehavioralClick}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out"
            >
              <User className="w-4 h-4" />
              <span className="whitespace-nowrap">Behavioral Analysis</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>Analysis of trader behavior and psychology to predict market movements</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
