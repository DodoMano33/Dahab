
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
      // Log the original analysis type for debugging
      console.log("Original analysis type before mapping:", analysisType);
      
      // Map the analysis type to a valid database enum value
      const mappedAnalysisType = mapToAnalysisType(analysisType);
      console.log("Mapped analysis type:", mappedAnalysisType);
      
      // Check if the analysis result has an analysis type property
      if (!result.analysisResult.analysisType) {
        console.log("Setting analysis type in result:", mappedAnalysisType);
        result.analysisResult.analysisType = mappedAnalysisType;
      } else {
        // If it does, make sure it matches the mapped type
        console.log("Existing analysis type in result:", result.analysisResult.analysisType);
        if (result.analysisResult.analysisType !== mappedAnalysisType) {
          console.log("Updating analysis type in result to match mapped type");
          result.analysisResult.analysisType = mappedAnalysisType;
        }
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
