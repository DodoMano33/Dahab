
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface AutoCheckHandlerProps {
  autoCheckEnabled: boolean;
  autoCheckInterval: number;
}

export function AutoCheckHandler({ 
  autoCheckEnabled, 
  autoCheckInterval 
}: AutoCheckHandlerProps) {
  
  useEffect(() => {
    const setupAutoCheck = async () => {
      try {
        if (autoCheckEnabled) {
          // جدولة الفحص التلقائي
          console.log("Setting up auto-check with interval:", autoCheckInterval);
          
          // استدعاء وظيفة الفحص التلقائي كل فترة
          const checkFunction = async () => {
            try {
              const { data, error } = await supabase.functions.invoke('auto-check-analyses');
              
              if (error) {
                console.error("Error invoking auto-check function:", error);
              } else if (data) {
                console.log("Auto-check completed:", data);
                // إطلاق حدث تحديث التاريخ مع timestamp
                if (data.timestamp) {
                  const event = new CustomEvent('historyUpdated', {
                    detail: { timestamp: data.timestamp }
                  });
                  window.dispatchEvent(event);
                }
              }
            } catch (err) {
              console.error("Error during auto-check:", err);
            }
          };
          
          // تنفيذ فحص أولي
          checkFunction();
          
          // جدولة الفحص كل 5 دقائق
          const intervalId = setInterval(checkFunction, 5 * 60 * 1000);
          
          return () => {
            clearInterval(intervalId);
          };
        }
      } catch (error) {
        console.error("Error setting up auto-check:", error);
      }
    };
    
    setupAutoCheck();
  }, [autoCheckEnabled, autoCheckInterval]);

  // This is a "side effect" component - it doesn't render anything
  return null;
}
