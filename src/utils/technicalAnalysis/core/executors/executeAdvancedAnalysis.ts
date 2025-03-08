
/**
 * Advanced analysis executor
 */

import { AnalysisData } from "@/types/analysis";
import { analyzeTimeClustering } from "@/components/chart/analysis/timeClusteringAnalysis";
import { analyzeMultiVariance } from "@/components/chart/analysis/multiVarianceAnalysis";
import { analyzeBehavioral } from "@/components/chart/analysis/behavioralAnalysis";

export const executeAdvancedAnalysis = async (
  type: string,
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log(`Executing advanced analysis for type: ${type}`);
  
  switch (type) {
    case "timeclustering":
    case "تصفيقزمني":
      console.log("Executing Time Clustering analysis");
      return await analyzeTimeClustering(chartImage, currentPrice, timeframe);
      
    case "multivariance":
    case "تباينمتعددالعوامل":
      console.log("Executing Multi Variance analysis");
      return await analyzeMultiVariance(chartImage, currentPrice, timeframe);
      
    case "behavioral":
    case "تحليلسلوكي":
      console.log("Executing Behavioral analysis");
      return await analyzeBehavioral(chartImage, currentPrice, timeframe);
      
    default:
      console.log(`Unknown advanced analysis type "${type}", defaulting to Behavioral analysis`);
      return await analyzeBehavioral(chartImage, currentPrice, timeframe);
  }
};
