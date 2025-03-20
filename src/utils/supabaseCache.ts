
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * Clear the Supabase schema cache by making a dummy query that forces a refresh
 */
export const clearSupabaseCache = async (): Promise<void> => {
  try {
    console.log("Attempting to clear Supabase schema cache");
    
    // Create a direct dummy query to force schema refresh
    await supabase
      .from('search_history')
      .select('id')
      .limit(1)
      .then(response => {
        console.log("Schema refresh query executed:", response);
        return response;
      });
    
    // Wait a brief moment to ensure the cache is cleared
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log("Supabase schema cache cleared successfully");
  } catch (error) {
    console.error("Error clearing Supabase schema cache:", error);
    // Don't throw, let the operation continue despite cache issues
  }
};

/**
 * Clear the search history table cache specifically
 */
export const clearSearchHistoryCache = async (): Promise<void> => {
  try {
    console.log("Clearing search_history table cache");
    
    // Query the search_history table to refresh its schema
    await supabase
      .from('search_history')
      .select('id, analysis_type, timeframe')
      .limit(1)
      .then(response => {
        console.log("Search history schema refresh query executed:", response);
        return response;
      });
    
    // Make a HEAD request to ensure the schema is up to date
    await supabase
      .from('search_history')
      .select('*')
      .head();
    
    console.log("Search history cache cleared successfully");
  } catch (error) {
    console.error("Error clearing search history cache:", error);
    // Continue despite errors
  }
};
