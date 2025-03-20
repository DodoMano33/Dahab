
import { supabase } from "@/lib/supabase";

/**
 * Utility to clear Supabase's schema cache to reflect latest database changes
 */
export const clearSupabaseCache = async () => {
  try {
    // Special query that forces a schema cache refresh
    await supabase.rpc('clear_schema_cache');
    console.log("Supabase schema cache cleared successfully");
    return true;
  } catch (error) {
    console.error("Failed to clear schema cache:", error);
    // Even if this fails, we'll still continue with the application
    return false;
  }
};
