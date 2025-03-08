
/**
 * Pattern-based analysis executor
 */

import { AnalysisData } from "@/types/analysis";
import { analyzeTurtleSoupChart } from "@/components/chart/analysis/turtleSoupAnalysis";
import { analyzePattern } from "@/components/chart/analysis/patternAnalysis";
import { analyzeCompositeCandlestick } from "@/components/chart/analysis/compositeCandlestickAnalysis";
import { analyzeDailyChart } from "@/components/chart/analysis/dailyAnalysis";

export const executePatternBasedAnalysis = async (
  type: string,
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log(`Executing pattern-based analysis for type: ${type}`);
  
  switch (type) {
    case "turtlesoup":
    case "turtle":
    case "الحساءالسلحفائي":
      console.log("Executing Turtle Soup analysis");
      return await analyzeTurtleSoupChart(chartImage, currentPrice, timeframe);
      
    case "patterns":
    case "pattern":
    case "نمطي":
      console.log("Executing Pattern analysis");
      return await analyzePattern(chartImage, currentPrice, timeframe);
      
    case "compositecandlestick":
    case "شمعاتمركبة":
      console.log("Executing Composite Candlestick analysis");
      return await analyzeCompositeCandlestick(chartImage, currentPrice, timeframe);
      
    case "daily":
    case "يومي":
      console.log("Executing Daily analysis");
      return await analyzeDailyChart(chartImage, currentPrice, timeframe);
      
    default:
      console.log(`Unknown pattern-based analysis type "${type}", defaulting to Daily analysis`);
      return await analyzeDailyChart(chartImage, currentPrice, timeframe);
  }
};
