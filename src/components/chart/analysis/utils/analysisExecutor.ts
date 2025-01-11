import { AnalysisData, SearchHistoryItem } from "@/types/analysis";
import { saveAnalysisToHistory } from "../utils/analysisHistoryUtils";
import { mapToAnalysisType } from "./analysisTypeMapping";
import { mapAnalysisTypeToConfig } from "./analysisTypeMapping";
import { toast } from "sonner";

interface ExecuteAnalysisParams {
  symbol: string;
  timeframe: string;
  currentPrice: number;
  analysisType: string;
  handleTradingViewConfig: Function;
  userId: string;
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
}

export const executeAnalysis = async ({
  symbol,
  timeframe,
  currentPrice,
  analysisType,
  handleTradingViewConfig,
  userId,
  onAnalysisComplete
}: ExecuteAnalysisParams) => {
  try {
    console.log(`Starting analysis for ${timeframe} - ${analysisType}`);
    
    const config = mapAnalysisTypeToConfig(analysisType);
    console.log("Analysis configuration:", config);
    
    const result = await handleTradingViewConfig(
      symbol,
      timeframe,
      currentPrice,
      config.isScalping,
      false, // isAI
      config.isSMC,
      config.isICT,
      config.isTurtleSoup,
      config.isGann,
      config.isWaves,
      config.isPatternAnalysis,
      config.isPriceAction
    );

    if (result && result.analysisResult) {
      console.log("Analysis completed successfully:", result);
      
      const mappedAnalysisType = mapToAnalysisType(analysisType);

      const savedData = await saveAnalysisToHistory(
        result,
        symbol,
        timeframe,
        mappedAnalysisType,
        userId
      );

      console.log("Analysis saved to history:", savedData);

      if (onAnalysisComplete) {
        const newHistoryEntry: SearchHistoryItem = {
          id: savedData.id,
          date: new Date(),
          symbol: symbol,
          currentPrice: currentPrice,
          analysis: result.analysisResult,
          analysisType: mappedAnalysisType,
          timeframe: timeframe
        };
        
        console.log("Adding new analysis to history:", newHistoryEntry);
        onAnalysisComplete(newHistoryEntry);
      }

      toast.success(`تم إكمال تحليل ${mappedAnalysisType} على الإطار الزمني ${timeframe}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error in ${analysisType} analysis on ${timeframe}:`, error);
    toast.error(`فشل في تحليل ${analysisType} على ${timeframe}`);
    return false;
  }
};