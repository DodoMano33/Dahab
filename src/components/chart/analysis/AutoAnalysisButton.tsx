import { Button } from "@/components/ui/button";
import { Play, Square, History } from "lucide-react";

interface AutoAnalysisButtonProps {
  isAnalyzing: boolean;
  onClick: () => void;
  onBackTestClick?: () => void;
  disabled?: boolean;
}

export const AutoAnalysisButton = ({ 
  isAnalyzing, 
  onClick, 
  onBackTestClick,
  disabled 
}: AutoAnalysisButtonProps) => {
  return (
    <div className="space-y-2">
      <Button 
        onClick={onClick}
        disabled={disabled}
        className={`${
          isAnalyzing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        } text-white px-8 py-2 text-lg w-full md:w-auto flex items-center gap-2`}
      >
        {isAnalyzing ? (
          <>
            <Square className="w-5 h-5" />
            إيقاف التفعيل
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            تفعيل
          </>
        )}
      </Button>

      <Button
        onClick={onBackTestClick}
        className="bg-[#800000] hover:bg-[#600000] text-white px-8 py-2 text-lg w-full md:w-auto flex items-center gap-2"
      >
        <History className="w-5 h-5" />
        Back Test Results
      </Button>
    </div>
  );
};