
import { supabase } from "@/lib/supabase";

// تعريف نوع بيانات التنبيه
interface AlertInput {
  symbol: string;
  price: number;
  type: 'entry' | 'exit' | 'stop_loss' | 'target';
  direction: 'above' | 'below';
  timeframe: string;
  analysis_id?: string;
}

// إنشاء تنبيه جديد
export const createAlert = async (alertData: AlertInput) => {
  const user = await supabase.auth.getUser();
  
  if (!user.data.user) {
    throw new Error("يجب تسجيل الدخول لإنشاء تنبيهات");
  }
  
  const { data, error } = await supabase
    .from('price_alerts')
    .insert({
      ...alertData,
      user_id: user.data.user.id,
      is_triggered: false
    })
    .select();
    
  if (error) throw error;
  return data[0];
};

// جلب التنبيهات النشطة للمستخدم الحالي
export const getActiveAlerts = async () => {
  const user = await supabase.auth.getUser();
  
  if (!user.data.user) {
    throw new Error("يجب تسجيل الدخول لعرض التنبيهات");
  }
  
  const { data, error } = await supabase
    .from('price_alerts')
    .select('*')
    .eq('user_id', user.data.user.id)
    .eq('is_triggered', false)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
};

// حذف تنبيه
export const deleteAlert = async (alertId: string) => {
  const { error } = await supabase
    .from('price_alerts')
    .delete()
    .eq('id', alertId);
    
  if (error) throw error;
  return true;
};

// تحديث حالة التنبيه
export const updateAlertStatus = async (alertId: string, isTriggered: boolean) => {
  const { error } = await supabase
    .from('price_alerts')
    .update({ is_triggered: isTriggered })
    .eq('id', alertId);
    
  if (error) throw error;
  return true;
};

// التحقق من التنبيهات (يتم استدعاؤها بواسطة خدمة فحص الأسعار)
export const checkAlertsForPrice = async (symbol: string, currentPrice: number) => {
  const { data: alerts, error } = await supabase
    .from('price_alerts')
    .select('*')
    .eq('symbol', symbol)
    .eq('is_triggered', false);
    
  if (error) throw error;
  
  const triggeredAlerts = [];
  
  for (const alert of alerts) {
    let isTriggered = false;
    
    // التحقق من شروط التنبيه
    if (alert.direction === 'above' && currentPrice >= alert.price) {
      isTriggered = true;
    } else if (alert.direction === 'below' && currentPrice <= alert.price) {
      isTriggered = true;
    }
    
    // إذا تم تفعيل التنبيه، تحديث حالته وإضافته للقائمة
    if (isTriggered) {
      await updateAlertStatus(alert.id, true);
      triggeredAlerts.push(alert);
      
      // إنشاء إشعار للمستخدم
      await supabase
        .from('notifications')
        .insert({
          user_id: alert.user_id,
          title: `تنبيه سعري: ${symbol}`,
          message: `تم الوصول إلى السعر المستهدف ${alert.price} (${alert.type === 'entry' ? 'نقطة دخول' : 
                     alert.type === 'exit' ? 'نقطة خروج' : 
                     alert.type === 'stop_loss' ? 'وقف خسارة' : 'هدف سعري'})`,
          type: 'price_alert',
          read: false
        });
    }
  }
  
  return triggeredAlerts;
};
