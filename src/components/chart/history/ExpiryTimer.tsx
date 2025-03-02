
import { useExpiryTimer } from "./hooks/useExpiryTimer";
import { Badge } from "@/components/ui/badge";
import { Clock, Pause } from "lucide-react";

interface ExpiryTimerProps {
  createdAt: Date;
  analysisId: string;
  durationHours?: number;
  symbol?: string;  // Added symbol prop to pass to useExpiryTimer
}

export const ExpiryTimer = ({ 
  createdAt, 
  analysisId, 
  durationHours = 8,
  symbol = "GOLD"
}: ExpiryTimerProps) => {
  const { timeLeft, isExpired, isPaused } = useExpiryTimer({ 
    createdAt, 
    analysisId,
    durationHours,
    symbol
  });
  
  if (isExpired) {
    return (
      <Badge variant="destructive" className="font-bold">
        منتهي
      </Badge>
    );
  }

  if (isPaused) {
    return (
      <div className="flex items-center gap-1 text-sm">
        <Pause className="h-3.5 w-3.5 text-amber-500" />
        <span className="text-amber-500">{timeLeft} (متوقف)</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <Clock className="h-3.5 w-3.5" />
      <span>{timeLeft}</span>
    </div>
  );
};
