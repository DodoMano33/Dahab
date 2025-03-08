
import { AnalysisData } from "@/types/analysis";

export const analyzeCompositeCandlestick = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Analyzing chart with Composite Candlestick for:", { timeframe, currentPrice });
  
  // Simulate Composite Candlestick analysis
  const direction = Math.random() > 0.5 ? "Bullish" : "Bearish";
  const movePercent = Math.random() * 0.045 + 0.015; // Movement between 1.5% and 6%
  
  // Calculate support and resistance levels using candlestick analysis
  const candlestickRange = Math.random() * 0.02 + 0.01; // Candle range between 1% and 3%
  const support = Number((currentPrice * (1 - candlestickRange)).toFixed(2));
  const resistance = Number((currentPrice * (1 + candlestickRange)).toFixed(2));
  
  // Calculate stop loss levels based on direction
  const stopLoss = direction === "Bullish" 
    ? Number((support - currentPrice * 0.004).toFixed(2))
    : Number((resistance + currentPrice * 0.004).toFixed(2));
  
  // Target levels
  const targets = [];
  if (direction === "Bullish") {
    const target1Price = Number((currentPrice * (1 + movePercent * 0.6)).toFixed(2));
    const target2Price = Number((currentPrice * (1 + movePercent)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 60 * 60 * 60 * 1000) // 60 hours
    });
  } else {
    const target1Price = Number((currentPrice * (1 - movePercent * 0.6)).toFixed(2));
    const target2Price = Number((currentPrice * (1 - movePercent)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 60 * 60 * 60 * 1000) // 60 hours
    });
  }
  
  // Generate composite candlestick pattern type
  const candlePatterns = [
    "Three Line Strike", 
    "Morning Star", 
    "Evening Star", 
    "Three Black Crows", 
    "Three White Soldiers", 
    "Dark Cloud Cover"
  ];
  const pattern = candlePatterns[Math.floor(Math.random() * candlePatterns.length)];
  
  // Ideal entry point
  const entryPrice = direction === "Bullish"
    ? Number((currentPrice * (1 + Math.random() * 0.002)).toFixed(2))
    : Number((currentPrice * (1 - Math.random() * 0.002)).toFixed(2));
  
  const result: AnalysisData = {
    pattern,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: {
      price: entryPrice,
      reason: `Entry based on ${pattern} candlestick pattern`
    },
    analysisType: "Composite Candlestick",
    activation_type: "Automatic"
  };
  
  return result;
};
