import { toast } from "sonner";
import { saveAnalysisToHistory } from "../utils/analysisHistoryUtils";
import { mapAnalysisTypeToConfig, mapToAnalysisType } from "../utils/analysisTypeMapper";
import { SearchHistoryItem } from "@/types/analysis";

interface AnalysisPerformerProps {
  symbol: string;
  price: number;
  timeframe: string;
  analysisType: string;
  user: { id: string } | null;
  handleTradingViewConfig: any;
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
}

export const performAnalysis = async ({
  symbol,
  price,
  timeframe,
  analysisType,
  user,
  handleTradingViewConfig,
  onAnalysisComplete
}: AnalysisPerformerProps) => {
  try {
    console.log(`Starting analysis for ${timeframe} - ${analysisType}`);
    
    const config = mapAnalysisTypeToConfig(analysisType);
    console.log("Analysis configuration:", config);
    
    const result = await handleTradingViewConfig(
      symbol,
      timeframe,
      price,
      config.isScalping,
      false,
      config.isSMC,
      config.isICT,
      config.isTurtleSoup,
      config.isGann,
      config.isWaves,
      config.isPatternAnalysis,
      config.isPriceAction
    );

    if (result && result.analysisResult && user) {
      console.log("Analysis completed successfully:", result);
      
      const mappedAnalysisType = mapToAnalysisType(analysisType);

      const savedData = await saveAnalysisToHistory(
        result,
        symbol,
        timeframe,
        mappedAnalysisType,
        user.id
      );

      console.log("Analysis saved to history:", savedData);

      if (onAnalysisComplete) {
        const newHistoryEntry: SearchHistoryItem = {
          id: savedData.id,
          date: new Date(),
          symbol: symbol,
          currentPrice: price,
          analysis: result.analysisResult,
          analysisType: mappedAnalysisType,
          timeframe: timeframe
        };
        
        console.log("Adding new analysis to history:", newHistoryEntry);
        onAnalysisComplete(newHistoryEntry);
      }

      toast.success(`تم إكمال تحليل ${mappedAnalysisType} على الإطار الزمني ${timeframe}`);
    }
  } catch (error) {
    console.error(`Error in ${analysisType} analysis on ${timeframe}:`, error);
    toast.error(`فشل في تحليل ${analysisType} على ${timeframe}`);
  }
};