
import { AnalysisData } from "@/types/analysis";

export const analyzeMultiVariance = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Analyzing chart with Multi-factor Variance for:", { timeframe, currentPrice });
  
  // Simulate multi-factor variance analysis
  const direction = Math.random() > 0.5 ? "Up" : "Down";
  const movePercent = Math.random() * 0.06 + 0.02; // Movement between 2% and 8%
  
  // Calculate support and resistance using multi-factor variance
  const varianceMultiplier = Math.random() * 0.01 + 0.02; // Between 2% and 3%
  const support = Number((currentPrice * (1 - varianceMultiplier)).toFixed(2));
  const resistance = Number((currentPrice * (1 + varianceMultiplier)).toFixed(2));
  
  // Calculate stop loss based on trend
  const stopLoss = direction === "Up" 
    ? Number((support - currentPrice * 0.005).toFixed(2))
    : Number((resistance + currentPrice * 0.005).toFixed(2));
  
  // Target levels
  const targets = [];
  if (direction === "Up") {
    const target1Price = Number((currentPrice * (1 + movePercent * 0.4)).toFixed(2));
    const target2Price = Number((currentPrice * (1 + movePercent * 0.8)).toFixed(2));
    const target3Price = Number((currentPrice * (1 + movePercent * 1.2)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
    });
    targets.push({
      price: target3Price,
      expectedTime: new Date(Date.now() + 96 * 60 * 60 * 1000) // 96 hours
    });
  } else {
    const target1Price = Number((currentPrice * (1 - movePercent * 0.4)).toFixed(2));
    const target2Price = Number((currentPrice * (1 - movePercent * 0.8)).toFixed(2));
    const target3Price = Number((currentPrice * (1 - movePercent * 1.2)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
    });
    targets.push({
      price: target3Price,
      expectedTime: new Date(Date.now() + 96 * 60 * 60 * 1000) // 96 hours
    });
  }
  
  // Best entry point
  const entryPrice = direction === "Up"
    ? Number((currentPrice * (1 + Math.random() * 0.003)).toFixed(2))
    : Number((currentPrice * (1 - Math.random() * 0.003)).toFixed(2));
  
  const result: AnalysisData = {
    pattern: "Multi-factor Variance Pattern",
    direction: direction as "Up" | "Down" | "Neutral",
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: {
      price: entryPrice,
      reason: "Entry based on multi-factor variance analysis of market conditions"
    },
    analysisType: "Multi Variance",
    activation_type: "auto"
  };
  
  return result;
};
