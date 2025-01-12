import { Button } from "@/components/ui/button";
import { Play, Square, ClipboardList } from "lucide-react";

interface AutoAnalysisButtonProps {
  isAnalyzing: boolean;
  onClick: () => void;
  onHistoryClick?: () => void;
  disabled?: boolean;
}

export const AutoAnalysisButton = ({ 
  isAnalyzing, 
  onClick,
  onHistoryClick,
  disabled 
}: AutoAnalysisButtonProps) => {
  return (
    <div className="space-y-4">
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
        onClick={onHistoryClick}
        className="bg-[#D3E4FD] hover:bg-[#B3D4FD] text-gray-700 w-full h-10 flex items-center gap-2 justify-center"
      >
        <ClipboardList className="w-5 h-5" />
        سجل البحث
      </Button>
    </div>
  );
};