
import { Divide, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FibonacciButtonGroupProps {
  isAnalyzing: boolean;
  onFibonacciClick: (e: React.MouseEvent) => void;
  onFibonacciAdvancedClick: (e: React.MouseEvent) => void;
}

export const FibonacciButtonGroup = ({
  isAnalyzing,
  onFibonacciClick,
  onFibonacciAdvancedClick
}: FibonacciButtonGroupProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onFibonacciClick}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Divide className="w-4 h-4" />
              <span className="whitespace-nowrap">تحليل فيبوناتشي</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>استراتيجية تعتمد على مستويات فيبوناتشي ريتريسمينت وإكستينشين لتحديد نقاط الدخول والخروج</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={onFibonacciAdvancedClick}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Target className="w-4 h-4" />
              <span className="whitespace-nowrap">تحليل فيبوناتشي متقدم</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>استراتيجية تداول متقدمة تدمج فيبوناتشي مع السيولة المؤسساتية والفوليوم بروفايل وتحليل البنية السوقية</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
