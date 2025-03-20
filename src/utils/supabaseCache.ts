
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * Utility to clear Supabase's schema cache to reflect latest database changes
 */
export const clearSupabaseCache = async () => {
  try {
    console.log("Attempting to clear Supabase schema cache...");
    
    // Special query that forces a schema cache refresh
    const { error } = await supabase.rpc('clear_schema_cache');
    
    if (error) {
      console.error("Failed to clear schema cache:", error);
      return false;
    }
    
    console.log("Supabase schema cache cleared successfully");
    return true;
  } catch (error) {
    console.error("Failed to clear schema cache:", error);
    // Even if this fails, we'll still continue with the application
    return false;
  }
};

/**
 * Utility to specifically clear cache for search_history table
 */
export const clearSearchHistoryCache = async () => {
  try {
    console.log("Attempting to clear search_history schema cache...");
    
    // Force a refresh by doing a simple select with limit 0
    const { error } = await supabase
      .from('search_history')
      .select('id, analysis_duration_hours')
      .limit(0);
      
    if (error) {
      console.error("Error refreshing search_history cache:", error);
      
      // If the error is related to schema cache, show a toast
      if (error.message.includes('analysis_duration_hours') && error.message.includes('schema cache')) {
        toast.error("مشكلة في التخزين المؤقت لقاعدة البيانات. يرجى إعادة تحميل الصفحة.");
      }
      
      return false;
    }
    
    console.log("Search history schema cache refreshed successfully");
    return true;
  } catch (error) {
    console.error("Failed to refresh search_history schema:", error);
    return false;
  }
};
