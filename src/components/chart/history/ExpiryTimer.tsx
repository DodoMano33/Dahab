
import { useExpiryTimer } from "./hooks/useExpiryTimer";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface ExpiryTimerProps {
  createdAt: Date;
  analysisId: string;
  durationHours?: number;
}

export const ExpiryTimer = ({ createdAt, analysisId, durationHours = 36 }: ExpiryTimerProps) => {
  const { timeLeft, isExpired } = useExpiryTimer({ 
    createdAt, 
    analysisId,
    durationHours 
  });
  
  if (isExpired) {
    return (
      <Badge variant="destructive" className="font-bold animate-pulse">
        منتهي
      </Badge>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1.5 text-sm p-1 rounded-md bg-slate-50 dark:bg-slate-900/50 shadow-sm">
      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
      <span dir="ltr" className="font-medium">{timeLeft}</span>
    </div>
  );
};
