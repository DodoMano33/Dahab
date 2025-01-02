import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatternButton } from "./PatternButton";
import { TechnicalButtons } from "./TechnicalButtons";
import { Badge } from "@/components/ui/badge";

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
    isPatternAnalysis?: boolean
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
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <PatternButton 
          isAnalyzing={isAnalyzing}
          onClick={(e) => onSubmit(e, false, false, false, false, false, false, false, true)}
        />

        <Button
          type="button"
          disabled={isAnalyzing}
          onClick={(e) => onSubmit(e, true)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Scalping
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <TechnicalButtons
          isAnalyzing={isAnalyzing}
          onSMCClick={(e) => onSubmit(e, false, false, true)}
          onICTClick={(e) => onSubmit(e, false, false, false, true)}
          onTurtleSoupClick={(e) => onSubmit(e, false, false, false, false, true)}
          onGannClick={(e) => onSubmit(e, false, false, false, false, false, true)}
          onWavesClick={(e) => onSubmit(e, false, false, false, false, false, false, true)}
        />
      </div>

      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={onHistoryClick}
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          سجل البحث
        </Button>

        {currentAnalysis && (
          <Badge variant="secondary" className="text-sm">
            نوع التحليل: {currentAnalysis}
          </Badge>
        )}
      </div>

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={(e) => onSubmit(e, false, true)}
        className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 py-6"
      >
        <Brain className="w-6 h-6" />
        تحليل ذكي
      </Button>
    </div>
  );
};