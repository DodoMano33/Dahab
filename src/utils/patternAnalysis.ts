
import { AnalysisData } from "@/types/analysis";
import { analyzePatternWithPrice } from "./patternRecognition";
import { getExpectedTime } from "./technicalAnalysis";

export const analyzePattern = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string = "1d"
): Promise<AnalysisData> => {
  console.log("Starting pattern analysis - Received data:", { chartImage, currentPrice, timeframe });
  
  try {
    if (!currentPrice || isNaN(currentPrice)) {
      console.error("Error: Current price is invalid:", currentPrice);
      throw new Error("Current price is invalid");
    }

    if (!chartImage) {
      console.error("Error: Chart image not received");
      throw new Error("Chart image not received");
    }

    const analysis = analyzePatternWithPrice(chartImage, currentPrice, timeframe);
    console.log("Pattern analysis completed successfully:", analysis);
    return analysis;

  } catch (error) {
    console.error("Error in pattern analysis:", error);
    throw new Error(`Failed to analyze pattern: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
