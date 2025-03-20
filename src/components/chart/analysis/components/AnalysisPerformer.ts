
import { toast } from "sonner";
import { saveAnalysisToHistory } from "../utils/analysisHistoryUtils";
import { mapAnalysisTypeToConfig, mapToAnalysisType } from "../utils/analysisTypeMapper";
import { SearchHistoryItem } from "@/types/analysis";
import { AnalysisType } from "@/types/analysis";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";

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
    
    // Clear caches before starting analysis
    await clearSupabaseCache();
    await clearSearchHistoryCache();
    
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
      
      // Ensure timeframe is included in the result
      result.analysisResult.timeframe = timeframe;
      
      // Convert string to AnalysisType
      const mappedAnalysisType = mapToAnalysisType(analysisType) as AnalysisType;

      // Try up to 3 times to save if there are schema cache issues
      let savedData = null;
      let attempt = 0;
      let lastError = null;
      
      while (attempt < 3 && !savedData) {
        try {
          if (attempt > 0) {
            console.log(`Retrying save (attempt ${attempt+1}/3)...`);
            await clearSupabaseCache();
            await clearSearchHistoryCache();
            await new Promise(resolve => setTimeout(resolve, 300));
          }
          
          savedData = await saveAnalysisToHistory(
            result,
            symbol,
            timeframe,
            mappedAnalysisType,
            user.id
          );
          
          console.log("Analysis saved to history:", savedData);
        } catch (error) {
          console.error(`Failed save attempt ${attempt+1}:`, error);
          lastError = error;
          attempt++;
        }
      }
      
      if (!savedData) {
        throw lastError || new Error("Failed to save analysis after multiple attempts");
      }

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
    throw error;
  }
};
