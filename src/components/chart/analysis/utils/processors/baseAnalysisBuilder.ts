
import { AnalysisData, AnalysisType } from "@/types/analysis";

/**
 * Creates a base analysis result with default values
 */
export const createBaseAnalysisResult = (
  symbol: string,
  timeframe: string,
  providedPrice: number,
  analysisType: string,
  duration?: string
): AnalysisData => {
  return {
    analysisType: analysisType as AnalysisType,
    direction: "محايد",
    pattern: "قيد التحليل",
    confidence_score: 0,
    timeframe: timeframe,
    currentPrice: providedPrice,
    support: providedPrice * 0.98, // Default support level
    resistance: providedPrice * 1.02, // Default resistance level
    bestEntryPoint: {
      price: providedPrice,
      reason: `تم التحليل في ${new Date().toISOString()}`
    },
    stopLoss: providedPrice * 0.99,
    targets: [
      {
        price: providedPrice * 1.01,
        expectedTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    ],
    analysis_duration_hours: duration ? parseInt(duration) : 8
  };
};

/**
 * Merges base analysis with the result from specific analysis
 */
export const mergeAnalysisResults = (
  baseResult: AnalysisData,
  specificResult: AnalysisData,
  timeframe: string,
  providedPrice: number,
  duration?: string
): AnalysisData => {
  return {
    ...baseResult,
    ...specificResult,
    timeframe,
    analysis_duration_hours: duration ? parseInt(duration) : (specificResult.analysis_duration_hours || 8),
    currentPrice: providedPrice
  };
};
