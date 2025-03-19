
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const fetchAnalysesWithCurrentPrice = async (
  price: number | null,
  symbol: string,
  controller: AbortController
): Promise<any> => {
  try {
    const requestBody: Record<string, any> = { 
      symbol,
      requestedAt: new Date().toISOString()
    };
    
    if (price !== null) {
      requestBody.currentPrice = price;
    }

    const supabaseUrl = 'https://nhvkviofvefwbvditgxo.supabase.co';
    
    // الحصول على جلسة المستخدم
    const { data: authSession, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('خطأ في جلسة المستخدم:', authError);
      throw new Error('خطأ في جلسة المستخدم: ' + authError.message);
    }
    
    if (!authSession?.session?.access_token) {
      console.error('لا توجد جلسة متاحة للمستخدم');
      toast.error('يجب تسجيل الدخول أولاً');
      throw new Error('يرجى تسجيل الدخول لاستخدام هذه الميزة');
    }
    
    // إضافة timeout لمنع استمرار الطلب لفترة طويلة
    const timeout = setTimeout(() => {
      controller.abort();
    }, 12000); // زيادة زمن الانتظار إلى 12 ثانية
    
    try {
      console.log('إرسال طلب الفحص مع البيانات:', {
        symbol: requestBody.symbol,
        hasPrice: requestBody.currentPrice !== undefined,
        priceValue: requestBody.currentPrice,
        timestamp: requestBody.requestedAt
      });
      
      // التحقق من اتصال الإنترنت قبل إرسال الطلب
      if (!navigator.onLine) {
        clearTimeout(timeout);
        throw new Error('لا يوجد اتصال بالإنترنت');
      }
      
      // التحقق من صلاحية الـ token قبل إرسال الطلب
      if (authSession.session.expires_at) {
        const expiresAt = new Date(authSession.session.expires_at * 1000);
        const now = new Date();
        
        if (expiresAt <= now) {
          clearTimeout(timeout);
          console.error('انتهت صلاحية جلسة المستخدم', {
            expiresAt: expiresAt.toISOString(),
            now: now.toISOString()
          });
          
          // محاولة تحديث الجلسة
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            throw new Error('انتهت صلاحية الجلسة ولم يتم تحديثها بنجاح');
          }
          
          // الحصول على الجلسة الجديدة
          const { data: newSession } = await supabase.auth.getSession();
          if (!newSession?.session?.access_token) {
            throw new Error('فشل في تحديث جلسة المستخدم');
          }
        }
      }
      
      // إرسال الطلب باستخدام وظيفة invoke مباشرة من supabase
      const { data, error } = await supabase.functions.invoke(
        'auto-check-analyses',
        {
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      clearTimeout(timeout);
      
      if (error) {
        console.error('خطأ في طلب فحص التحليلات:', error);
        throw new Error(error.message || 'حدث خطأ أثناء فحص التحليلات');
      }
      
      console.log('تم استلام استجابة من auto-check-analyses:', data);
      return data;
    } catch (error) {
      clearTimeout(timeout);
      throw error;
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
      console.error('خطأ في fetchAnalysesWithCurrentPrice:', error.message, error.stack);
      throw error;
    }
    
    console.error('خطأ غير معروف في fetchAnalysesWithCurrentPrice:', error);
    throw new Error('حدث خطأ غير متوقع أثناء فحص التحليلات');
  }
};
