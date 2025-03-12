import { memo, useEffect, useState } from "react";
import { useBackTest } from "@/components/hooks/useBackTest";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export const BacktestCheckButton = memo(() => {
  const { triggerManualCheck, isLoading, lastCheckTime } = useBackTest();
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
        const timeUntilNextCheck = formatDistanceToNow(nextCheckTime, { 
          addSuffix: false, 
          locale: ar 
        });
        setNextAutoCheck(timeUntilNextCheck);
      } catch (error) {
        console.error("Error formatting last check time:", error, lastCheckTime);
      }
    };
    
    updateFormattedTime();
    
    // تحديث الوقت كل ثانية
    const interval = setInterval(updateFormattedTime, 1000);
    return () => clearInterval(interval);
  }, [lastCheckTime]);

  useEffect(() => {
    const handleHistoryUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.timestamp) {
        console.log("BacktestCheckButton detected history update with timestamp:", customEvent.detail.timestamp);
      } else {
        console.log("BacktestCheckButton detected history update event");
      }
    };
    
    window.addEventListener('historyUpdated', handleHistoryUpdate);
    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
    };
  }, []);

  return (
    <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">فحص التحليلات</h3>
        <p className="text-muted-foreground text-sm">فحص التحليلات الحالية ومقارنتها بالأسعار الحالية</p>
        {formattedTime && (
          <p className="text-xs text-muted-foreground mt-1">
            آخر فحص: {formattedTime}
          </p>
        )}
        {nextAutoCheck && (
          <p className="text-xs text-muted-foreground mt-1">
            الفحص التلقائي التالي بعد: {nextAutoCheck}
          </p>
        )}
      </div>
      <button
        onClick={triggerManualCheck}
        disabled={isLoading}
        className={`bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        {isLoading ? 'جاري الفحص...' : 'فحص الآن'}
      </button>
    </div>
  );
});

BacktestCheckButton.displayName = 'BacktestCheckButton';
