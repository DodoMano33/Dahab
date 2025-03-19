
import { useState, useRef, useCallback } from 'react';
import { fetchAnalysesWithCurrentPrice } from './analysisFetchService';
import { CheckAnalysesOptions } from './types';

export const useAnalysisCheckerProcess = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastErrorTime, setLastErrorTime] = useState<Date | null>(null);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const retryCountRef = useRef(0);
  const requestTimeoutRef = useRef<number | null>(null);
  const maxRetries = 2; // تقليل عدد المحاولات لتجنب الضغط على الخادم
  const requestInProgressRef = useRef(false); // لمنع الطلبات المتزامنة

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
      clearTimeout(requestTimeoutRef.current);
      requestTimeoutRef.current = null;
    }
    requestInProgressRef.current = false;
  }, []);

  const checkAnalyses = useCallback(async ({ price, symbol, isManualCheck = false }: CheckAnalysesOptions) => {
    // منع الطلبات المتزامنة
    if (requestInProgressRef.current) {
      console.log('Request already in progress, skipping this request');
      return;
    }
    
    try {
      setIsChecking(true);
      requestInProgressRef.current = true;
      
      console.log(`Triggering ${isManualCheck ? 'manual' : 'auto'} check for active analyses with current price:`, price);
      
      // تنظيف أي محاولات سابقة معلقة
      if (requestTimeoutRef.current !== null) {
        clearTimeout(requestTimeoutRef.current);
        requestTimeoutRef.current = null;
      }
      
      // إنشاء AbortController للتمكن من إلغاء الطلب إذا استغرق وقتًا طويلًا
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('Request timed out, aborting');
      }, 20000); // تقليل وقت الانتظار إلى 20 ثانية

      try {
        const data = await fetchAnalysesWithCurrentPrice(price, symbol, controller);
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
          
          const retryDelay = isManualCheck ? 2000 : Math.pow(2, retryCountRef.current) * 2000; // تأخير أطول للمحاولات التلقائية
          
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
  }, [dispatchAnalysisEvents, dispatchErrorEvent]);

  return {
    isChecking,
    lastErrorTime,
    consecutiveErrors,
    retryCount: retryCountRef.current,
    checkAnalyses,
    clearPendingRequests
  };
};
