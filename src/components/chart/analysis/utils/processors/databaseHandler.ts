
import { AnalysisData } from "@/types/analysis";
import { supabase } from "@/lib/supabase";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";

/**
 * Saves analysis results to the database
 */
export const saveAnalysisToDatabase = async (
  symbol: string,
  analysisType: string,
  currentPrice: number,
  analysisResult: AnalysisData,
  durationHours: number = 8
) => {
  try {
    console.log("جاري حفظ التحليل في قاعدة البيانات:", {
      symbol,
      analysisType,
      currentPrice,
      durationHours
    });

    // الحصول على المستخدم الحالي
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("يجب تسجيل الدخول لحفظ التحليلات");
    }
    
    // مسح التخزين المؤقت قبل العملية
    await clearSupabaseCache();
    await clearSearchHistoryCache();
    
    const { data, error } = await supabase.from('search_history').insert({
      user_id: session.user.id,
      symbol: symbol.toUpperCase(),
      current_price: currentPrice,
      analysis: analysisResult,
      analysis_type: analysisType,
      timeframe: analysisResult.timeframe || '1d',
      analysis_duration_hours: durationHours
    }).select();

    if (error) {
      console.error("خطأ أثناء حفظ التحليل في قاعدة البيانات:", error);
      throw error;
    }

    console.log("تم حفظ التحليل بنجاح:", data);
    return data;
  } catch (error) {
    console.error("حدث خطأ أثناء حفظ التحليل:", error);
    throw error;
  }
};
