
/**
 * وحدة التعامل مع قاعدة البيانات للتحليلات
 */

import { supabase } from "@/lib/supabase";
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { toast } from "sonner";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";

interface AnalysisResult {
  analysisResult: AnalysisData;
  duration?: string;
}

/**
 * حفظ التحليل في قاعدة البيانات
 * تم تحسين الوظيفة لاستخدام نوع التحليل لتنويع الأهداف ووقف الخسارة
 */
export const saveAnalysisToDatabase = async (
  result: AnalysisResult,
  symbol: string,
  timeframe: string,
  analysisType: AnalysisType,
  userId: string
): Promise<{ success: boolean; id?: string; error?: any }> => {
  try {
    console.log(`حفظ التحليل في قاعدة البيانات: ${symbol}, ${timeframe}, ${analysisType}`);
    
    // محاولة تنظيف التخزين المؤقت قبل الحفظ
    await clearSupabaseCache();
    await clearSearchHistoryCache();
    
    // التحقق من أن النتيجة تحتوي على تحليل
    if (!result || !result.analysisResult) {
      console.error("لا توجد نتائج تحليل للحفظ");
      return { success: false, error: new Error("لا توجد نتائج تحليل للحفظ") };
    }
    
    // التأكد من أن الأهداف في تنسيق مناسب
    const targets = Array.isArray(result.analysisResult.targets) ? 
      result.analysisResult.targets : [];
    
    // استخدام مدة التحليل المقدمة أو القيمة الافتراضية (8 ساعات)
    const duration = result.duration ? parseInt(result.duration.toString()) : 8;
    
    // بناء كائن البيانات للحفظ
    const analysisData = {
      user_id: userId || (await supabase.auth.getUser()).data.user?.id,
      symbol: symbol.toUpperCase(),
      current_price: result.analysisResult.currentPrice,
      analysis_type: analysisType,
      timeframe: timeframe,
      analysis: {
        ...result.analysisResult,
        analysisType: result.analysisResult.analysisType || analysisType,
        // تحديث سعر وقف الخسارة وتاريخه
        stopLoss: result.analysisResult.stopLoss,
        targets: targets
      },
      analysis_duration_hours: duration
    };
    
    console.log("بيانات التحليل للحفظ:", {
      ...analysisData,
      analysis: "كائن كبير تم اختصاره"
    });
    
    // إدراج البيانات في قاعدة البيانات
    const { data, error } = await supabase
      .from('search_history')
      .insert(analysisData)
      .select('id')
      .single();
    
    if (error) {
      console.error("خطأ في حفظ التحليل:", error);
      
      if (error.message.includes('violates foreign key constraint "search_history_user_id_fkey"')) {
        console.error("خطأ في معرف المستخدم، تحقق من تسجيل الدخول");
        toast.error("فشل في حفظ التحليل: خطأ في معرف المستخدم");
      } else {
        toast.error("فشل في حفظ التحليل في قاعدة البيانات");
      }
      
      return { success: false, error };
    }
    
    console.log("تم حفظ التحليل بنجاح:", data);
    return { success: true, id: data.id };
  } catch (error) {
    console.error("خطأ غير متوقع في حفظ التحليل:", error);
    toast.error("حدث خطأ غير متوقع أثناء حفظ التحليل");
    return { success: false, error };
  }
};
