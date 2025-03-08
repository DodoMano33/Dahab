
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
      // Log original analysis type before mapping
      console.log("Original analysis type before mapping:", analysisType);
      
      // Check if analysis type is related to Fibonacci
      const isFibonacciAnalysis = String(analysisType).toLowerCase().includes("fibonacci") || 
                                  String(analysisType).toLowerCase().includes("fib");
      
      // Map the analysis type to a valid database enum value
      const mappedAnalysisType = isFibonacciAnalysis ? "Fibonacci" : mapToAnalysisType(analysisType);
      console.log("Mapped analysis type:", mappedAnalysisType);
      
      // Make sure the analysis type exists in the result and is correct
      if (!result.analysisResult.analysisType) {
        console.log("Setting analysisType as it was missing:", mappedAnalysisType);
        result.analysisResult.analysisType = mappedAnalysisType;
      } else if (isFibonacciAnalysis) {
        // Always override Fibonacci analysis type to ensure consistency
        console.log("Overriding Fibonacci analysis type from", result.analysisResult.analysisType, "to Fibonacci");
        result.analysisResult.analysisType = "Fibonacci";
      }
      
      // Update the analysis result's analysisType to the mapped value
      const analysisResultWithMappedType = {
        ...result.analysisResult,
        analysisType: mappedAnalysisType
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
        
        // Show success toast with proper analysis type display and standard duration
        toast.success(`${analysisType} analysis completed successfully for ${timeframe} | ${symbol} Price: ${currentPrice}`, {
          duration: 3000,
        });
        
      } catch (dbError) {
        console.error("Database error saving analysis:", dbError);
        toast.error("Error saving analysis to database", {
          duration: 3000,
        });
        throw dbError;
      }
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast.error("Error saving analysis", {
        duration: 3000,
      });
      throw error;
    }
  };

  return { saveAnalysisResult };
};
