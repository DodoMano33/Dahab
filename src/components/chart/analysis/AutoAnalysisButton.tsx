import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";

interface AutoAnalysisButtonProps {
  isAnalyzing: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const AutoAnalysisButton = ({ isAnalyzing, onClick, disabled }: AutoAnalysisButtonProps) => {
  return (
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
  );
};