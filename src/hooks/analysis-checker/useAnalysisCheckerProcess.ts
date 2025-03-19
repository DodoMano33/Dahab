
import { useState, useRef, useCallback, useEffect } from 'react';
import { fetchAnalysesWithCurrentPrice } from './analysisFetchService';
import { CheckAnalysesOptions } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAnalysisCheckerProcess = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastErrorTime, setLastErrorTime] = useState<Date | null>(null);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const retryCountRef = useRef(0);
  const requestTimeoutRef = useRef<number | null>(null);
  const maxRetries = 3; // زيادة عدد المحاولات إلى 3
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
        lastErrorTime: new Date(),
        isOnline: navigator.onLine
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
      console.log('محاولة إعادة الاتصال بالمصادقة...');
      
      // التحقق من حالة المصادقة الحالية
      const { data: currentSession } = await supabase.auth.getSession();
      
      if (!currentSession.session) {
        console.log('لا توجد جلسة نشطة، يجب تسجيل الدخول مجددًا');
        toast.error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجددًا');
        return false;
      }
      
      // محاولة تحديث الجلسة
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('فشل في تحديث جلسة المصادقة:', error);
        return false;
      }
      
      if (data.session) {
        console.log('تم تحديث جلسة المصادقة بنجاح، التفاصيل:', {
          userId: data.session.user.id,
          expiresAt: new Date(data.session.expires_at! * 1000).toISOString()
        });
        return true;
      }
      
      return false;
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
        timeMs: Date.now(),
        networkStatus: navigator.onLine ? 'متصل' : 'غير متصل',
        userAgent: navigator.userAgent
      });
      
      // فحص المصادقة أولاً
      const { data: authSession } = await supabase.auth.getSession();
      if (!authSession.session) {
        toast.error('يجب تسجيل الدخول لاستخدام هذه الميزة');
        throw new Error('غير مسجل الدخول');
      }
      
      // إنشاء AbortController جديد للتمكن من إلغاء الطلب إذا استغرق وقتًا طويلًا
      controllerRef.current = new AbortController();
      
      try {
        const data = await fetchAnalysesWithCurrentPrice(price, symbol, controllerRef.current);
        
        console.log('نتيجة فحص التحليلات:', data);
        
        // إعادة تعيين عدادات الأخطاء بعد النجاح
        setConsecutiveErrors(0);
        retryCountRef.current = 0;
        setLastErrorTime(null);
        
        dispatchAnalysisEvents(data);
        
        if (isManualCheck) {
          toast.success('تم فحص التحليلات بنجاح');
        }
      } catch (fetchError) {
        console.error('تفاصيل خطأ الاتصال:', {
          message: fetchError instanceof Error ? fetchError.message : String(fetchError),
          type: fetchError instanceof Error ? fetchError.name : typeof fetchError,
          stack: fetchError instanceof Error ? fetchError.stack : 'بدون سجل التتبع',
          isAbortError: fetchError instanceof DOMException && fetchError.name === 'AbortError',
          isAuthError: fetchError instanceof Error && 
            (fetchError.message.includes('auth') || 
             fetchError.message.includes('jwt') || 
             fetchError.message.includes('token') ||
             fetchError.message.includes('session'))
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
          } else {
            // إظهار رسالة الخطأ للمستخدم
            if (isManualCheck) {
              toast.error('حدث خطأ في المصادقة. يرجى تسجيل الخروج وإعادة الدخول.');
            }
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
        
        // إذا كان فحصًا يدويًا، أظهر رسالة للمستخدم
        if (isManualCheck) {
          toast.error(`فشل فحص التحليلات: ${fetchError instanceof Error ? fetchError.message : 'خطأ غير معروف'}`);
        }
      }
    } catch (error) {
      console.error('فشل في فحص التحليلات النشطة:', error);
      
      setLastErrorTime(new Date());
      setConsecutiveErrors(prev => prev + 1);
      
      dispatchErrorEvent(error);
      
      // إظهار رسالة للمستخدم في حالة الفحص اليدوي
      if (isManualCheck) {
        toast.error(`فشل فحص التحليلات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      }
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
