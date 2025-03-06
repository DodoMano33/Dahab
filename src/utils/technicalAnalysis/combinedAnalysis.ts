
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
  console.log("Display names for types:", selectedTypes.map(getStrategyName));

  // Early return for empty selection
  if (!selectedTypes.length) {
    console.error("No analysis types selected");
    throw new Error("No analysis types selected");
  }

  // Filter out the "normal" type if it exists (it's just a UI indicator for "select all")
  const actualTypes = selectedTypes.filter(type => type !== "normal");
  console.log("Actual analysis types (without 'normal'):", actualTypes);
  
  if (!actualTypes.length) {
    console.error("No valid analysis types selected after filtering");
    throw new Error("No valid analysis types selected");
  }

  try {
    // Get display names for the strategy types
    const strategyNames = actualTypes.map(getStrategyName);
    console.log("Strategy display names:", strategyNames);
    
    // Execute all requested analyses in parallel
    const analysisResults = await executeMultipleAnalyses(
      actualTypes, 
      chartImage, 
      currentPrice, 
      timeframe
    );
    
    if (!analysisResults.length) {
      console.error("No analysis results returned");
      throw new Error("Failed to generate analysis results");
    }

    console.log(`Got ${analysisResults.length} analysis results`);

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
        reason: `Based on combining ${actualTypes.length} strategies (${strategyNames.join(', ')})`
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
