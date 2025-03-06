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
      // Log the original analysis type before mapping
      console.log("Original analysis type before mapping:", analysisType);
      
      // Map the analysis type to a valid database enum value
      const mappedAnalysisType = mapToAnalysisType(analysisType);
      console.log("Mapped analysis type:", mappedAnalysisType);
      
      // Make sure the analysis result has the correct type property
      if (!result.analysisResult.analysisType) {
        result.analysisResult.analysisType = mappedAnalysisType;
      }
      
      // Ensure the original display type is preserved in the pattern field
      let originalPattern = result.analysisResult.pattern;
      
      // Update the analysis result with the mapped type for database compatibility
      const analysisResultWithMappedType = {
        ...result.analysisResult,
        analysisType: mappedAnalysisType, 
        // Keep the original pattern for display purposes
        pattern: originalPattern || (analysisType.includes("fibonacci_advanced") ? "تحليل فيبوناتشي متقدم" : 
                 analysisType.includes("fibonacci") ? "فيبوناتشي ريتريسمينت وإكستينشين" : 
                 result.analysisResult.pattern)
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
        
        // Use the original analysis type for display in the toast message
        const displayType = analysisType.includes("fibonacci_advanced") ? "تحليل فيبوناتشي متقدم" : 
                         analysisType.includes("fibonacci") ? "فيبوناتشي" : 
                         analysisType;
                         
        toast.success(`تم إكمال تحليل ${displayType} بنجاح على الإطار الزمني ${timeframe} | ${symbol} السعر: ${currentPrice}`, {
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
