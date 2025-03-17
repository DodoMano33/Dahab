
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { parseISO, isValid } from "date-fns";

interface LastCheckedCellProps {
  price?: number;
  timestamp?: Date | string | null;
  itemId: string;
}

export const LastCheckedCell = ({ timestamp, itemId }: LastCheckedCellProps) => {
  const [formattedTime, setFormattedTime] = useState<string>("");
  
  useEffect(() => {
    if (!timestamp) {
      setFormattedTime("");
      return;
    }
    
    const updateFormattedTime = () => {
      try {
        // سجلات تشخيصية أكثر تفصيلًا للتاريخ
        console.log(`[${itemId}] Formatting timestamp:`, {
          value: timestamp,
          type: typeof timestamp,
          isString: typeof timestamp === 'string',
          isDate: timestamp instanceof Date
        });
        
        let dateObj: Date;
        if (typeof timestamp === 'string') {
          // التعامل مع تنسيقات التاريخ المختلفة
          if (timestamp.includes('T')) {
            dateObj = parseISO(timestamp);
          } else {
            dateObj = new Date(timestamp);
          }
        } else if (timestamp instanceof Date) {
          dateObj = timestamp;
        } else {
          console.error(`[${itemId}] Invalid timestamp type:`, typeof timestamp);
          setFormattedTime("");
          return;
        }
        
        // التحقق من صحة التاريخ بعد التحويل
        if (!isValid(dateObj)) {
          console.error(`[${itemId}] Invalid date after conversion:`, {
            original: timestamp,
            converted: dateObj
          });
          setFormattedTime("");
          return;
        }
        
        // تنسيق التاريخ كمدة نسبية
        const formatted = formatDistanceToNow(dateObj, { 
          addSuffix: true,
          locale: ar
        });
        
        console.log(`[${itemId}] Formatted time:`, formatted);
        setFormattedTime(formatted);
      } catch (error) {
        console.error(`[${itemId}] Error formatting date:`, error);
        setFormattedTime("");
      }
    };
    
    updateFormattedTime();
    
    // تحديث التنسيق كل دقيقة
    const interval = setInterval(updateFormattedTime, 60 * 1000);
    return () => clearInterval(interval);
  }, [timestamp, itemId]);
  
  if (!formattedTime) {
    return <span className="text-muted-foreground text-[10px]">لم يتم الفحص</span>;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-xs cursor-help">
            <div className="text-muted-foreground text-[10px]">
              {formattedTime}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>وقت الفحص: {formattedTime}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
