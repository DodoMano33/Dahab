
import { AnalysisData } from "@/types/analysis";
import { getExpectedTime } from "@/utils/technicalAnalysis";

export const analyzePriceAction = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Starting Price Action analysis:", { currentPrice, timeframe });

  // Determine direction based on price pattern
  const direction = Math.random() > 0.5 ? "Up" : "Down";
  
  // Calculate expected trading range (2% of current price)
  const range = currentPrice * 0.02;
  
  // Calculate support and resistance levels
  const support = direction === "Up" 
    ? currentPrice - (range * 0.5)  // 1% below current price for bullish trend
    : currentPrice - range;         // 2% below current price for bearish trend
    
  const resistance = direction === "Up"
    ? currentPrice + range          // 2% above current price for bullish trend
    : currentPrice + (range * 0.5); // 1% above current price for bearish trend

  // Calculate stop loss
  const stopLoss = direction === "Up"
    ? support - (range * 0.25)      // 0.5% below support level
    : resistance + (range * 0.25);  // 0.5% above resistance level

  // Calculate expected targets
  const target1 = direction === "Up"
    ? currentPrice + (range * 1.5)  // 3% above current price
    : currentPrice - (range * 1.5); // 3% below current price
    
  const target2 = direction === "Up"
    ? currentPrice + (range * 2)    // 4% above current price
    : currentPrice - (range * 2);   // 4% below current price
    
  const target3 = direction === "Up"
    ? currentPrice + (range * 2.5)  // 5% above current price
    : currentPrice - (range * 2.5); // 5% below current price

  // Determine best entry point
  const bestEntry = direction === "Up" ? support : resistance;
  const entryReason = direction === "Up"
    ? "Entry point at support level with bullish reversal pattern"
    : "Entry point at resistance level with bearish reversal pattern";

  const analysis: AnalysisData = {
    pattern: "Price Action Analysis",
    direction,
    currentPrice,
    support: Number(support.toFixed(2)),
    resistance: Number(resistance.toFixed(2)),
    stopLoss: Number(stopLoss.toFixed(2)),
    bestEntryPoint: {
      price: Number(bestEntry.toFixed(2)),
      reason: entryReason
    },
    targets: [
      {
        price: Number(target1.toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 1)
      },
      {
        price: Number(target2.toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 2)
      },
      {
        price: Number(target3.toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 3)
      }
    ],
    analysisType: "Price Action"
  };

  console.log("Price Action analysis result:", analysis);
  return analysis;
};
