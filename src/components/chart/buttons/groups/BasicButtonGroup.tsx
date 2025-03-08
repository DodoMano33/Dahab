
import { Activity, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatternButton } from "../PatternButton";
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
    <>
      {/* Smart Analysis Button - Top position with full width */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onSmartAnalysisClick}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
      
      {/* Pattern and Scalping buttons - side by side */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <PatternButton 
          isAnalyzing={isAnalyzing}
          onClick={onPatternClick}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                disabled={isAnalyzing}
                onClick={onScalpingClick}
                className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-md text-white h-12 sm:h-10 text-sm px-3 sm:px-4 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
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
    </>
  );
};
