
import { supabase, ensureValidSession } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const fetchAnalysesWithCurrentPrice = async (
  price: number | null,
  symbol: string,
  controller: AbortController
): Promise<any> => {
  try {
    // التحقق من اتصال الإنترنت أولاً
    if (!navigator.onLine) {
      throw new Error('لا يوجد اتصال بالإنترنت');
    }

    // إعداد بيانات الطلب
    const requestBody: Record<string, any> = { 
      symbol,
      requestedAt: new Date().toISOString()
    };
    
    if (price !== null) {
      requestBody.currentPrice = price;
    }

    // التحقق من صلاحية جلسة المصادقة
    const isSessionValid = await ensureValidSession();
    
    if (!isSessionValid) {
      toast.error('يجب تسجيل الدخول أولاً أو إعادة تسجيل الدخول');
      throw new Error('جلسة المصادقة غير صالحة');
    }
    
    console.log('إرسال طلب الفحص مع البيانات:', {
      symbol: requestBody.symbol,
      hasPrice: requestBody.currentPrice !== undefined,
      priceValue: requestBody.currentPrice,
      timestamp: requestBody.requestedAt
    });
    
    // إضافة مهلة لإلغاء الطلب بعد 30 ثانية
    const timeout = setTimeout(() => {
      controller.abort();
    }, 30000); // زيادة وقت الانتظار إلى 30 ثانية
    
    try {
      // استخدام فنكشن invoke مع تجنب استخدام signal
      const { data, error } = await supabase.functions.invoke('auto-check-analyses', {
        body: requestBody
        // Remove the signal property that's causing the error
      });
      
      clearTimeout(timeout);
      
      // Use standard fetch with AbortController to manually check for abort
      if (controller.signal.aborted) {
        throw new DOMException('The operation was aborted', 'AbortError');
      }
      
      if (error) {
        console.error(`خطأ في استجابة الخادم: ${error.message}`);
        throw new Error(`خطأ في استجابة الخادم: ${error.message}`);
      }
      
      console.log('تم استلام استجابة من auto-check-analyses:', data);
      return data;
    } catch (fetchError) {
      clearTimeout(timeout);
      
      // التحقق من نوع الخطأ
      if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
        throw new Error('انتهت مهلة الاتصال');
      }
      
      if (fetchError instanceof Error) {
        // إضافة معلومات تشخيصية للخطأ
        console.error('خطأ مفصل في استدعاء الوظيفة:', {
          message: fetchError.message,
          stack: fetchError.stack,
          type: fetchError.name,
          isNetworkError: fetchError.message.includes('Failed to fetch'),
          isAuthError: fetchError.message.includes('auth') || fetchError.message.includes('token'),
          isOnline: navigator.onLine
        });
        
        // تحسين رسائل الخطأ للمستخدم
        if (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('Failed to send a request')) {
          throw new Error('تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت الخاص بك');
        }
        
        throw fetchError;
      }
      
      throw new Error('حدث خطأ غير معروف أثناء الاتصال بالخادم');
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('تم إلغاء الطلب بسبب انتهاء المهلة');
      throw new Error('انتهت مهلة الاتصال');
    }
    
    // تحسين رسائل الخطأ
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('خطأ في الشبكة - فشل في الاتصال:', error);
      throw new Error('خطأ في الاتصال: تعذر الوصول للخادم');
    }
    
    if (error instanceof Error) {
      // إضافة معلومات تشخيصية محسنة للخطأ
      console.error('خطأ في fetchAnalysesWithCurrentPrice:', {
        message: error.message,
        stack: error.stack,
        time: new Date().toISOString(),
        networkStatus: navigator.onLine ? 'متصل' : 'غير متصل'
      });
      
      throw error;
    }
    
    console.error('خطأ غير معروف في fetchAnalysesWithCurrentPrice:', error);
    throw new Error('حدث خطأ غير متوقع أثناء فحص التحليلات');
  }
};
