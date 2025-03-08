
/**
 * Fibonacci-based analysis executor
 */

import { AnalysisData } from "@/types/analysis";
import { analyzeGannChart } from "@/components/chart/analysis/gannAnalysis";
import { analyzeWavesChart } from "@/components/chart/analysis/wavesAnalysis";
import { analyzeFibonacciChart } from "@/components/chart/analysis/fibonacciAnalysis";
import { analyzeFibonacciAdvancedChart } from "@/components/chart/analysis/fibonacciAdvancedAnalysis";

export const executeFibonacciBasedAnalysis = async (
  type: string,
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log(`Executing fibonacci-based analysis for type: ${type}`);
  
  switch (type) {
    case "gann":
    case "جان":
      console.log("Executing Gann analysis");
      return await analyzeGannChart(chartImage, currentPrice, timeframe);
      
    case "waves":
    case "تقلبات":
      console.log("Executing Waves analysis");
      return await analyzeWavesChart(chartImage, currentPrice, timeframe);
      
    case "fibonacci":
    case "فيبوناتشي":
      console.log("Executing Fibonacci analysis");
      return await analyzeFibonacciChart(chartImage, currentPrice, timeframe);
      
    case "fibonacciadvanced":
    case "تحليلفيبوناتشيمتقدم":
      console.log("Executing Fibonacci Advanced analysis");
      return await analyzeFibonacciAdvancedChart(chartImage, currentPrice, timeframe);
      
    default:
      console.log(`Unknown fibonacci-based analysis type "${type}", defaulting to Fibonacci analysis`);
      return await analyzeFibonacciChart(chartImage, currentPrice, timeframe);
  }
};
