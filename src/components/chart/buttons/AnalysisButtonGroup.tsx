import { Brain, ChartLine, TrendingUp, Building2, Turtle, Activity, Waves, CandlestickChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatternButton } from "./PatternButton";
import { TechnicalButtons } from "./TechnicalButtons";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

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
    isPriceAction?: boolean
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

        <Button
          type="button"
          disabled={isAnalyzing}
          onClick={(e) => onSubmit(e, true)}
          className="bg-purple-600 hover:bg-purple-700 text-white h-12 sm:h-10 text-sm px-3 sm:px-4 flex items-center justify-center gap-2"
        >
          <Activity className="w-4 h-4" />
          <span className="whitespace-nowrap">Scalping</span>
        </Button>
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
          <Button
            type="button"
            disabled={isAnalyzing}
            onClick={(e) => onSubmit(e, false, false, false, false, false, false, true)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4"
          >
            <Waves className="w-4 h-4" />
            <span className="whitespace-nowrap">تحليل Waves</span>
          </Button>

          <Button
            type="button"
            disabled={isAnalyzing}
            onClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, true)}
            className="bg-blue-600 hover:bg-blue-700 text-white h-12 sm:h-10 flex items-center justify-center gap-2 text-sm px-3 sm:px-4"
          >
            <CandlestickChart className="w-4 h-4" />
            <span className="whitespace-nowrap">تحليل Price Action</span>
          </Button>
        </div>
      </div>

      {currentAnalysis && (
        <Badge variant="secondary" className="text-sm">
          نوع التحليل: {currentAnalysis}
        </Badge>
      )}

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={(e) => onSubmit(e, false, true)}
        className="w-full bg-green-600 hover:bg-green-700 text-white h-12 sm:h-10 flex items-center justify-center gap-2"
      >
        <Brain className="w-6 h-6" />
        <span className="whitespace-nowrap">تحليل ذكي</span>
      </Button>
    </div>
  );
};