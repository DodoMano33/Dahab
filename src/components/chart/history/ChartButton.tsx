
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";

interface ChartButtonProps {
  onClick: () => void;
  className?: string;
}

export const ChartButton = ({ onClick, className = "" }: ChartButtonProps) => {
  return (
    <Button 
      variant="outline" 
      onClick={onClick} 
      className={`flex items-center justify-center gap-2 ${className}`}
    >
      <BarChart className="h-4 w-4" />
      <span>الرسم البياني للأهداف ووقف الخسارة</span>
    </Button>
  );
};
