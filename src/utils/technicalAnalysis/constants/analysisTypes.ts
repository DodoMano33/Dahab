
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

// Define valid analysis types matching the database enum
export type ValidAnalysisType = 
  | "Normal" 
  | "Scalping" 
  | "Smart" 
  | "SMC" 
  | "ICT" 
  | "Turtle Soup" 
  | "Gann" 
  | "Waves" 
  | "Patterns" 
  | "Price Action" 
  | "Neural Networks" 
  | "RNN" 
  | "Time Clustering" 
  | "Multi Variance" 
  | "Composite Candlestick" 
  | "Behavioral Analysis" 
  | "Fibonacci" 
  | "Fibonacci Advanced" 
  | "Daily";

// List of valid analysis types for database storage
export const VALID_ANALYSIS_TYPES: ValidAnalysisType[] = [
  "Normal", "Scalping", "Smart", "SMC", "ICT", "Turtle Soup", "Gann", "Waves", 
  "Patterns", "Price Action", "Neural Networks", "RNN", "Time Clustering", 
  "Multi Variance", "Composite Candlestick", "Behavioral Analysis", "Fibonacci", 
  "Fibonacci Advanced", "Daily"
];

// Map of normalized type keys to valid database types
export const analysisTypeMap: Record<string, ValidAnalysisType> = {
  "normal": "Normal",
  "scalping": "Scalping",
  "سكالبينج": "Scalping",
  "مضاربة": "Scalping",
  "smart": "Smart",
  "ذكي": "Smart",
  "smc": "SMC",
  "نظريةهيكلالسوق": "SMC",
  "ict": "ICT",
  "نظريةالسوق": "ICT",
  "turtlesoup": "Turtle Soup",
  "turtle": "Turtle Soup", 
  "الحساءالسلحفائي": "Turtle Soup",
  "gann": "Gann",
  "جان": "Gann",
  "waves": "Waves",
  "تقلبات": "Waves",
  "patterns": "Patterns",
  "pattern": "Patterns",
  "نمطي": "Patterns",
  "priceaction": "Price Action",
  "حركةالسعر": "Price Action",
  "neuralnetworks": "Neural Networks",
  "شبكاتعصبية": "Neural Networks",
  "rnn": "RNN",
  "شبكاتعصبيةمتكررة": "RNN",
  "timeclustering": "Time Clustering",
  "تصفيقزمني": "Time Clustering",
  "multivariance": "Multi Variance",
  "تباينمتعددالعوامل": "Multi Variance",
  "compositecandlestick": "Composite Candlestick",
  "شمعاتمركبة": "Composite Candlestick",
  "behavioral": "Behavioral Analysis",
  "behavioralanalysis": "Behavioral Analysis",
  "تحليلسلوكي": "Behavioral Analysis",
  "fibonacci": "Fibonacci",
  "فيبوناتشي": "Fibonacci",
  "fibonacciadvanced": "Fibonacci Advanced",
  "advancedfibonacci": "Fibonacci Advanced",
  "تحليلفيبوناتشيمتقدم": "Fibonacci Advanced",
  "daily": "Daily"
};

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
