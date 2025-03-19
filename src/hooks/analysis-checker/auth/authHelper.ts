
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Try to reconnect authentication by refreshing the session
 */
export const reconnectAuth = async (): Promise<boolean> => {
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
};
