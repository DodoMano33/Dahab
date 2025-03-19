
import { useState, useRef, useCallback, useEffect } from 'react';
import { fetchAnalysesWithCurrentPrice } from './analysisFetchService';
import { CheckAnalysesOptions } from './types';

export const useAnalysisCheckerProcess = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastErrorTime, setLastErrorTime] = useState<Date | null>(null);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const retryCountRef = useRef(0);
  const requestTimeoutRef = useRef<number | null>(null);
  const maxRetries = 2; // زيادة عدد المحاولات إلى 2
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

  const reconnectAuth = useCallback(async () => {
    try {
      const { data, error } = await fetch('/api/refresh-auth', {
        method: 'POST',
        credentials: 'include'
      }).then(res => res.json());
      
      return !error;
    } catch (e) {
      console.error('فشل في إعادة الاتصال بالمصادقة:', e);
      return false;
    }
  }, []);

  const checkAnalyses = useCallback(async ({ price, symbol, isManualCheck = false }: CheckAnalysesOptions) => {
    // منع الطلبات المتزامنة
    if (requestInProgressRef.current) {
      console.log('طلب قيد التنفيذ بالفعل، تخطي هذا الطلب');
      return;
    }
    
    // تنظيف أي محاولات سابقة معلقة
    clearPendingRequests();
    
    try {
      setIsChecking(true);
      requestInProgressRef.current = true;
      
      // إضافة تسجيل أكثر تفصيلاً للمساعدة في تشخيص المشكلات
      console.log(`بدء ${isManualCheck ? 'فحص يدوي' : 'فحص تلقائي'} للتحليلات النشطة بالسعر الحالي:`, {
        price,
        symbol,
        isManualCheck,
        timeISOString: new Date().toISOString(),
        timeMs: Date.now()
      });
      
      // إنشاء AbortController جديد للتمكن من إلغاء الطلب إذا استغرق وقتًا طويلًا
      controllerRef.current = new AbortController();
      
      // زيادة المهلة الزمنية للطلب
      const timeoutId = setTimeout(() => {
        if (controllerRef.current) {
          controllerRef.current.abort();
          console.log('انتهت مهلة الطلب، إلغاء');
        }
      }, 20000); // زيادة وقت الانتظار إلى 20 ثانية

      try {
        const data = await fetchAnalysesWithCurrentPrice(price, symbol, controllerRef.current);
        clearTimeout(timeoutId);
        
        console.log('نتيجة فحص التحليلات:', data);
        
        // إعادة تعيين عدادات الأخطاء بعد النجاح
        setConsecutiveErrors(0);
        retryCountRef.current = 0;
        setLastErrorTime(null);
        
        dispatchAnalysisEvents(data);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        // تسجيل خطأ الاتصال مع تفاصيل إضافية
        console.error('تفاصيل خطأ الاتصال:', {
          message: fetchError instanceof Error ? fetchError.message : String(fetchError),
          type: fetchError instanceof Error ? fetchError.name : typeof fetchError,
          stack: fetchError instanceof Error ? fetchError.stack : 'بدون سجل التتبع',
          isAbortError: fetchError instanceof DOMException && fetchError.name === 'AbortError',
          isAuthError: fetchError instanceof Error && fetchError.message.includes('auth')
        });
        
        setLastErrorTime(new Date());
        setConsecutiveErrors(prev => prev + 1);
        
        // محاولة إعادة الاتصال بالمصادقة إذا كانت المشكلة تتعلق بالمصادقة
        if (fetchError instanceof Error && 
            (fetchError.message.includes('auth') || 
             fetchError.message.includes('jwt') || 
             fetchError.message.includes('token') ||
             fetchError.message.includes('session'))) {
          console.log('محاولة إعادة الاتصال بالمصادقة...');
          const reconnected = await reconnectAuth();
          if (reconnected) {
            console.log('تم إعادة الاتصال بالمصادقة بنجاح، إعادة المحاولة');
            // إعادة المحاولة بعد إعادة الاتصال بالمصادقة
            requestInProgressRef.current = false;
            checkAnalyses({ price, symbol, isManualCheck });
            return;
          }
        }
        
        if (isManualCheck || retryCountRef.current < maxRetries) {
          // زيادة عدد المحاولات وتأخير المحاولة التالية
          if (!isManualCheck) {
            retryCountRef.current++;
          }
          
          const retryDelay = isManualCheck ? 2000 : 3000; // تأخير ثابت لتقليل الضغط على الشبكة
          
          console.log(`${isManualCheck ? 'إعادة محاولة يدوية' : `محاولة ${retryCountRef.current}/${maxRetries}`} ستحدث خلال ${retryDelay}مللي ثانية`);
          
          requestTimeoutRef.current = window.setTimeout(() => {
            console.log(`تنفيذ ${isManualCheck ? 'إعادة محاولة يدوية' : `محاولة ${retryCountRef.current}`} لفحص التحليلات`);
            requestInProgressRef.current = false; // إعادة تعيين العلم قبل المحاولة التالية
            checkAnalyses({ price, symbol, isManualCheck });
          }, retryDelay);
          
          return;
        }
        
        dispatchErrorEvent(fetchError);
      }
    } catch (error) {
      console.error('فشل في فحص التحليلات النشطة:', error);
      
      setLastErrorTime(new Date());
      setConsecutiveErrors(prev => prev + 1);
      
      dispatchErrorEvent(error);
    } finally {
      setIsChecking(false);
      requestInProgressRef.current = false;
    }
  }, [dispatchAnalysisEvents, dispatchErrorEvent, clearPendingRequests, reconnectAuth]);

  return {
    isChecking,
    lastErrorTime,
    consecutiveErrors,
    retryCount: retryCountRef.current,
    checkAnalyses,
    clearPendingRequests
  };
};
