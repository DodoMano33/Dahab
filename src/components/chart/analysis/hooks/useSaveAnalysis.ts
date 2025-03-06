
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
        
        // Show success toast with proper analysis type display
        toast.success(`تم إكمال تحليل ${analysisType} بنجاح على الإطار الزمني ${timeframe} | ${symbol} السعر: ${currentPrice}`, {
          duration: 5000,
        });
        
      } catch (dbError) {
        console.error("Database error saving analysis:", dbError);
        toast.error("حدث خطأ أثناء حفظ التحليل في قاعدة البيانات");
        throw dbError;
      }
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast.error("حدث خطأ أثناء حفظ التحليل");
      throw error;
    }
  };

  return { saveAnalysisResult };
};
