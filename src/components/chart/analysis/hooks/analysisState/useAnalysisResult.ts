
import { toast } from "sonner";
import { AnalysisData, AnalysisType, SearchHistoryItem } from "@/types/analysis";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";
import { saveAnalysisToDatabase } from "@/components/chart/analysis/utils/processors/databaseHandler";
import { dispatchAnalysisSuccessEvent } from "@/hooks/analysis-checker/events/analysisEvents";
// import { useAuth } from "@/contexts/AuthContext";

// Define the AnalysisResult interface
export interface AnalysisResult {
  analysisResult: AnalysisData | null;
  duration?: string | number;
  symbol?: string;
  currentPrice?: number;
}

/**
 * هوك لمعالجة نتيجة التحليل
 */
export function useAnalysisResult() {
  const user = null; // التطبيق يعمل بدون مصادقة
  
  const handleAnalysisResult = async (
    result: AnalysisResult,
    symbol: string,
    currentPrice: number | null
  ) => {
    try {
      if (!result || !result.analysisResult) {
        toast.error("لم يتم الحصول على نتائج التحليل", { duration: 1000 });
        return false;
      }

      console.log("Handling analysis result:", result);

      // استخدام القيم من النتيجة أو القيم الافتراضية
      const symbolName = result.symbol || symbol;
      const price = result.currentPrice || currentPrice || 0;
      const analysis = result.analysisResult;

      // تحويل البيانات من string إلى number عند الحاجة
      const durationHours: number = 
        typeof result.duration === 'string' 
          ? parseInt(result.duration) 
          : (result.duration as number || 8);

      console.log("Saving analysis with duration:", durationHours);

      // مسح التخزين المؤقت قبل الاتصال بقاعدة البيانات
      await clearSupabaseCache();
      await clearSearchHistoryCache();

      // حفظ التحليل في قاعدة البيانات
      const savedData = await saveAnalysisToDatabase(
        {
          analysisResult: analysis,
          duration: durationHours.toString()
        }, 
        symbolName, 
        analysis.timeframe || '', 
        analysis.analysisType, 
        user?.id || ''
      );

      // إرسال إشعار لتحديث سجل البحث
      if (savedData && savedData.success) {
        dispatchAnalysisSuccessEvent({
          timestamp: new Date().toISOString(),
          checked: 1,
          symbol: symbolName
        });
        
        // إطلاق حدث تحديث السجل
        window.dispatchEvent(new CustomEvent('refreshSearchHistory'));
      }

      // عرض رسالة النجاح
      toast.success(`تم التحليل بنجاح. المدة: ${durationHours} ساعة.`, { duration: 1000 });
      return true;
    } catch (error: any) {
      console.error("Error handling analysis result:", error);
      toast.error(error.message || "حدث خطأ أثناء حفظ نتائج التحليل", { duration: 1000 });
      return false;
    }
  };

  return { handleAnalysisResult };
}
