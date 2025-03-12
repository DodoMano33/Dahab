
import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { FetchDiagnostics, UseBackTestResult } from "./backtest/types";
import { useFetchRequest } from "./backtest/useFetchRequest";
import { useBackTestEvents } from "./backtest/useBackTestEvents";

export const useBackTest = (): UseBackTestResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [diagnostics, setDiagnostics] = useState<FetchDiagnostics[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Use the event listeners
  useBackTestEvents(setLastCheckTime);

  // Use the fetch request module
  const { doFetchRequest } = useFetchRequest(setDiagnostics, abortControllerRef);

  const triggerManualCheck = async () => {
    if (isLoading) {
      toast.info("جاري بالفعل فحص التحليلات، يرجى الانتظار");
      return;
    }
    
    try {
      console.log("Triggering manual check...");
      setIsLoading(true);
      setRetryCount(0);
      
      // طلب سعر محدث
      window.dispatchEvent(new Event('request-current-price'));
      
      // إطلاق حدث الفحص اليدوي
      window.dispatchEvent(new Event('manual-check-analyses'));
      
      try {
        const data = await doFetchRequest();
        
        console.log('Manual check completed:', data);
        
        if (data && (data.timestamp || data.currentTime)) {
          setLastCheckTime(new Date(data.timestamp || data.currentTime));
          
          const event = new CustomEvent('historyUpdated', {
            detail: { timestamp: data.timestamp || data.currentTime }
          });
          window.dispatchEvent(event);
          
          const checkedCount = data.checked || 0;
          if (checkedCount > 0) {
            toast.success(`تم فحص ${checkedCount} تحليل بنجاح`);
          } else {
            toast.info('لا توجد تحليلات نشطة للفحص');
          }
        } else {
          toast.info('تم الفحص ولكن لا توجد تحليلات نشطة');
        }
      } catch (error) {
        console.error('Error in manual check:', error);
        const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
        
        // تجنب عرض رسالة خطأ AbortError
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          toast.error(`حدث خطأ أثناء فحص التحليلات: ${errorMessage}`);
          
          // محاولة استخدام الحدث المحلي كخطة بديلة
          window.dispatchEvent(new CustomEvent('analyses-check-failed', { 
            detail: { error: errorMessage }
          }));
        } else {
          console.log('Manual check was aborted');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // وظيفة لإلغاء الطلب الحالي إذا كان هناك طلب جاري
  const cancelCurrentRequest = useCallback(() => {
    if (abortControllerRef.current) {
      console.log('Aborting current request');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  return {
    triggerManualCheck,
    cancelCurrentRequest,
    isLoading,
    lastCheckTime,
    retryCount,
    diagnostics
  };
};
