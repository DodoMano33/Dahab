
/**
 * Constants and types for analysis type mappings
 */

// Map of normalized analysis type keys to their display names
export const analysisTypeDisplayMap: Record<string, string> = {
  "scalping": "Scalping",
  "smc": "SMC",
  "ict": "ICT",
  "turtlesoup": "Turtle Soup",
  "gann": "Gann",
  "waves": "Waves",
  "patterns": "Patterns",
  "priceaction": "Price Action",
  "neuralnetworks": "Neural Networks",
  "rnn": "RNN",
  "timeclustering": "Time Clustering",
  "multivariance": "Multi Variance",
  "compositecandlestick": "Composite Candlestick",
  "behavioral": "Behavioral Analysis",
  "fibonacci": "Fibonacci",
  "fibonacciadvanced": "Fibonacci Advanced",
  "daily": "Daily Analysis"
};

// Types for analysis categories
export type AnalysisCategory = 
  | "price-based" 
  | "pattern-based"
  | "fibonacci-based"
  | "machine-learning"
  | "advanced-analysis";

// Analysis type to category mapping
export const analysisCategoryMap: Record<string, AnalysisCategory> = {
  "scalping": "price-based",
  "smc": "price-based",
  "ict": "price-based",
  "priceaction": "price-based",
  "turtlesoup": "pattern-based",
  "patterns": "pattern-based",
  "compositecandlestick": "pattern-based",
  "daily": "pattern-based",
  "gann": "fibonacci-based",
  "waves": "fibonacci-based",
  "fibonacci": "fibonacci-based",
  "fibonacciadvanced": "fibonacci-based",
  "neuralnetworks": "machine-learning",
  "rnn": "machine-learning",
  "timeclustering": "advanced-analysis",
  "multivariance": "advanced-analysis",
  "behavioral": "advanced-analysis"
};
