
import { useState, useCallback, useRef, useEffect } from "react";
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
  const timeoutRef = useRef<number | null>(null);
  const isRequestInProgressRef = useRef(false);

  // Use the event listeners
  useBackTestEvents(setLastCheckTime);

  // Use the fetch request module
  const { doFetchRequest } = useFetchRequest(setDiagnostics, abortControllerRef);

  // Reset loading state after timeout (safety mechanism)
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const triggerManualCheck = async () => {
    // منع الضغط المتكرر على الزر أثناء المعالجة
    if (isLoading || isRequestInProgressRef.current) {
      toast.info("جاري بالفعل فحص التحليلات، يرجى الانتظار");
      return;
    }
    
    try {
      console.log("Triggering manual check...");
      setIsLoading(true);
      isRequestInProgressRef.current = true;
      setRetryCount(0);
      
      // طلب سعر محدث
      window.dispatchEvent(new Event('request-current-price'));
      
      // إطلاق حدث الفحص اليدوي
      window.dispatchEvent(new Event('manual-check-analyses'));
      
      // تعيين مؤقت أمان لإعادة تعيين حالة التحميل بعد 15 ثانية في حالة حدوث خطأ
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = window.setTimeout(() => {
        console.log('Safety timeout triggered, resetting loading state');
        setIsLoading(false);
        isRequestInProgressRef.current = false;
        timeoutRef.current = null;
      }, 15000);
      
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
          
          // إرسال حدث الفشل
          window.dispatchEvent(new CustomEvent('analyses-check-failed', { 
            detail: { error: errorMessage }
          }));
        } else {
          console.log('Manual check was aborted');
          toast.error('تم إلغاء الطلب بسبب انتهاء المهلة');
        }
      }
    } finally {
      // تأكد من إعادة تعيين حالة التحميل
      console.log('Resetting loading state in finally block');
      setIsLoading(false);
      isRequestInProgressRef.current = false;
      
      // إلغاء مؤقت الأمان
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  };

  // وظيفة لإلغاء الطلب الحالي إذا كان هناك طلب جاري
  const cancelCurrentRequest = useCallback(() => {
    if (abortControllerRef.current) {
      console.log('Aborting current request');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsLoading(false);
    isRequestInProgressRef.current = false;
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
