
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
      
      // Create a mapping for the special analysis types that need normalization
      const typeMapping: Record<string, string> = {
        "fibonacci": "فيبوناتشي",
        "fibonacci_advanced": "فيبوناتشي متقدم",
        "waves": "تحليل الموجات",
        "price_action": "حركة السعر",
        "ict": "تحليل ICT",
        "smc": "تحليل SMC",
        "patterns": "تحليل الأنماط",
        "normal": "تحليل الأنماط",
        "pattern": "تحليل الأنماط",
        "scalping": "سكالبينج",
        "gann": "تحليل جان",
        "turtle_soup": "Turtle Soup",
        "neural_network": "شبكات عصبية",
        "rnn": "شبكات RNN",
        "multi_variance": "تباين متعدد",
        "time_clustering": "تصفيق زمني",
        "composite_candlestick": "شمعات مركبة",
        "behavioral": "تحليل سلوكي"
      };
      
      // Check if a direct mapping exists
      let mappedAnalysisType = typeMapping[analysisType.toLowerCase()];
      
      // If no direct mapping, use the more flexible mapToAnalysisType function
      if (!mappedAnalysisType) {
        mappedAnalysisType = mapToAnalysisType(analysisType);
      }
        
      console.log("Mapped analysis type:", mappedAnalysisType);
      
      // If we have a result.analysisResult, ensure it has the correct analysisType
      if (result && result.analysisResult) {
        if (!result.analysisResult.analysisType) {
          console.log("Setting analysisType as it was missing:", mappedAnalysisType);
          result.analysisResult.analysisType = mappedAnalysisType;
        } else {
          // Check if the result's analysisType needs normalization
          const lowerCaseType = result.analysisResult.analysisType.toLowerCase();
          if (typeMapping[lowerCaseType]) {
            console.log("Normalizing analysis type from", result.analysisResult.analysisType, "to", typeMapping[lowerCaseType]);
            result.analysisResult.analysisType = typeMapping[lowerCaseType];
          }
        }
      }
      
      if (isAutomatic) {
        console.log("Setting activation_type to تلقائي for automatic analysis");
        if (result && result.analysisResult) {
          result.analysisResult.activation_type = "تلقائي";
        }
      } else if (result && result.analysisResult && !result.analysisResult.activation_type) {
        console.log("Setting default activation_type to يدوي");
        result.analysisResult.activation_type = "يدوي";
      } else if (result && result.analysisResult) {
        console.log("Keeping existing activation_type:", result.analysisResult.activation_type);
      }
      
      // Make sure we have a valid analysis type for the save operation
      const validAnalysisType = (mappedAnalysisType || "تحليل الأنماط") as AnalysisType;
      
      // Log all the details before saving
      console.log("Final analysis result with type:", result.analysisResult);
      console.log("Saving analysis with userId:", userId);
      console.log("Saving analysis with symbol:", symbol);
      console.log("Saving analysis with currentPrice:", currentPrice);
      console.log("Saving analysis with analysisType:", validAnalysisType);
      console.log("Saving analysis with timeframe:", timeframe);
      console.log("Saving analysis with duration:", duration);
      console.log("Saving analysis with activation_type:", result.analysisResult.activation_type);
        
      const savedData = await saveAnalysis({
        userId,
        symbol,
        currentPrice,
        analysisResult: result.analysisResult,
        analysisType: validAnalysisType,
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
          analysisType: validAnalysisType,
          timeframe,
          analysis_duration_hours: duration
        };
        
        console.log("Adding new analysis to history:", newHistoryEntry);
        onAnalysisComplete(newHistoryEntry);
      }
      
      toast.success(`تم إكمال تحليل ${mappedAnalysisType} بنجاح على الإطار الزمني ${timeframe} | ${symbol} السعر: ${currentPrice}`, {
        duration: 3000,
      });
      
      return savedData;
        
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
