
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatRelativeTime } from "../utils/timeUtils";

interface LastCheckedCellProps {
  price?: number;
  timestamp?: Date | string | null;
  itemId: string;
}

export const LastCheckedCell = ({ price, timestamp, itemId }: LastCheckedCellProps) => {
  const [formattedTime, setFormattedTime] = useState<string>("");
  
  useEffect(() => {
    if (!timestamp) {
      setFormattedTime("");
      return;
    }
    
    const updateFormattedTime = () => {
      const formatted = formatRelativeTime(timestamp, itemId);
      setFormattedTime(formatted);
    };
    
    updateFormattedTime();
    
    // Update formatting every minute
    const interval = setInterval(updateFormattedTime, 60 * 1000);
    return () => clearInterval(interval);
  }, [timestamp, itemId]);
  
  // Listen for history update events
  useEffect(() => {
    const handleHistoryUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.timestamp) {
        console.log(`[${itemId}] LastCheckedCell detected update event with timestamp:`, customEvent.detail.timestamp);
      } else {
        console.log(`[${itemId}] LastCheckedCell detected update event`);
      }
    };
    
    window.addEventListener('historyUpdated', handleHistoryUpdate);
    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
    };
  }, [itemId]);
  
  if (!price || !formattedTime) {
    return <span className="text-muted-foreground text-[10px]">لم يتم الفحص</span>;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-xs cursor-help">
            <div>{price}</div>
            <div className="text-muted-foreground text-[10px]">
              {formattedTime}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>آخر سعر تم فحصه: {price}</p>
          <p>وقت الفحص: {formattedTime}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
