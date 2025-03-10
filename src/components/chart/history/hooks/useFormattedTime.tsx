
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface UseFormattedTimeOptions {
  itemId?: string;
  updateInterval?: number; // بالمللي ثانية
}

export const useFormattedTime = (
  timestamp?: Date | string | null,
  options: UseFormattedTimeOptions = {}
) => {
  const { itemId = 'unknown', updateInterval = 60 * 1000 } = options;
  const [formattedTime, setFormattedTime] = useState<string>("");
  
  useEffect(() => {
    if (!timestamp) {
      setFormattedTime("");
      return;
    }
    
    const updateFormattedTime = () => {
      try {
        console.log(`[${itemId}] Formatting timestamp:`, timestamp, typeof timestamp);
        
        let dateObj: Date;
        if (typeof timestamp === 'string') {
          dateObj = new Date(timestamp);
        } else if (timestamp instanceof Date) {
          dateObj = timestamp;
        } else {
          console.error(`[${itemId}] Invalid timestamp type:`, typeof timestamp);
          setFormattedTime("");
          return;
        }
        
        if (isNaN(dateObj.getTime())) {
          console.error(`[${itemId}] Invalid date after conversion:`, dateObj);
          setFormattedTime("");
          return;
        }
        
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
    
    // تحديث التنسيق على فترات منتظمة
    const interval = setInterval(updateFormattedTime, updateInterval);
    return () => clearInterval(interval);
  }, [timestamp, itemId, updateInterval]);
  
  return formattedTime;
};
