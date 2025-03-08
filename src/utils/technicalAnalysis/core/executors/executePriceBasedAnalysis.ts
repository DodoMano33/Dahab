
/**
 * Price-based analysis executor
 */

import { AnalysisData } from "@/types/analysis";
import { analyzeScalpingChart } from "@/components/chart/analysis/scalpingAnalysis";
import { analyzeSMCChart } from "@/components/chart/analysis/smcAnalysis";
import { analyzeICTChart } from "@/components/chart/analysis/ictAnalysis";
import { analyzePriceAction } from "@/components/chart/analysis/priceActionAnalysis";

export const executePriceBasedAnalysis = async (
  type: string,
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log(`Executing price-based analysis for type: ${type}`);
  
  switch (type) {
    case "scalping":
    case "مضاربة":
    case "سكالبينج":
      console.log("Executing Scalping analysis");
      return await analyzeScalpingChart(chartImage, currentPrice, timeframe);
      
    case "smc":
    case "نظريةهيكلالسوق":
      console.log("Executing SMC analysis");
      return await analyzeSMCChart(chartImage, currentPrice, timeframe);
      
    case "ict":
    case "نظريةالسوق":
      console.log("Executing ICT analysis");
      return await analyzeICTChart(chartImage, currentPrice, timeframe);
      
    case "priceaction":
    case "حركةالسعر":
      console.log("Executing Price Action analysis");
      return await analyzePriceAction(chartImage, currentPrice, timeframe);
      
    default:
      console.log(`Unknown price-based analysis type "${type}", defaulting to Scalping analysis`);
      return await analyzeScalpingChart(chartImage, currentPrice, timeframe);
  }
};
