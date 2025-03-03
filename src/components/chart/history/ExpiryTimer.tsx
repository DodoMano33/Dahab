
import { useExpiryTimer } from "./hooks/useExpiryTimer";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ExpiryTimerProps {
  createdAt: Date;
  analysisId: string;
  durationHours?: number;
  symbol?: string;
}

export const ExpiryTimer = ({ createdAt, analysisId, durationHours = 8, symbol }: ExpiryTimerProps) => {
  const { timeLeft, isExpired, isMarketClosed } = useExpiryTimer({ 
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

  if (isMarketClosed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-sm text-amber-500">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{timeLeft}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>السوق مغلق - تم إيقاف العد التنازلي</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <Clock className="h-3.5 w-3.5" />
      <span>{timeLeft}</span>
    </div>
  );
};
