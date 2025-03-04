
import { Brain, ChartLine, TrendingUp, Building2, Turtle, Activity, Waves, CandlestickChart, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatternButton } from "./PatternButton";
import { TechnicalButtons } from "./TechnicalButtons";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AnalysisButtonGroupProps {
  isAnalyzing: boolean;
  onSubmit: (
    e: React.MouseEvent,
    isScalping?: boolean,
    isAI?: boolean,
    isSMC?: boolean,
    isICT?: boolean,
    isTurtleSoup?: boolean,
    isGann?: boolean,
    isWaves?: boolean,
    isPatternAnalysis?: boolean,
    isPriceAction?: boolean,
    isNeuralNetwork?: boolean
  ) => void;
  onHistoryClick: () => void;
  currentAnalysis?: string;
}

export const AnalysisButtonGroup = ({
  isAnalyzing,
  onSubmit,
  onHistoryClick,
  currentAnalysis
}: AnalysisButtonGroupProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <PatternButton 
          isAnalyzing={isAnalyzing}
          onClick={(e) => onSubmit(e, false, false, false, false, false, false, false, true)}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                disabled={isAnalyzing}
                onClick={(e) => onSubmit(e, true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-md text-white h-12 sm:h-10 text-sm px-3 sm:px-4 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Activity className="w-4 h-4" />
                <span className="whitespace-nowrap">Scalping</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>استراتيجية تداول سريعة تهدف لاستغلال التحركات السعرية الصغيرة لتحقيق أرباح متكررة</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <TechnicalButtons
          isAnalyzing={isAnalyzing}
          onSMCClick={(e) => onSubmit(e, false, false, true)}
          onICTClick={(e) => onSubmit(e, false, false, false, true)}
          onTurtleSoupClick={(e) => onSubmit(e, false, false, false, false, true)}
          onGannClick={(e) => onSubmit(e, false, false, false, false, false, true)}
        />
        
        <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={(e) => onSubmit(e, false, false, false, false, false, false, true)}
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Waves className="w-4 h-4" />
                  <span className="whitespace-nowrap">تحليل Waves</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>تحليل حركة السوق وفق نظرية موجات إليوت لتحديد الاتجاهات وتوقع التحركات السعرية</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CandlestickChart className="w-4 h-4" />
                  <span className="whitespace-nowrap">تحليل Price Action</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>تحليل حركة السعر الخام دون مؤشرات إضافية بالاعتماد على أنماط الشموع وهياكل السوق</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* زر تحليل الشبكات العصبية */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, true)}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Network className="w-6 h-6" />
              <span className="whitespace-nowrap text-base font-medium">تحليل الشبكات العصبية</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>تحليل متقدم باستخدام الشبكات العصبية للتنبؤ بحركة الأسعار المستقبلية</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {currentAnalysis && (
        <Badge variant="secondary" className="text-sm bg-opacity-80 backdrop-blur-sm bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-sm py-1.5">
          نوع التحليل: {currentAnalysis}
        </Badge>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={isAnalyzing}
              onClick={(e) => onSubmit(e, false, true)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Brain className="w-6 h-6" />
              <span className="whitespace-nowrap text-base font-medium">تحليل ذكي</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p>تحليل متقدم يستخدم الذكاء الاصطناعي لدمج مجموعة من أساليب التحليل الفني لتقديم رؤية شاملة</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
