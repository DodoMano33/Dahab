
import { saveAnalysis } from "../utils/saveAnalysis";
import { mapToAnalysisType } from "../utils/mapAnalysisType";
import { toast } from "sonner";
import { SearchHistoryItem, AnalysisType } from "@/types/analysis";
import { isValidAnalysisType } from "../utils/mapAnalysisType";

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
      // Log the original analysis type for debugging
      console.log("Original analysis type before mapping:", analysisType);
      
      // Map the analysis type to a valid database enum value
      const mappedAnalysisType = mapToAnalysisType(analysisType);
      console.log("Mapped analysis type:", mappedAnalysisType);
      
      // Check if the mapped type is valid
      if (!isValidAnalysisType(mappedAnalysisType)) {
        console.error(`Mapped type "${mappedAnalysisType}" is still not valid`);
        throw new Error(`نوع التحليل "${analysisType}" غير صالح`);
      }
      
      // Check if the analysis result has an analysis type property
      if (!result.analysisResult.analysisType) {
        console.log("Setting analysis type in result:", mappedAnalysisType);
        result.analysisResult.analysisType = mappedAnalysisType;
      } else if (result.analysisResult.analysisType !== mappedAnalysisType) {
        // If it does, make sure it matches the mapped type
        console.log("Existing analysis type in result:", result.analysisResult.analysisType);
        console.log("Updating analysis type in result to match mapped type");
        result.analysisResult.analysisType = mappedAnalysisType;
      }
      
      console.log("Final analysis result with type:", result.analysisResult);
      
      try {
        const savedData = await saveAnalysis({
          userId,
          symbol,
          currentPrice,
          analysisResult: result.analysisResult,
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
            analysis: result.analysisResult,
            targetHit: false,
            stopLossHit: false,
            analysisType: mappedAnalysisType as AnalysisType,
            timeframe,
            analysis_duration_hours: duration
          };
          
          console.log("Adding new analysis to history:", newHistoryEntry);
          onAnalysisComplete(newHistoryEntry);
        }
        
        // Show success toast with the original analysis type for user-friendly display
        toast.success(`تم إكمال تحليل ${analysisType} بنجاح على الإطار الزمني ${timeframe} | ${symbol} السعر: ${currentPrice}`, {
          duration: 5000,
        });
        
      } catch (dbError: any) {
        console.error("Database error saving analysis:", dbError);
        const errorMessage = dbError.message || "حدث خطأ أثناء حفظ التحليل في قاعدة البيانات";
        toast.error(errorMessage);
        throw dbError;
      }
    } catch (error: any) {
      console.error("Error saving analysis:", error);
      const errorMessage = error.message || "حدث خطأ أثناء حفظ التحليل";
      toast.error(errorMessage);
      throw error;
    }
  };

  return { saveAnalysisResult };
};
