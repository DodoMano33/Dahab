
import { AnalysisData } from "@/types/analysis";
import { getStrategyName } from "./analysisTypeMap";
import { executeMultipleAnalyses } from "./analysisExecutor";
import { 
  calculateCombinedDirection, 
  combineAndSortTargets,
  calculateWeightedValues 
} from "./analysisAggregator";

export const combinedAnalysis = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  selectedTypes: string[]
): Promise<AnalysisData> => {
  console.log("Starting combined analysis with types:", selectedTypes);

  // Early return for empty selection
  if (!selectedTypes.length) {
    console.error("No analysis types selected");
    throw new Error("No analysis types selected");
  }

  try {
    // Get display names for the strategy types
    const strategyNames = selectedTypes.map(getStrategyName);
    
    // Execute all requested analyses in parallel
    const analysisResults = await executeMultipleAnalyses(
      selectedTypes, 
      chartImage, 
      currentPrice, 
      timeframe
    );
    
    if (!analysisResults.length) {
      console.error("No analysis results returned");
      throw new Error("Failed to generate analysis results");
    }

    // Calculate weighted values for important metrics
    const weightedValues = calculateWeightedValues(analysisResults);
    
    // Determine direction based on combined analysis
    const direction = calculateCombinedDirection(analysisResults);

    // Combine and sort targets
    const combinedTargets = combineAndSortTargets(analysisResults);

    // Build the combined result
    const combinedResult: AnalysisData = {
      pattern: `Smart Analysis (${strategyNames.join(', ')})`,
      direction,
      currentPrice,
      support: weightedValues.support,
      resistance: weightedValues.resistance,
      stopLoss: weightedValues.stopLoss,
      targets: combinedTargets.slice(0, 3),
      bestEntryPoint: {
        price: weightedValues.entryPrice,
        reason: `Based on combining ${selectedTypes.length} strategies (${strategyNames.join(', ')})`
      },
      analysisType: "ذكي",
      activation_type: "تلقائي"
    };

    console.log("Combined analysis result:", combinedResult);
    return combinedResult;
  } catch (error) {
    console.error("Error in combined analysis:", error);
    throw error;
  }
};
