
import { saveAnalysis } from "../utils/saveAnalysis";
import { mapToAnalysisType } from "../utils/analysisTypeMapper";
import { toast } from "sonner";
import { SearchHistoryItem, AnalysisType } from "@/types/analysis";

interface SaveAnalysisParams {
  userId: string;
  symbol: string;
  currentPrice: number;
  result: any;
  analysisType: string;
  timeframe: string;
  duration: number;
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
  isAutomatic?: boolean;
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
    onAnalysisComplete,
    isAutomatic = false
  }: SaveAnalysisParams) => {
    try {
      // طباعة نوع التحليل قبل المعالجة
      console.log("Original analysis type before mapping:", analysisType);
      
      // اختبار إذا كان نوع التحليل يتعلق بفيبوناتشي
      const isFibonacciAnalysis = String(analysisType).toLowerCase().includes("fibonacci") || 
                                  String(analysisType).toLowerCase().includes("فيبوناتشي");
      
      // Map the analysis type to a valid database enum value
      const mappedAnalysisType = isFibonacciAnalysis ? "فيبوناتشي" : mapToAnalysisType(analysisType);
      console.log("Mapped analysis type:", mappedAnalysisType);
      
      // تأكد من أن نوع التحليل موجود في النتيجة وصحيح
      if (!result.analysisResult.analysisType) {
        console.log("Setting analysisType as it was missing:", mappedAnalysisType);
        result.analysisResult.analysisType = mappedAnalysisType;
      } else if (isFibonacciAnalysis) {
        // تأكد من أن نوع التحليل لفيبوناتشي صحيح دائمًا
        console.log("Overriding Fibonacci analysis type from", result.analysisResult.analysisType, "to فيبوناتشي");
        result.analysisResult.analysisType = "فيبوناتشي";
      }
      
      // تعيين activation_type بشكل صريح
      if (isAutomatic) {
        console.log("Setting activation_type to تلقائي for automatic analysis");
        result.analysisResult.activation_type = "تلقائي";
      } else if (!result.analysisResult.activation_type) {
        console.log("Setting default activation_type to يدوي");
        result.analysisResult.activation_type = "يدوي";
      } else {
        console.log("Keeping existing activation_type:", result.analysisResult.activation_type);
      }
      
      // Update the analysis result's analysisType to the mapped value
      const analysisResultWithMappedType = {
        ...result.analysisResult,
        analysisType: mappedAnalysisType,
        activation_type: result.analysisResult.activation_type
      };
      
      console.log("Final analysis result with type:", analysisResultWithMappedType);
      
      // Add proper error handling for debugging
      try {
        console.log("Saving analysis with userId:", userId);
        console.log("Saving analysis with symbol:", symbol);
        console.log("Saving analysis with currentPrice:", currentPrice);
        console.log("Saving analysis with analysisType:", mappedAnalysisType);
        console.log("Saving analysis with timeframe:", timeframe);
        console.log("Saving analysis with duration:", duration);
        console.log("Saving analysis with activation_type:", analysisResultWithMappedType.activation_type);
        
        const savedData = await saveAnalysis({
          userId,
          symbol,
          currentPrice,
          analysisResult: analysisResultWithMappedType,
          analysisType: mappedAnalysisType as AnalysisType, // Cast to AnalysisType
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
            analysisType: mappedAnalysisType as AnalysisType, // Cast to AnalysisType
            timeframe,
            analysis_duration_hours: duration
          };
          
          console.log("Adding new analysis to history:", newHistoryEntry);
          onAnalysisComplete(newHistoryEntry);
        }
        
        // Show success toast with proper analysis type display and standard duration
        toast.success(`تم إكمال تحليل ${analysisType} بنجاح على الإطار الزمني ${timeframe} | ${symbol} السعر: ${currentPrice}`, {
          duration: 3000, // تغيير من 5000 إلى 3000 (3 ثواني)
        });
        
      } catch (dbError) {
        console.error("Database error saving analysis:", dbError);
        toast.error("حدث خطأ أثناء حفظ التحليل في قاعدة البيانات", {
          duration: 3000, // إضافة مدة 3 ثواني
        });
        throw dbError;
      }
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast.error("حدث خطأ أثناء حفظ التحليل", {
        duration: 3000, // إضافة مدة 3 ثواني
      });
      throw error;
    }
  };

  return { saveAnalysisResult };
};
