
import { Activity, Brain, BarChart2, Triangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface BasicButtonGroupProps {
  isAnalyzing: boolean;
  onPatternClick: (e: React.MouseEvent) => void;
  onScalpingClick: (e: React.MouseEvent) => void;
  onSmartAnalysisClick: (e: React.MouseEvent) => void;
  currentAnalysis?: string;
}

export const BasicButtonGroup = ({
  isAnalyzing,
  onPatternClick,
  onScalpingClick,
  onSmartAnalysisClick,
  currentAnalysis
}: BasicButtonGroupProps) => {
  return (
    <div className="space-y-2">
      {/* Smart Analysis Button - Now positioned at the top */}
      <div className="w-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                disabled={isAnalyzing}
                onClick={onSmartAnalysisClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out"
              >
                <Brain className="w-5 h-5" />
                <span className="whitespace-nowrap text-base font-medium">Smart Analysis</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>Advanced analysis using AI to combine multiple technical analysis methods for a comprehensive view</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Pattern and Scalping buttons moved below - side by side */}
      <div className="grid grid-cols-2 gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                disabled={isAnalyzing}
                onClick={onPatternClick}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out"
              >
                <Triangle className="w-4 h-4" />
                <span className="whitespace-nowrap">Patterns Analysis</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>Analysis of recurring technical patterns on the chart to predict future price movements</p>
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
                className="w-full bg-purple-500 hover:bg-purple-600 text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out"
              >
                <Activity className="w-4 h-4" />
                <span className="whitespace-nowrap">Scalping</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>Fast trading strategy aimed at exploiting small price movements to achieve frequent profits</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {currentAnalysis && (
        <Badge variant="secondary" className="text-sm bg-opacity-80 backdrop-blur-sm bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-sm py-1.5">
          Analysis Type: {currentAnalysis}
        </Badge>
      )}
    </div>
  );
};
