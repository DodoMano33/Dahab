
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
      <Badge variant="destructive" className="font-bold">
        منتهي
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <Clock className="h-3.5 w-3.5" />
      <span dir="ltr">{timeLeft}</span>
    </div>
  );
};
