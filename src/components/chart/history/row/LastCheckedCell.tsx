
import { TableCell } from "@/components/ui/table";
import { format, formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { useEffect, useState } from "react";

interface LastCheckedCellProps {
  id: string;
  last_checked_price?: number;
  last_checked_at?: Date | string | null;
}

export const LastCheckedCell = ({ id, last_checked_price, last_checked_at }: LastCheckedCellProps) => {
  const [formattedTime, setFormattedTime] = useState<string>("");
  
  // Format and update the last checked time
  useEffect(() => {
    const updateLastCheckedFormat = () => {
      if (!last_checked_at) {
        setFormattedTime("");
        return;
      }
      
      try {
        let dateToFormat: Date | null = null;
        
        // Convert date based on its type
        if (typeof last_checked_at === 'string') {
          dateToFormat = new Date(last_checked_at);
          console.log(`[${id}] Converted string date:`, dateToFormat);
        } else if (last_checked_at instanceof Date) {
          dateToFormat = last_checked_at;
          console.log(`[${id}] Using Date object directly:`, dateToFormat);
        } else {
          console.error(`[${id}] Unsupported date type:`, typeof last_checked_at);
          setFormattedTime("");
          return;
        }
        
        // Validate the date
        if (dateToFormat && !isNaN(dateToFormat.getTime())) {
          const formatted = formatDistanceToNow(dateToFormat, { 
            addSuffix: true,
            locale: ar
          });
          console.log(`[${id}] Formatted time:`, formatted);
          setFormattedTime(formatted);
        } else {
          console.error(`[${id}] Invalid date for formatting:`, last_checked_at);
          setFormattedTime("");
        }
      } catch (error) {
        console.error(`[${id}] Error formatting date:`, error);
        setFormattedTime("");
      }
    };
    
    updateLastCheckedFormat();
    
    // Update format every minute
    const interval = setInterval(updateLastCheckedFormat, 60 * 1000);
    return () => clearInterval(interval);
  }, [last_checked_at, id]);
  
  // Listen for history updates
  useEffect(() => {
    const handleHistoryUpdate = () => {
      console.log(`[${id}] History update detected for LastCheckedCell`);
    };
    
    window.addEventListener('historyUpdated', handleHistoryUpdate);
    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
    };
  }, [id]);

  return (
    <TableCell className="w-24 p-2">
      {last_checked_price && formattedTime ? (
        <div className="text-xs">
          <div>{last_checked_price}</div>
          <div className="text-muted-foreground text-[10px]">
            {formattedTime}
          </div>
        </div>
      ) : (
        <span className="text-muted-foreground text-[10px]">لم يتم الفحص</span>
      )}
    </TableCell>
  );
};
