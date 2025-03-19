
import { useState, useRef, useCallback, useEffect } from 'react';
import { fetchAnalysesWithCurrentPrice } from './analysisFetchService';
import { CheckAnalysesOptions } from './types';

export const useAnalysisCheckerProcess = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastErrorTime, setLastErrorTime] = useState<Date | null>(null);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const retryCountRef = useRef(0);
  const requestTimeoutRef = useRef<number | null>(null);
  const maxRetries = 1; // تقليل عدد المحاولات لتجنب الضغط على الخادم
  const requestInProgressRef = useRef(false); // لمنع الطلبات المتزامنة
  const controllerRef = useRef<AbortController | null>(null);

  // تنظيف الموارد عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      clearPendingRequests();
    };
  }, []);

  const dispatchAnalysisEvents = useCallback((data: any) => {
    // إرسال الأحداث بعد الفحص الناجح
    window.dispatchEvent(new CustomEvent('analyses-checked', { 
      detail: { 
        timestamp: data.timestamp || data.currentTime, 
        checkedCount: data.checked || 0, 
        symbol: data.symbol 
      }
    }));
    
    window.dispatchEvent(new CustomEvent('historyUpdated', { 
      detail: { timestamp: data.timestamp || data.currentTime }
    }));
  }, []);

  const dispatchErrorEvent = useCallback((error: unknown) => {
    window.dispatchEvent(new CustomEvent('analyses-check-failed', { 
      detail: { 
        error: error instanceof Error ? error.message : String(error),
        consecutiveErrors: consecutiveErrors + 1,
        lastErrorTime: new Date()
      }
    }));
  }, [consecutiveErrors]);

  const clearPendingRequests = useCallback(() => {
    if (requestTimeoutRef.current !== null) {
      window.clearTimeout(requestTimeoutRef.current);
      requestTimeoutRef.current = null;
    }
    
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    
    requestInProgressRef.current = false;
  }, []);

  const checkAnalyses = useCallback(async ({ price, symbol, isManualCheck = false }: CheckAnalysesOptions) => {
    // منع الطلبات المتزامنة
    if (requestInProgressRef.current) {
      console.log('Request already in progress, skipping this request');
      return;
    }
    
    // تنظيف أي محاولات سابقة معلقة
    clearPendingRequests();
    
    try {
      setIsChecking(true);
      requestInProgressRef.current = true;
      
      console.log(`Triggering ${isManualCheck ? 'manual' : 'auto'} check for active analyses with current price:`, price);
      
      // إنشاء AbortController جديد للتمكن من إلغاء الطلب إذا استغرق وقتًا طويلًا
      controllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => {
        if (controllerRef.current) {
          controllerRef.current.abort();
          console.log('Request timed out, aborting');
        }
      }, 15000); // تقليل وقت الانتظار إلى 15 ثانية

      try {
        const data = await fetchAnalysesWithCurrentPrice(price, symbol, controllerRef.current);
        clearTimeout(timeoutId);
        
        console.log('Analyses check result:', data);
        
        // إعادة تعيين عدادات الأخطاء بعد النجاح
        setConsecutiveErrors(0);
        retryCountRef.current = 0;
        setLastErrorTime(null);
        
        dispatchAnalysisEvents(data);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        // تسجيل خطأ الاتصال مع تفاصيل إضافية
        console.error('Fetch error details:', {
          message: fetchError instanceof Error ? fetchError.message : String(fetchError),
          type: fetchError instanceof Error ? fetchError.name : typeof fetchError,
          stack: fetchError instanceof Error ? fetchError.stack : 'No stack trace',
          isAbortError: fetchError instanceof DOMException && fetchError.name === 'AbortError'
        });
        
        setLastErrorTime(new Date());
        setConsecutiveErrors(prev => prev + 1);
        
        if (isManualCheck || retryCountRef.current < maxRetries) {
          // زيادة عدد المحاولات وتأخير المحاولة التالية إذا كانت تلقائية
          if (!isManualCheck) {
            retryCountRef.current++;
          }
          
          const retryDelay = isManualCheck ? 2000 : 5000; // تأخير ثابت لتقليل الضغط على الشبكة
          
          console.log(`${isManualCheck ? 'Manual retry' : `Retry ${retryCountRef.current}/${maxRetries}`} will occur in ${retryDelay}ms`);
          
          requestTimeoutRef.current = window.setTimeout(() => {
            console.log(`Executing ${isManualCheck ? 'manual retry' : `retry ${retryCountRef.current}`} for analyses check`);
            requestInProgressRef.current = false; // إعادة تعيين العلم قبل المحاولة التالية
            checkAnalyses({ price, symbol, isManualCheck });
          }, retryDelay);
          
          return;
        }
        
        dispatchErrorEvent(fetchError);
      }
    } catch (error) {
      console.error('Failed to check active analyses:', error);
      
      setLastErrorTime(new Date());
      setConsecutiveErrors(prev => prev + 1);
      
      dispatchErrorEvent(error);
    } finally {
      setIsChecking(false);
      requestInProgressRef.current = false;
    }
  }, [dispatchAnalysisEvents, dispatchErrorEvent, clearPendingRequests]);

  return {
    isChecking,
    lastErrorTime,
    consecutiveErrors,
    retryCount: retryCountRef.current,
    checkAnalyses,
    clearPendingRequests
  };
};
