import { Button } from "@/components/ui/button";
import { Play, Square, History, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutoAnalysisButtonProps {
  isAnalyzing: boolean;
  onClick: () => void;
  onHistoryClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const AutoAnalysisButton = ({ 
  isAnalyzing, 
  onClick,
  onHistoryClick,
  className,
  disabled 
}: AutoAnalysisButtonProps) => {
  return (
    <div className="space-y-4">
      <Button 
        onClick={onClick}
        disabled={disabled}
        className={cn(
          `${
            isAnalyzing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          } text-white px-8 py-2 text-lg flex items-center gap-2`,
          className
        )}
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
    </div>
  );
};