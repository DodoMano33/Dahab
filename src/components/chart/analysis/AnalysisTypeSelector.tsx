import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Building2, Turtle } from "lucide-react";

interface AnalysisTypeSelectorProps {
  onAnalysisTypeSelect: (
    isScalping: boolean,
    isAI: boolean,
    isSMC: boolean,
    isICT: boolean,
    isTurtleSoup: boolean
  ) => void;
  isAnalyzing: boolean;
}

export const AnalysisTypeSelector = ({
  onAnalysisTypeSelect,
  isAnalyzing
}: AnalysisTypeSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={() => onAnalysisTypeSelect(false, false, false, false, false)}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
      >
        تحليل عادي
      </Button>

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={() => onAnalysisTypeSelect(true, false, false, false, false)}
        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
      >
        تحليل سكالبينج
      </Button>

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={() => onAnalysisTypeSelect(false, false, true, false, false)}
        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
      >
        <TrendingUp className="w-4 h-4" />
        تحليل SMC
      </Button>

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={() => onAnalysisTypeSelect(false, false, false, true, false)}
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
      >
        <Building2 className="w-4 h-4" />
        تحليل ICT
      </Button>

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={() => onAnalysisTypeSelect(false, false, false, false, true)}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
      >
        <Turtle className="w-4 h-4" />
        تحليل Turtle Soup
      </Button>

      <Button
        type="button"
        disabled={isAnalyzing}
        onClick={() => onAnalysisTypeSelect(false, true, false, false, false)}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
      >
        <Brain className="w-4 h-4" />
        تحليل ذكي
      </Button>
    </div>
  );
};