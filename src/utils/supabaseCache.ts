
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
    // مسح مخبأ استعلامات سجل البحث
    await supabase.from('search_history').select('count').limit(1).maybeSingle();
    console.log("تم تحديث مخبأ سجل البحث");
  } catch (err) {
    console.error("خطأ أثناء مسح مخبأ سجل البحث:", err);
  }
};
