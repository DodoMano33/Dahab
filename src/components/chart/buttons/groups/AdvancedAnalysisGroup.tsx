
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onNeuralNetworkClick}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
              className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
              className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
