import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

interface AnalysisButtonProps {
  isAnalyzing: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const AnalysisButton = ({ isAnalyzing, onClick }: AnalysisButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isAnalyzing}
      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isAnalyzing ? "جاري التحليل..." : "تحليل عادي"}
    </Button>
  );
};