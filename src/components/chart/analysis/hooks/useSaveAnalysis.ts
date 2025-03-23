
import { saveAnalysis } from "../utils/saveAnalysis";
import { mapToAnalysisType } from "../utils/analysisTypeMapper";
import { toast } from "sonner";
import { SearchHistoryItem, AnalysisType } from "@/types/analysis";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";

interface SaveAnalysisParams {
  userId: string;
  symbol: string;
  currentPrice: number;
  result: any;
  analysisType: string;
  timeframe: string;
  duration: number;
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
}

export const useSaveAnalysis = () => {
  const saveAnalysisResult = async ({
    userId,
    symbol,
    currentPrice,
    result,
    analysisType,
    timeframe,
    duration,
    onAnalysisComplete
  }: SaveAnalysisParams) => {
    try {
      // طباعة نوع التحليل قبل المعالجة للتشخيص
      console.log("Original analysis type before mapping:", analysisType);
      console.log("Analysis duration to be saved:", duration);
      
      // تنظيف التخزين المؤقت
      await clearSearchHistoryCache();
      
      // التعامل مع أنواع تحليل فيبوناتشي المتقدم بشكل خاص
      if (analysisType === "fibonacci_advanced" || 
          analysisType.includes("fibonacci advanced") ||
          analysisType.includes("فيبوناتشي متقدم")) {
        console.log("Detected Fibonacci Advanced analysis, ensuring proper mapping");
      }
      
      // تخطيط نوع التحليل إلى القيمة المقبولة في قاعدة البيانات (16 نوع فقط)
      const mappedAnalysisType = mapToAnalysisType(analysisType);
      console.log("Mapped analysis type:", mappedAnalysisType);
      
      // تأكد من أن نوع التحليل موجود في النتيجة
      if (!result.analysisResult.analysisType) {
        result.analysisResult.analysisType = mappedAnalysisType;
      }
      
      // تحديث نوع التحليل في النتيجة ليكون من ضمن الأنواع المدعومة
      const analysisResultWithMappedType = {
        ...result.analysisResult,
        analysisType: mappedAnalysisType
      };
      
      console.log("Final analysis result with normalized type:", analysisResultWithMappedType);
      
      try {
        const savedData = await saveAnalysis({
          userId,
          symbol,
          currentPrice,
          analysisResult: analysisResultWithMappedType,
          analysisType: mappedAnalysisType as AnalysisType,
          timeframe,
          durationHours: duration
        });

        if (savedData && onAnalysisComplete) {
          const newHistoryEntry: SearchHistoryItem = {
            id: savedData.id,
            date: new Date(),
            symbol,
            currentPrice,
            analysis: analysisResultWithMappedType,
            targetHit: false,
            stopLossHit: false,
            analysisType: mappedAnalysisType as AnalysisType,
            timeframe,
            analysis_duration_hours: duration
          };
          
          console.log("Adding new analysis to history:", newHistoryEntry);
          onAnalysisComplete(newHistoryEntry);
        }
        
        // عرض رسالة نجاح مع نوع التحليل المتوافق
        toast.success(`تم إكمال تحليل ${getStrategyName(mappedAnalysisType)} بنجاح على الإطار الزمني ${timeframe} | ${symbol} السعر: ${currentPrice}`, {
          duration: 1000,
        });
        
        return savedData;
        
      } catch (dbError: any) {
        console.error("Database error saving analysis:", dbError);
        
        // محاولة مسح التخزين المؤقت إذا كان هناك خطأ في المخطط
        if (dbError.message && dbError.message.includes('schema cache')) {
          console.log("Schema cache error detected, attempting to clear cache and retry");
          
          await clearSupabaseCache();
          await clearSearchHistoryCache();
          
          // محاولة ثانية بعد مسح التخزين المؤقت
          const retryData = await saveAnalysis({
            userId,
            symbol,
            currentPrice,
            analysisResult: analysisResultWithMappedType,
            analysisType: mappedAnalysisType as AnalysisType,
            timeframe,
            durationHours: duration
          });
          
          if (retryData && onAnalysisComplete) {
            const newHistoryEntry: SearchHistoryItem = {
              id: retryData.id,
              date: new Date(),
              symbol,
              currentPrice,
              analysis: analysisResultWithMappedType,
              targetHit: false,
              stopLossHit: false,
              analysisType: mappedAnalysisType as AnalysisType,
              timeframe,
              analysis_duration_hours: duration
            };
            
            console.log("Adding new analysis to history after retry:", newHistoryEntry);
            onAnalysisComplete(newHistoryEntry);
          }
          
          return retryData;
        }
        
        // تقديم رسالة خطأ مفيدة لانتهاكات القيود
        if (dbError.message && dbError.message.includes('search_history_analysis_type_check')) {
          toast.error(`نوع التحليل "${mappedAnalysisType}" غير مسموح به في قاعدة البيانات. يرجى التواصل مع المسؤول.`, { duration: 1000 });
        } else {
          toast.error("حدث خطأ أثناء حفظ التحليل في قاعدة البيانات: " + (dbError.message || ''), { duration: 1000 });
        }
        
        throw dbError;
      }
    } catch (error: any) {
      console.error("Error saving analysis:", error);
      toast.error("حدث خطأ أثناء حفظ التحليل: " + (error.message || ''), { duration: 1000 });
      throw error;
    }
  };

  return { saveAnalysisResult };
};

// إضافة دالة getStrategyName من المسار الصحيح
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
