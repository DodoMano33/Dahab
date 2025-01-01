import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatternButton } from "./PatternButton";
import { TechnicalButtons } from "./TechnicalButtons";

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
}

export const AnalysisButtonGroup = ({
  isAnalyzing,
  onSubmit,
  onHistoryClick
}: AnalysisButtonGroupProps) => {
  return (
    <div className="flex flex-wrap gap-2 pt-4">
      <PatternButton 
        isAnalyzing={isAnalyzing}
        onClick={(e) => onSubmit(e, false, false, false, false, false, false, false, true)}
      />

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={(e) => onSubmit(e, true)}
        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
      >
        تحليل سكالبينج
      </Button>

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={(e) => onSubmit(e, false, true)}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
      >
        <Brain className="w-4 h-4" />
        تحليل ذكي
      </Button>

      <TechnicalButtons
        isAnalyzing={isAnalyzing}
        onSMCClick={(e) => onSubmit(e, false, false, true)}
        onICTClick={(e) => onSubmit(e, false, false, false, true)}
        onTurtleSoupClick={(e) => onSubmit(e, false, false, false, false, true)}
        onGannClick={(e) => onSubmit(e, false, false, false, false, false, true)}
        onWavesClick={(e) => onSubmit(e, false, false, false, false, false, false, true)}
      />
      
      <Button
        type="button"
        variant="outline"
        onClick={onHistoryClick}
        className="border-blue-600 text-blue-600 hover:bg-blue-50"
      >
        سجل البحث
      </Button>
    </div>
  );
};