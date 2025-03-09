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
      console.log("Original analysis type before mapping:", analysisType);
      
      const isFibonacciAnalysis = String(analysisType).toLowerCase().includes("fibonacci") || 
                                  String(analysisType).toLowerCase().includes("فيبوناتشي");
      
      const isFibonacciAdvanced = String(analysisType).toLowerCase().includes("advanced") || 
                                  String(analysisType).toLowerCase().includes("متقدم");
      
      const mappedAnalysisType = isFibonacciAnalysis 
        ? (isFibonacciAdvanced ? "فيبوناتشي متقدم" : "فيبوناتشي") 
        : mapToAnalysisType(analysisType);
        
      console.log("Mapped analysis type:", mappedAnalysisType);
      
      if (!result.analysisResult.analysisType) {
        console.log("Setting analysisType as it was missing:", mappedAnalysisType);
        result.analysisResult.analysisType = mappedAnalysisType;
      } else if (isFibonacciAnalysis) {
        const fibType = isFibonacciAdvanced ? "فيبوناتشي متقدم" : "فيبوناتشي";
        console.log("Overriding Fibonacci analysis type from", result.analysisResult.analysisType, "to", fibType);
        result.analysisResult.analysisType = fibType;
      } else {
        console.log("Ensuring analysis type is one of the 16 specified types");
        result.analysisResult.analysisType = mappedAnalysisType;
      }
      
      if (isAutomatic) {
        console.log("Setting activation_type to تلقائي for automatic analysis");
        result.analysisResult.activation_type = "تلقائي";
      } else if (!result.analysisResult.activation_type) {
        console.log("Setting default activation_type to يدوي");
        result.analysisResult.activation_type = "يدوي";
      } else {
        console.log("Keeping existing activation_type:", result.analysisResult.activation_type);
      }
      
      const analysisResultWithMappedType = {
        ...result.analysisResult,
        analysisType: mappedAnalysisType,
        activation_type: result.analysisResult.activation_type
      };
      
      console.log("Final analysis result with type:", analysisResultWithMappedType);
      
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
        
        toast.success(`تم إكمال تحليل ${analysisType} بنجاح على الإطار الزمني ${timeframe} | ${symbol} السعر: ${currentPrice}`, {
          duration: 3000,
        });
        
      } catch (dbError) {
        console.error("Database error saving analysis:", dbError);
        toast.error("حدث خطأ أثناء حفظ التحليل في قاعدة البيانات", {
          duration: 3000,
        });
        throw dbError;
      }
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast.error("حدث خطأ أثناء حفظ التحليل", {
        duration: 3000,
      });
      throw error;
    }
  };

  return { saveAnalysisResult };
};
