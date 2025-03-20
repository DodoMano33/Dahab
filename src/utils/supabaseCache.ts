
import { supabase } from "@/lib/supabase";

// Clear the supabase schema cache
export const clearSupabaseCache = async (): Promise<void> => {
  try {
    // مسح ذاكرة التخزين المؤقت لمخطط البيانات عن طريق وظيفة قاعدة البيانات
    const { data, error } = await supabase.rpc('clear_supabase_schema_cache');
    
    if (error) {
      console.error("Error clearing Supabase schema cache:", error);
      // نحاول الحل البديل - استعلام بسيط على الجدول
      await supabase.from('search_history').select('id', { count: 'exact', head: true });
    } else {
      console.log("Supabase schema cache cleared successfully");
    }
  } catch (error) {
    console.error("Exception clearing Supabase schema cache:", error);
    // محاولة أخرى بطريقة مختلفة
    try {
      await supabase.from('search_history').select('id', { count: 'exact', head: true });
    } catch (e) {
      console.error("Second attempt to clear cache also failed:", e);
    }
  }
};

// Clear the search history cache specifically
export const clearSearchHistoryCache = async (): Promise<void> => {
  try {
    console.log("Clearing search_history table cache");
    
    // محاولة إجراء استعلام بسيط لإعادة تحميل مخطط الجدول
    const { error, data, count } = await supabase
      .from('search_history')
      .select('*', { count: 'exact', head: true })
      .limit(1);
    
    console.log("Search history count query executed:", { error, data, count });
    
    if (error) {
      console.error("Error in search_history refresh query:", error);
      
      // محاولة إعادة التحميل بطريقة مختلفة
      const refreshResult = await supabase
        .from('search_history')
        .select('id, created_at, symbol, current_price, analysis, analysis_type, timeframe', { head: true });
      
      console.log("Search history schema refresh query executed:", refreshResult);
    } else {
      console.log("Search history cache cleared successfully");
    }
  } catch (error) {
    console.error("Exception clearing search history cache:", error);
  }
};
