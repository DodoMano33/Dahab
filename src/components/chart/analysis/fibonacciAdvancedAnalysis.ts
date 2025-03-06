
import { AnalysisData } from "@/types/analysis";
import { calculateFibonacciLevels, findOptimalFibonacciEntry, calculateFibonacciTargets } from "@/utils/technicalAnalysis/fibonacci";
import { calculateSupportResistance, detectTrend } from "@/utils/technicalAnalysis/calculations";

// Generate a random price history for testing purposes
const generatePriceHistory = (currentPrice: number, timeframe: string) => {
  const volatility = timeframe === "1d" ? 0.02 : timeframe === "4h" ? 0.01 : 0.005;
  const periods = 50;
  const prices = [];
  let price = currentPrice * (1 - volatility * 5); // Start lower than current price
  
  for (let i = 0; i < periods; i++) {
    price = price * (1 + (Math.random() - 0.45) * volatility);
    prices.push(price);
  }
  
  // Ensure the last price is the current price
  prices[prices.length - 1] = currentPrice;
  return prices;
};

const getInstitutionalLiquidityZones = (prices: number[], currentPrice: number) => {
  // Simulate institutional liquidity zones
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const priceRange = sortedPrices[sortedPrices.length - 1] - sortedPrices[0];
  
  // Identify potential liquidity zones (simplified simulation)
  const zones = [];
  for (let i = 10; i < prices.length - 10; i++) {
    // Look for price rejection areas
    if (
      (prices[i] > prices[i-1] && prices[i] > prices[i+1]) || 
      (prices[i] < prices[i-1] && prices[i] < prices[i+1])
    ) {
      // Simulate a zone with high volume
      if (Math.random() > 0.7) {
        zones.push({
          price: prices[i],
          strength: Math.random(), // Random strength indicator
          type: prices[i] > currentPrice ? "resistance" : "support"
        });
      }
    }
  }
  
  // Add current price area as a significant zone
  zones.push({
    price: currentPrice,
    strength: 0.9,
    type: "current"
  });
  
  return zones;
};

const applyWyckoffFilter = (trend: string, currentPrice: number, prices: number[]) => {
  // Simplified Wyckoff analysis
  const recent = prices.slice(-20);
  const recentHigh = Math.max(...recent);
  const recentLow = Math.min(...recent);
  
  if (trend === "صاعد") {
    // Check for accumulation signs
    const hasHigherLows = recent[recent.length - 1] > recent[0];
    const isNearLow = (currentPrice - recentLow) / (recentHigh - recentLow) < 0.3;
    
    return {
      isValid: hasHigherLows && !isNearLow,
      phase: hasHigherLows ? "تراكم متقدم" : "تراكم مبكر",
      confidence: hasHigherLows && !isNearLow ? 0.85 : 0.6
    };
  } else {
    // Check for distribution signs
    const hasLowerHighs = recent[recent.length - 1] < recent[0];
    const isNearHigh = (recentHigh - currentPrice) / (recentHigh - recentLow) < 0.3;
    
    return {
      isValid: hasLowerHighs && !isNearHigh,
      phase: hasLowerHighs ? "توزيع متقدم" : "توزيع مبكر",
      confidence: hasLowerHighs && !isNearHigh ? 0.85 : 0.6
    };
  }
};

export const analyzeFibonacciAdvancedChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log(`Starting Fibonacci Advanced analysis for price ${currentPrice} on timeframe ${timeframe}`);
  
  // Generate sample price data
  const prices = generatePriceHistory(currentPrice, timeframe);
  
  // 1. Determine the market trend
  const trend = detectTrend(prices);
  
  // 2. Calculate support and resistance
  const { support, resistance } = calculateSupportResistance(prices, currentPrice, trend, timeframe);
  
  // 3. Get institutional liquidity zones
  const liquidityZones = getInstitutionalLiquidityZones(prices, currentPrice);
  
  // 4. Apply Wyckoff filtering
  const wyckoffAnalysis = applyWyckoffFilter(trend, currentPrice, prices);
  
  // 5. Calculate Fibonacci levels
  const high = Math.max(...prices);
  const low = Math.min(...prices);
  const fibLevels = calculateFibonacciLevels(high, low);
  
  // 6. Find optimal entry point
  const bestEntryPoint = findOptimalFibonacciEntry(currentPrice, trend, fibLevels);
  
  // 7. Calculate targets based on Fibonacci extensions
  const targets = calculateFibonacciTargets(currentPrice, trend, fibLevels)
    .slice(0, 3) // Only use the first 3 targets
    .map(target => ({
      ...target,
      expectedTime: new Date(target.expectedTime)
    }));
  
  // 8. Calculate stop loss using support/resistance and institutional zones
  const stopLossLevel = trend === "صاعد" 
    ? Math.min(...liquidityZones.filter(z => z.type === "support").map(z => z.price), support * 0.98)
    : Math.max(...liquidityZones.filter(z => z.type === "resistance").map(z => z.price), resistance * 1.02);
  
  // 9. Build the analysis result
  const analysisResult: AnalysisData = {
    pattern: "تحليل فيبوناتشي متقدم",
    direction: trend,
    currentPrice,
    support,
    resistance,
    stopLoss: Number(stopLossLevel.toFixed(2)),
    targets,
    bestEntryPoint: {
      price: Number(bestEntryPoint.price.toFixed(2)),
      reason: bestEntryPoint.reason + ` (${wyckoffAnalysis.phase})`
    },
    analysisType: "fibonacci_advanced", // Changed to match database enum value
    activation_type: "يدوي"
  };
  
  console.log("Fibonacci Advanced analysis completed:", analysisResult);
  return analysisResult;
};
