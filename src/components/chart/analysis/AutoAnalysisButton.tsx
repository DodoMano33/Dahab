import { Button } from "@/components/ui/button";
import { Play, Square, History } from "lucide-react";
import { useState } from "react";
import { BackTestResultsDialog } from "../backtest/BackTestResultsDialog";

interface AutoAnalysisButtonProps {
  isAnalyzing: boolean;
  onClick: () => void;
  onBackTestClick?: () => void;
  disabled?: boolean;
  setIsHistoryOpen: (open: boolean) => void;
}

export const AutoAnalysisButton = ({ 
  isAnalyzing, 
  onClick, 
  disabled,
  setIsHistoryOpen
}: AutoAnalysisButtonProps) => {
  const [isBackTestOpen, setIsBackTestOpen] = useState(false);
  const [isEntryPointBackTestOpen, setIsEntryPointBackTestOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <Button 
        onClick={onClick}
        disabled={disabled}
        className={`${
          isAnalyzing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        } text-white px-8 py-2 text-lg flex items-center gap-2 h-17 max-w-[600px] w-full`}
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

      <div className="grid grid-cols-1 gap-4 mt-4">
        <Button
          onClick={() => setIsBackTestOpen(true)}
          className="bg-[#800000] hover:bg-[#600000] text-white h-20 flex items-center gap-2 max-w-[600px] w-full"
        >
          <History className="w-5 h-20" />
          Back Test Results
        </Button>

        <Button
          onClick={() => setIsEntryPointBackTestOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white h-20 flex items-center gap-2 max-w-[600px] w-full"
        >
          <History className="w-5 h-20" />
          Back Test Results (أفضل نقطة دخول)
        </Button>

        <Button
          variant="outline"
          className="h-20 flex items-center gap-2 max-w-[600px] w-full"
          onClick={() => setIsHistoryOpen(true)}
        >
          <History className="w-5 h-20" />
          سجل البحث
        </Button>
      </div>

      <BackTestResultsDialog 
        isOpen={isBackTestOpen}
        onClose={() => setIsBackTestOpen(false)}
      />

      <BackTestResultsDialog 
        isOpen={isEntryPointBackTestOpen}
        onClose={() => setIsEntryPointBackTestOpen(false)}
        useEntryPoint={true}
      />
    </div>
  );
};