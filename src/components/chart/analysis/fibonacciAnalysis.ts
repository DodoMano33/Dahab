
import { AnalysisData } from "@/types/analysis";
import { convertArabicDirectionToEnglish } from "@/utils/directionConverter";

export const analyzeFibonacciChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Starting Fibonacci analysis for price:", currentPrice, "timeframe:", timeframe);
  
  try {
    // Determine the trend based on current price and history (simulated)
    // In a real implementation, this would analyze the chart image or fetch historical data
    const isBullish = Math.random() > 0.5; // Simplified for demo
    const arabicDirection = isBullish ? "صاعد" : "هابط";
    const direction = convertArabicDirectionToEnglish(arabicDirection);
    
    // Calculate the range for Fibonacci levels based on recent high and low
    const recentHigh = currentPrice * (1 + (Math.random() * 0.1));
    const recentLow = currentPrice * (1 - (Math.random() * 0.1));
    
    // Calculate Fibonacci retracement levels (38.2%, 50%, 61.8%, 78.6%)
    const retracement_levels = [
      { level: 0.382, price: Number((recentHigh - (recentHigh - recentLow) * 0.382).toFixed(2)) },
      { level: 0.5, price: Number((recentHigh - (recentHigh - recentLow) * 0.5).toFixed(2)) },
      { level: 0.618, price: Number((recentHigh - (recentHigh - recentLow) * 0.618).toFixed(2)) },
      { level: 0.786, price: Number((recentHigh - (recentHigh - recentLow) * 0.786).toFixed(2)) }
    ];
    
    // Calculate Fibonacci extension levels (127.2%, 161.8%, 261.8%)
    const extension_levels = [
      { level: 1.272, price: Number((recentHigh + (recentHigh - recentLow) * 0.272).toFixed(2)) },
      { level: 1.618, price: Number((recentHigh + (recentHigh - recentLow) * 0.618).toFixed(2)) },
      { level: 2.618, price: Number((recentHigh + (recentHigh - recentLow) * 1.618).toFixed(2)) }
    ];
    
    // Determine support and resistance based on Fibonacci levels
    const support = direction === "Up" ? retracement_levels[2].price : extension_levels[0].price;
    const resistance = direction === "Up" ? extension_levels[1].price : retracement_levels[1].price;
    
    // Calculate stop loss - typically below 78.6% retracement in bullish trend
    const stopLossPrice = direction === "Up" 
      ? retracement_levels[3].price * 0.99  // Below 78.6% level
      : extension_levels[0].price * 1.01;   // Above 127.2% level
    
    // Determine entry point - typically at 61.8% retracement in bullish trend
    const entryPoint = {
      price: direction === "Up" ? retracement_levels[2].price : retracement_levels[1].price,
      reason: `Entry point at Fibonacci ${direction === "Up" ? "61.8%" : "50%"} level with confirmation signal`
    };
    
    // Set profit targets based on Fibonacci extension levels
    const now = new Date();
    const targets = [
      {
        price: extension_levels[0].price, // 127.2% target
        expectedTime: new Date(now.getTime() + 24 * 60 * 60 * 1000) // +1 day
      },
      {
        price: extension_levels[1].price, // 161.8% target
        expectedTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) // +3 days
      },
      {
        price: extension_levels[2].price, // 261.8% target
        expectedTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // +7 days
      }
    ];
    
    if (direction === "Down") {
      targets.forEach(target => {
        target.price = 2 * currentPrice - target.price; // Invert for bearish trend
      });
    }
    
    // Combine retracement and extension levels
    const fibonacciLevels = [...retracement_levels, ...extension_levels];
    
    // Explicitly set the analysis type to "Fibonacci" for database compatibility
    return {
      pattern: "Fibonacci Retracement & Extension",
      direction,
      currentPrice,
      support,
      resistance,
      stopLoss: stopLossPrice,
      bestEntryPoint: entryPoint,
      targets,
      fibonacciLevels,
      analysisType: "Fibonacci",
      activation_type: "Automatic"
    };
  } catch (error) {
    console.error("Error in Fibonacci analysis:", error);
    throw error;
  }
};
