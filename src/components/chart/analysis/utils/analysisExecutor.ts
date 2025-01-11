import { AnalysisData, SearchHistoryItem } from "@/types/analysis";
import { saveAnalysisToHistory } from "../utils/analysisHistoryUtils";
import { mapToAnalysisType } from "./analysisTypeMapping";
import { toast } from "sonner";

interface ExecuteAnalysisParams {
  chartImage: string;
  providedPrice: number;
  timeframe: string;
  analysisConfig: {
    isPatternAnalysis: boolean;
    isWaves: boolean;
    isGann: boolean;
    isTurtleSoup: boolean;
    isICT: boolean;
    isSMC: boolean;
    isScalping: boolean;
    isPriceAction: boolean;
  };
  symbol: string;
  userId: string;
  handleTradingViewConfig: Function;
  onAnalysisComplete?: (newItem: SearchHistoryItem) => void;
}

export const executeAnalysis = async ({
  chartImage,
  providedPrice,
  timeframe,
  analysisConfig,
  symbol,
  userId,
  handleTradingViewConfig,
  onAnalysisComplete
}: ExecuteAnalysisParams): Promise<AnalysisData | null> => {
  try {
    console.log("Executing analysis with config:", analysisConfig);
    
    const analysisType = determineAnalysisType(analysisConfig);
    console.log("Determined analysis type:", analysisType);
    
    const result = await handleTradingViewConfig(
      symbol,
      timeframe,
      providedPrice,
      analysisConfig.isScalping,
      false, // isAI
      analysisConfig.isSMC,
      analysisConfig.isICT,
      analysisConfig.isTurtleSoup,
      analysisConfig.isGann,
      analysisConfig.isWaves,
      analysisConfig.isPatternAnalysis,
      analysisConfig.isPriceAction
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
          currentPrice: providedPrice,
          analysis: result.analysisResult,
          analysisType: mappedAnalysisType,
          timeframe: timeframe
        };
        
        console.log("Adding new analysis to history:", newHistoryEntry);
        onAnalysisComplete(newHistoryEntry);
      }

      toast.success(`تم إكمال تحليل ${analysisType} على الإطار الزمني ${timeframe}`);
      return result.analysisResult;
    }
    return null;
  } catch (error) {
    console.error(`Error in ${analysisType} analysis on ${timeframe}:`, error);
    toast.error(`فشل في تحليل ${analysisType} على ${timeframe}`);
    return null;
  }
};

const determineAnalysisType = (config: ExecuteAnalysisParams['analysisConfig']): string => {
  if (config.isScalping) return 'scalping';
  if (config.isSMC) return 'smc';
  if (config.isICT) return 'ict';
  if (config.isTurtleSoup) return 'turtle_soup';
  if (config.isGann) return 'gann';
  if (config.isWaves) return 'waves';
  if (config.isPatternAnalysis) return 'patterns';
  if (config.isPriceAction) return 'price_action';
  return 'patterns'; // default
};