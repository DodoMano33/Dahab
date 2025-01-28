import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { AnalysisCountBadge } from "./AnalysisCountBadge";

interface HistoryButtonProps {
  onClick: () => void;
  title: string | React.ReactNode;
  count: number;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  className?: string;
}

export const HistoryButton = ({ 
  onClick, 
  title, 
  count, 
  variant = "default",
  className = ""
}: HistoryButtonProps) => (
  <Button
    onClick={onClick}
    variant={variant}
    className={`h-20 flex items-center justify-between gap-2 max-w-[600px] w-full px-4 ${className}`}
  >
    <div className="flex items-center gap-2">
      <History className="w-5 h-20" />
      {title}
    </div>
    <AnalysisCountBadge count={count} />
  </Button>
);