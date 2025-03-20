
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
      // طباعة نوع التحليل قبل المعالجة
      console.log("Original analysis type before mapping:", analysisType);
      
      // تنظيف التخزين المؤقت قبل محاولة الحفظ
      await clearSearchHistoryCache();
      
      // Fix for Fibonacci Advanced analysis
      if (analysisType === "fibonacci_advanced" || 
          analysisType.includes("fibonacci advanced") ||
          analysisType.includes("فيبوناتشي متقدم")) {
        console.log("Detected Fibonacci Advanced analysis, ensuring proper mapping");
      }
      
      // Map the analysis type to a valid database enum value
      const mappedAnalysisType = mapToAnalysisType(analysisType);
      console.log("Mapped analysis type:", mappedAnalysisType);
      
      // تأكد من أن نوع التحليل موجود في النتيجة
      if (!result.analysisResult.analysisType) {
        result.analysisResult.analysisType = mappedAnalysisType;
      }
      
      // Update the analysis result's analysisType to the mapped value
      const analysisResultWithMappedType = {
        ...result.analysisResult,
        analysisType: mappedAnalysisType
      };
      
      console.log("Final analysis result with type:", analysisResultWithMappedType);
      
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
        
        // Show success toast with proper analysis type display
        toast.success(`تم إكمال تحليل ${analysisType} بنجاح على الإطار الزمني ${timeframe} | ${symbol} السعر: ${currentPrice}`, {
          duration: 5000,
        });
        
        return savedData;
        
      } catch (dbError: any) {
        console.error("Database error saving analysis:", dbError);
        
        // إذا كان الخطأ متعلقًا بمخطط البيانات، نحاول مسح التخزين المؤقت وإعادة المحاولة
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
        
        // Provide more helpful error message for constraint violations
        if (dbError.message && dbError.message.includes('search_history_analysis_type_check')) {
          toast.error(`نوع التحليل "${mappedAnalysisType}" غير مسموح به في قاعدة البيانات. يرجى التواصل مع المسؤول.`);
        } else {
          toast.error("حدث خطأ أثناء حفظ التحليل في قاعدة البيانات: " + (dbError.message || ''));
        }
        
        throw dbError;
      }
    } catch (error: any) {
      console.error("Error saving analysis:", error);
      toast.error("حدث خطأ أثناء حفظ التحليل: " + (error.message || ''));
      throw error;
    }
  };

  return { saveAnalysisResult };
};
