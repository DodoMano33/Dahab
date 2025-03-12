
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export const useTimeFormatting = (lastCheckTime: Date | null) => {
  const [formattedTime, setFormattedTime] = useState<string>("");
  const [nextAutoCheck, setNextAutoCheck] = useState<string>("");

  useEffect(() => {
    if (!lastCheckTime) return;
    
    const updateFormattedTime = () => {
      try {
        console.log("Formatting time from:", lastCheckTime);
        if (!(lastCheckTime instanceof Date) || isNaN(lastCheckTime.getTime())) {
          console.error("Invalid date object:", lastCheckTime);
          return;
        }
        
        const formatted = formatDistanceToNow(lastCheckTime, { 
          addSuffix: true, 
          locale: ar 
        });
        setFormattedTime(formatted);
        
        // تحديث الوقت المتبقي للفحص التلقائي التالي (10 ثوانٍ)
        const nextCheckTime = new Date(lastCheckTime.getTime() + 10 * 1000);
        const now = new Date();
        
        // التحقق مما إذا كان الوقت المتبقي سالبًا (تم تجاوزه)
        if (nextCheckTime > now) {
          const timeUntilNextCheck = formatDistanceToNow(nextCheckTime, { 
            addSuffix: false, 
            locale: ar 
          });
          setNextAutoCheck(timeUntilNextCheck);
        } else {
          setNextAutoCheck("جاري التنفيذ...");
        }
      } catch (error) {
        console.error("Error formatting last check time:", error, lastCheckTime);
      }
    };
    
    updateFormattedTime();
    
    // تحديث الوقت كل ثانية
    const interval = setInterval(updateFormattedTime, 1000);
    return () => clearInterval(interval);
  }, [lastCheckTime]);

  return { formattedTime, nextAutoCheck };
};
