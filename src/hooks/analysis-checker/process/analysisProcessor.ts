
import { useState, useRef, useCallback } from 'react';
import { fetchAnalysesWithCurrentPrice } from '../analysisFetchService';
import { CheckAnalysesOptions } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { dispatchAnalysisSuccessEvent, dispatchErrorEvent } from '../events/analysisEvents';
import { reconnectAuth } from '../auth/authHelper';
import { clearPendingRequests, isAuthError, isAbortError } from '../utils/requestUtils';
import { handleRetryLogic, handleFetchError } from './retryLogic';

export const useAnalysisProcessor = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastErrorTime, setLastErrorTime] = useState<Date | null>(null);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const retryCountRef = useRef(0);
  const requestTimeoutRef = useRef<number | null>(null);
  const maxRetries = 2; // تقليل عدد المحاولات
  const requestInProgressRef = useRef(false); // لمنع الطلبات المتزامنة
  const controllerRef = useRef<AbortController | null>(null);

  // تنظيف الموارد
  const clearRequests = useCallback(() => {
    clearPendingRequests(controllerRef, requestTimeoutRef, requestInProgressRef);
  }, []);

  const checkAnalyses = useCallback(async ({ price, symbol, isManualCheck = false }: CheckAnalysesOptions) => {
    // منع الطلبات المتزامنة
    if (requestInProgressRef.current) {
      console.log('طلب قيد التنفيذ بالفعل، تخطي هذا الطلب');
      return;
    }
    
    // تنظيف أي محاولات سابقة معلقة
    clearRequests();
    
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
        // إذا كان الاتصال محدود أو معدوم، لا نرسل الطلب
        if (!navigator.onLine) {
          throw new Error('لا يوجد اتصال بالإنترنت');
        }
        
        const data = await fetchAnalysesWithCurrentPrice(price, symbol, controllerRef.current);
        
        console.log('نتيجة فحص التحليلات:', data);
        
        // إعادة تعيين عدادات الأخطاء بعد النجاح
        setConsecutiveErrors(0);
        retryCountRef.current = 0;
        setLastErrorTime(null);
        
        dispatchAnalysisSuccessEvent(data);
        
        if (isManualCheck) {
          toast.success('تم فحص التحليلات بنجاح');
        }
        
        return data;
      } catch (fetchError) {
        handleFetchError(fetchError, isManualCheck, consecutiveErrors);
        
        setLastErrorTime(new Date());
        setConsecutiveErrors(prev => prev + 1);
        
        // محاولة إعادة الاتصال بالمصادقة إذا كانت المشكلة تتعلق بالمصادقة
        if (isAuthError(fetchError)) {
          console.log('محاولة إعادة الاتصال بالمصادقة...');
          const reconnected = await reconnectAuth();
          
          if (reconnected) {
            console.log('تم إعادة الاتصال بالمصادقة بنجاح، إعادة المحاولة');
            // إعادة المحاولة بعد إعادة الاتصال بالمصادقة
            requestInProgressRef.current = false;
            return checkAnalyses({ price, symbol, isManualCheck });
          } else {
            // إظهار رسالة الخطأ للمستخدم
            if (isManualCheck) {
              toast.error('حدث خطأ في المصادقة. يرجى تسجيل الخروج وإعادة الدخول.');
            }
          }
        }
        
        if (isManualCheck || retryCountRef.current < maxRetries) {
          // إجراء محاولة جديدة
          const shouldReturn = handleRetryLogic(
            isManualCheck,
            retryCountRef,
            maxRetries,
            requestTimeoutRef,
            requestInProgressRef,
            () => checkAnalyses({ price, symbol, isManualCheck })
          );
          
          if (shouldReturn) return;
        }
        
        dispatchErrorEvent(fetchError, consecutiveErrors);
        
        // إذا كان فحصًا يدويًا، أظهر رسالة للمستخدم
        if (isManualCheck) {
          toast.error(`فشل فحص التحليلات: ${fetchError instanceof Error ? fetchError.message : 'خطأ غير معروف'}`);
        }
        
        throw fetchError;
      }
    } catch (error) {
      console.error('فشل في فحص التحليلات النشطة:', error);
      
      setLastErrorTime(new Date());
      setConsecutiveErrors(prev => prev + 1);
      
      dispatchErrorEvent(error, consecutiveErrors);
      
      // إظهار رسالة للمستخدم في حالة الفحص اليدوي
      if (isManualCheck) {
        toast.error(`فشل فحص التحليلات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      }
      
      throw error;
    } finally {
      setIsChecking(false);
      requestInProgressRef.current = false;
    }
  }, [consecutiveErrors, clearRequests]);

  return {
    isChecking,
    lastErrorTime,
    consecutiveErrors,
    retryCount: retryCountRef.current,
    checkAnalyses,
    clearPendingRequests: clearRequests
  };
};
