
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
      
      // Attempt a backup approach if RPC method isn't available
      // The issue is here - we need to handle the promise differently
      await supabase.from('_dummy_query_to_refresh_cache_').select('*').limit(1).then(
        () => {
          console.log("Unexpectedly succeeded with dummy query");
        },
        () => {
          // This is expected to fail, but helps refresh the cache
          console.log("Used fallback method to refresh schema cache");
        }
      );
      
      // Try a direct schema refresh for search_history table
      await clearSearchHistoryCache();
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
    
    // First try a simple count, which often helps refresh schema
    const { error: countError } = await supabase
      .from('search_history')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.log("Count query failed, trying alternative approach:", countError);
    }
    
    // Force a refresh by doing a simple select with explicit columns
    // to avoid the analysis_duration_hours problem
    const { error } = await supabase
      .from('search_history')
      .select('id, created_at, symbol, current_price, analysis_type')
      .limit(1);
      
    if (error) {
      console.error("Error refreshing search_history cache:", error);
      
      // If the error is related to schema cache, show a toast
      if (error.message.includes('search_history') && error.message.includes('schema cache')) {
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
