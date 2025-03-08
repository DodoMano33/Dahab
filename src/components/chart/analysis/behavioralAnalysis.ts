
import { AnalysisData } from "@/types/analysis";

export const analyzeBehavioral = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Analyzing chart with Behavioral Analysis for:", { timeframe, currentPrice });
  
  // Simulate behavioral analysis
  const direction = Math.random() > 0.5 ? "Up" : "Down";
  const movePercent = Math.random() * 0.05 + 0.02; // Movement between 2% and 7%
  
  // Calculate support and resistance based on behavioral analysis
  const behavioralRange = Math.random() * 0.025 + 0.015; // Behavioral range between 1.5% and 4%
  const support = Number((currentPrice * (1 - behavioralRange)).toFixed(2));
  const resistance = Number((currentPrice * (1 + behavioralRange)).toFixed(2));
  
  // Calculate stop loss based on trend
  const stopLoss = direction === "Up" 
    ? Number((support - currentPrice * 0.005).toFixed(2))
    : Number((resistance + currentPrice * 0.005).toFixed(2));
  
  // Target levels
  const targets = [];
  if (direction === "Up") {
    const target1Price = Number((currentPrice * (1 + movePercent * 0.5)).toFixed(2));
    const target2Price = Number((currentPrice * (1 + movePercent * 1.1)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 36 * 60 * 60 * 1000) // 36 hours
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 84 * 60 * 60 * 1000) // 84 hours
    });
  } else {
    const target1Price = Number((currentPrice * (1 - movePercent * 0.5)).toFixed(2));
    const target2Price = Number((currentPrice * (1 - movePercent * 1.1)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 36 * 60 * 60 * 1000) // 36 hours
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 84 * 60 * 60 * 1000) // 84 hours
    });
  }
  
  // Generate behavioral pattern
  const behavioralPatterns = [
    "Fear & Greed Pattern", 
    "Market Sentiment", 
    "Behavioral Reversal", 
    "Psychological Support/Resistance", 
    "Sentiment Extreme"
  ];
  const pattern = behavioralPatterns[Math.floor(Math.random() * behavioralPatterns.length)];
  
  // Best entry point
  const entryPrice = direction === "Up"
    ? Number((currentPrice * (1 + Math.random() * 0.003)).toFixed(2))
    : Number((currentPrice * (1 - Math.random() * 0.003)).toFixed(2));
  
  const result: AnalysisData = {
    pattern,
    direction: direction as "Up" | "Down" | "Neutral",
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: {
      price: entryPrice,
      reason: `Entry based on ${pattern} behavioral analysis`
    },
    analysisType: "Behavioral Analysis",
    activation_type: "auto"
  };
  
  return result;
};
