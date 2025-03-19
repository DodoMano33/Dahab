
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
    
    // إضافة إشارة إلغاء من AbortController
    const timeout = setTimeout(() => {
      controller.abort();
    }, 20000); // زيادة وقت الانتظار إلى 20 ثانية
    
    try {
      // استخدام fetch مباشرة بدلاً من supabase.functions.invoke
      const url = 'https://nhvkviofvefwbvditgxo.supabase.co/functions/v1/auto-check-analyses';
      
      const authSession = await supabase.auth.getSession();
      const token = authSession.data?.session?.access_token;
      
      if (!token) {
        throw new Error('لم يتم العثور على جلسة المستخدم');
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odmt2aW9mdmVmd2J2ZGl0Z3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzQ4MTcsImV4cCI6MjA1MTIxMDgxN30.TFOufP4Cg5A0Hev_2GNUbRFSW4GRxWzC1RKBYwFxB3U',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        console.error(`خطأ في استجابة الخادم: ${response.status} ${response.statusText}`);
        throw new Error(`خطأ في استجابة الخادم: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
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
