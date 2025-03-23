
/**
 * وظائف مساعدة لمسح التخزين المؤقت لمخططات Supabase
 */

import { supabase } from "@/lib/supabase";

/**
 * مسح التخزين المؤقت لمخطط Supabase
 */
export const clearSupabaseCache = async (): Promise<void> => {
  try {
    // استدعاء وظيفة SQL لمسح مخبأ مخطط البيانات
    const { error } = await supabase.rpc('clear_supabase_schema_cache');
    
    if (error) {
      console.error("فشل في مسح مخبأ Supabase:", error);
    } else {
      console.log("تم مسح مخبأ Supabase بنجاح");
    }
  } catch (err) {
    console.error("خطأ أثناء مسح مخبأ Supabase:", err);
  }
};

/**
 * مسح التخزين المؤقت لسجل البحث
 */
export const clearSearchHistoryCache = async (): Promise<void> => {
  try {
    // استخدام استعلام بسيط لتحديث ذاكرة التخزين المؤقت
    await supabase.from('search_history').select('id').limit(1).maybeSingle();
    console.log("تم تحديث مخبأ سجل البحث");
  } catch (err) {
    console.error("خطأ أثناء مسح مخبأ سجل البحث:", err);
  }
};

/**
 * إعادة تهيئة اتصال Supabase
 */
export const resetSupabaseConnection = async (): Promise<void> => {
  try {
    // محاولة إعادة تهيئة الاتصال في حالة وجود مشاكل
    const { error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error("فشل في إعادة تهيئة الاتصال:", error);
    } else {
      console.log("تم إعادة تهيئة الاتصال بنجاح");
    }
  } catch (err) {
    console.error("خطأ أثناء إعادة تهيئة الاتصال:", err);
  }
};
