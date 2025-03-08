
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
    <>
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
              <span className="whitespace-nowrap">تحليل SMC</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>تحليل هيكل السوق للتعرف على المستويات الرئيسية والأنماط السعرية</p>
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
              <span className="whitespace-nowrap">تحليل ICT</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>نهج تداول متقدم يركز على فهم سلوك البنوك والمؤسسات الكبرى في السوق</p>
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
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Turtle className="w-4 h-4" />
              <span className="whitespace-nowrap">تحليل Turtle Soup</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>استراتيجية تداول تستهدف الانعكاسات السعرية عند كسر الدعم والمقاومة</p>
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
              <span className="whitespace-nowrap">تحليل Gann</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>نظرية تحليل فنية تربط بين السعر والزمن والهندسة لتوقع حركات السوق المستقبلية</p>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    </>
  );
};
