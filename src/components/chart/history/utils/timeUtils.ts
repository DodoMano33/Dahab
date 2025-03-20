
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export const formatRelativeTime = (
  timestamp: Date | string | null | undefined, 
  itemId: string
): string => {
  if (!timestamp) return "";
  
  try {
    let dateObj: Date;
    if (typeof timestamp === 'string') {
      dateObj = new Date(timestamp);
    } else if (timestamp instanceof Date) {
      dateObj = timestamp;
    } else {
      console.error(`[${itemId}] Invalid timestamp type:`, typeof timestamp);
      return "";
    }
    
    if (isNaN(dateObj.getTime())) {
      console.error(`[${itemId}] Invalid date after conversion:`, dateObj);
      return "";
    }
    
    return formatDistanceToNow(dateObj, { 
      addSuffix: true,
      locale: ar
    });
  } catch (error) {
    console.error(`[${itemId}] Error formatting date:`, error);
    return "";
  }
};
