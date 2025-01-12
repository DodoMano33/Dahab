import { Button } from "@/components/ui/button";
import { Play, Square, History, ClipboardList } from "lucide-react";
import { useState } from "react";
import { BackTestResultsDialog } from "../backtest/BackTestResultsDialog";
import { Card } from "@/components/ui/card";

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
  const [isBackTestOpen, setIsBackTestOpen] = useState(false);

  const handleHistoryClick = () => {
    if (onHistoryClick) {
      console.log("Opening search history");
      onHistoryClick();
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        onClick={onClick}
        disabled={disabled}
        className={`${
          isAnalyzing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        } text-white px-8 py-3 text-lg h-12 flex items-center gap-2`}
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

      <Card className="p-6 bg-white shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">النتائج</h2>
        <div className="flex justify-between items-center gap-4">
          <Button
            onClick={() => setIsBackTestOpen(true)}
            className="bg-[#F1F0FB] hover:bg-[#E1E0EB] text-gray-700 flex-1 h-10 flex items-center gap-2"
          >
            <History className="w-5 h-5" />
            Back Test Results
          </Button>

          <Button
            onClick={handleHistoryClick}
            className="bg-[#D3E4FD] hover:bg-[#B3D4FD] text-gray-700 flex-1 h-10 flex items-center gap-2"
          >
            <ClipboardList className="w-5 h-5" />
            سجل البحث
          </Button>
        </div>
      </Card>

      <BackTestResultsDialog 
        isOpen={isBackTestOpen}
        onClose={() => setIsBackTestOpen(false)}
      />
    </div>
  );
};