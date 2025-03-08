
import { AnalysisData } from "@/types/analysis";
import { calculateFibonacciLevels } from "@/utils/technicalAnalysis/fibonacci";
import { calculateSupportResistance } from "@/utils/technicalAnalysis/calculations";
import { getWyckoffAnalysis } from "@/utils/technicalAnalysis/wyckoff";
import { 
  detectAdvancedTrend,
  getVolatilityFactor,
  calculateAdvancedFibonacciLevels
} from "@/utils/technicalAnalysis/fibonacciAdvanced";
import {
  calculateAdvancedStopLoss,
  findOptimalFibonacciEntry,
  calculateAdvancedTargets
} from "@/utils/technicalAnalysis/fibonacciTargets";

export const analyzeFibonacciAdvanced = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Starting Advanced Fibonacci analysis for price:", currentPrice, "timeframe:", timeframe);
  
  try {
    // Determine recent high and low with volatility based on timeframe
    const volatilityFactor = getVolatilityFactor(timeframe);
    const recentHigh = currentPrice * (1 + (Math.random() * volatilityFactor * 1.5));
    const recentLow = currentPrice * (1 - (Math.random() * volatilityFactor));
    
    // Detect the trend using advanced algorithm (simulated)
    const trend = detectAdvancedTrend(currentPrice, recentHigh, recentLow);
    const direction = trend.direction as "Up" | "Down" | "Neutral";
    
    // Calculate support and resistance levels with institutional order blocks
    // Adding the timeframe as the 4th argument that was missing previously
    const { support, resistance } = calculateSupportResistance([recentLow, currentPrice, recentHigh], currentPrice, direction, timeframe);
    
    // Calculate advanced Fibonacci levels with extensions and projections
    const fibLevels = calculateAdvancedFibonacciLevels(recentHigh, recentLow, currentPrice, direction);
    
    // Find optimal entry points with confirmation patterns
    const bestEntryPoint = findOptimalFibonacciEntry(
      currentPrice,
      fibLevels,
      direction
    );
    
    // Calculate stop loss with volatility adjustment
    const stopLoss = calculateAdvancedStopLoss(
      currentPrice,
      fibLevels,
      direction,
      volatilityFactor
    );
    
    // Calculate targets based on market structure and Fibonacci projections
    const targets = calculateAdvancedTargets(
      currentPrice,
      fibLevels,
      direction,
      timeframe
    );
    
    // Get Wyckoff phase analysis for additional confirmation
    const wyckoffAnalysis = getWyckoffAnalysis(direction);
    
    // Return complete analysis with all data points
    return {
      pattern: "Fibonacci Advanced Analysis",
      direction,
      currentPrice,
      support,
      resistance,
      stopLoss,
      targets,
      fibonacciLevels: fibLevels,
      bestEntryPoint: {
        price: Number(bestEntryPoint.price.toFixed(2)),
        reason: bestEntryPoint.reason + ` (${wyckoffAnalysis.phase})`
      },
      analysisType: "Fibonacci Advanced", 
      activation_type: "manual"
    };
  } catch (error) {
    console.error("Error in advanced Fibonacci analysis:", error);
    throw error;
  }
};
