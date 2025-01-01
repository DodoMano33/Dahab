import { Button } from "@/components/ui/button";
import { Triangle } from "lucide-react";

interface PatternButtonProps {
  isAnalyzing: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const PatternButton = ({ isAnalyzing, onClick }: PatternButtonProps) => {
  return (
    <Button
      type="button"
      disabled={isAnalyzing}
      onClick={onClick}
      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
    >
      <Triangle className="w-4 h-4" />
      تحليل Patterns
    </Button>
  );
};