
import { useState, useRef } from 'react';
import { fetchAnalysesWithCurrentPrice } from './analysisFetchService';
import { CheckAnalysesOptions } from './types';

export const useAnalysisCheckerProcess = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastErrorTime, setLastErrorTime] = useState<Date | null>(null);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const retryCountRef = useRef(0);
  const requestTimeoutRef = useRef<number | null>(null);
  const maxRetries = 3;

  const dispatchAnalysisEvents = (data: any) => {
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
  };

  const dispatchErrorEvent = (error: unknown) => {
    window.dispatchEvent(new CustomEvent('analyses-check-failed', { 
      detail: { 
        error: error instanceof Error ? error.message : String(error),
        consecutiveErrors: consecutiveErrors + 1,
        lastErrorTime: new Date()
      }
    }));
  };

  const checkAnalyses = async ({ price, symbol, isManualCheck = false }: CheckAnalysesOptions) => {
    if (isChecking) {
      console.log('Already checking analyses, skipping this request');
      return;
    }
    
    try {
      setIsChecking(true);
      console.log(`Triggering ${isManualCheck ? 'manual' : 'auto'} check for active analyses with current price:`, price);
      
      // تنظيف أي محاولات سابقة معلقة
      if (requestTimeoutRef.current !== null) {
        clearTimeout(requestTimeoutRef.current);
        requestTimeoutRef.current = null;
      }
      
      // إنشاء AbortController للتمكن من إلغاء الطلب إذا استغرق وقتًا طويلًا
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 ثانية كحد أقصى

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
        
        if (retryCountRef.current < maxRetries) {
          // زيادة عدد المحاولات وتأخير المحاولة التالية
          retryCountRef.current++;
          const retryDelay = Math.pow(2, retryCountRef.current) * 1000; // تأخير متزايد
          
          console.log(`Retry ${retryCountRef.current}/${maxRetries} will occur in ${retryDelay}ms`);
          
          requestTimeoutRef.current = window.setTimeout(() => {
            console.log(`Executing retry ${retryCountRef.current} for analyses check`);
            checkAnalyses({ price, symbol });
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
    }
  };

  const clearPendingRequests = () => {
    if (requestTimeoutRef.current !== null) {
      clearTimeout(requestTimeoutRef.current);
      requestTimeoutRef.current = null;
    }
  };

  return {
    isChecking,
    lastErrorTime,
    consecutiveErrors,
    retryCount: retryCountRef.current,
    checkAnalyses,
    clearPendingRequests
  };
};
