
import { supabase } from "@/lib/supabase";
import { AnalysisData } from "@/types/analysis";
import { toast } from "sonner";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";

export const saveAnalysisToHistory = async (
  result: { 
    analysisResult: AnalysisData; 
    currentPrice?: number; 
    symbol?: string;
    duration?: number; // نوع لمدة التحليل في كائن النتيجة
  },
  symbol: string,
  timeframe: string,
  analysisType: AnalysisData['analysisType'],
  userId: string
) => {
  try {
    console.log("Saving analysis to history with user_id:", userId);
    console.log("Mapped analysis type:", analysisType);
    console.log("Timeframe:", timeframe);
    console.log("Duration (hours):", result.duration);

    // Clear caches before inserting
    await clearSupabaseCache();
    await clearSearchHistoryCache();

    const currentPrice = result.currentPrice || 
                        (result.analysisResult.currentPrice || 0);

    // Debug the exact payload being sent
    const payload = {
      user_id: userId,
      symbol: symbol.toUpperCase(),
      current_price: currentPrice,
      analysis: result.analysisResult,
      analysis_type: analysisType,
      timeframe: timeframe,
      analysis_duration_hours: result.duration || 8 // استخدام المدة من النتيجة أو 8 ساعات كقيمة افتراضية
    };
    
    console.log("Inserting data payload:", JSON.stringify(payload, null, 2));

    // First attempt
    try {
      const { data, error } = await supabase
        .from('search_history')
        .insert(payload)
        .select('*')
        .maybeSingle();

      if (error) {
        console.error("Error saving analysis to history (1st attempt):", error);
        throw error;
      }

      if (!data) {
        throw new Error("No data returned from insert operation");
      }

      console.log("Analysis saved successfully to history");
      toast.success("تم حفظ نتائج التحليل في السجل");
      return data;
    } catch (firstError) {
      console.error("First attempt failed:", firstError);
      
      // Wait a bit and try again after clearing cache
      await new Promise(resolve => setTimeout(resolve, 500));
      await clearSupabaseCache();
      await clearSearchHistoryCache();
      
      // Second attempt
      const { data, error } = await supabase
        .from('search_history')
        .insert(payload)
        .select('*')
        .maybeSingle();

      if (error) {
        console.error("Error saving analysis to history (2nd attempt):", error);
        toast.error("حدث خطأ أثناء حفظ التحليل في السجل");
        throw error;
      }

      if (!data) {
        throw new Error("No data returned from insert operation");
      }

      console.log("Analysis saved successfully to history (2nd attempt)");
      toast.success("تم حفظ نتائج التحليل في السجل");
      return data;
    }
  } catch (error) {
    console.error("Error saving analysis to history:", error);
    toast.error("حدث خطأ أثناء حفظ التحليل في السجل");
    throw error;
  }
};
