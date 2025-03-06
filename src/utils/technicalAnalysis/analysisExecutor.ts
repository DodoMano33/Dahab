
import { AnalysisData } from "@/types/analysis";
import { analyzeScalpingChart } from "@/components/chart/analysis/scalpingAnalysis";
import { analyzeSMCChart } from "@/components/chart/analysis/smcAnalysis";
import { analyzeICTChart } from "@/components/chart/analysis/ictAnalysis";
import { analyzeTurtleSoupChart } from "@/components/chart/analysis/turtleSoupAnalysis";
import { analyzeGannChart } from "@/components/chart/analysis/gannAnalysis";
import { analyzeWavesChart } from "@/components/chart/analysis/wavesAnalysis";
import { analyzePattern } from "@/utils/patternAnalysis";
import { analyzePriceAction } from "@/components/chart/analysis/priceActionAnalysis";
import { analyzeNeuralNetworkChart } from "@/components/chart/analysis/neuralNetworkAnalysis";
import { analyzeRNN } from "@/components/chart/analysis/rnnAnalysis";
import { analyzeTimeClustering } from "@/components/chart/analysis/timeClusteringAnalysis";
import { analyzeMultiVariance } from "@/components/chart/analysis/multiVarianceAnalysis";
import { analyzeCompositeCandlestick } from "@/components/chart/analysis/compositeCandlestickAnalysis";
import { analyzeBehavioral } from "@/components/chart/analysis/behavioralAnalysis";
import { analyzeFibonacciChart } from "@/components/chart/analysis/fibonacciAnalysis";
import { analyzeFibonacciAdvancedChart } from "@/components/chart/analysis/fibonacciAdvancedAnalysis";
import { analyzeDailyChart } from "@/components/chart/analysis/dailyAnalysis";

/**
 * Execute a specific analysis based on the given type
 */
export const executeSpecificAnalysis = async (
  type: string,
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log(`Executing specific analysis for type: ${type}`);
  
  switch (type) {
    case "scalping":
      return await analyzeScalpingChart(chartImage, currentPrice, timeframe);
    case "smc":
      return await analyzeSMCChart(chartImage, currentPrice, timeframe);
    case "ict":
      return await analyzeICTChart(chartImage, currentPrice, timeframe);
    case "turtleSoup":
    case "turtle_soup":
      return await analyzeTurtleSoupChart(chartImage, currentPrice, timeframe);
    case "gann":
      return await analyzeGannChart(chartImage, currentPrice, timeframe);
    case "waves":
      return await analyzeWavesChart(chartImage, currentPrice, timeframe);
    case "patterns":
      return await analyzePattern(chartImage, currentPrice, timeframe);
    case "priceAction":
    case "price_action":
      return await analyzePriceAction(chartImage, currentPrice, timeframe);
    case "neural_networks":
      return await analyzeNeuralNetworkChart(chartImage, currentPrice, timeframe);
    case "rnn":
      return await analyzeRNN(chartImage, currentPrice, timeframe);
    case "time_clustering":
      return await analyzeTimeClustering(chartImage, currentPrice, timeframe);
    case "multi_variance":
      return await analyzeMultiVariance(chartImage, currentPrice, timeframe);
    case "composite_candlestick":
      return await analyzeCompositeCandlestick(chartImage, currentPrice, timeframe);
    case "behavioral":
      return await analyzeBehavioral(chartImage, currentPrice, timeframe);
    case "fibonacci":
      return await analyzeFibonacciChart(chartImage, currentPrice, timeframe);
    case "fibonacci_advanced":
      return await analyzeFibonacciAdvancedChart(chartImage, currentPrice, timeframe);
    default:
      return await analyzeDailyChart(chartImage, currentPrice, timeframe);
  }
};

/**
 * Execute multiple analyses in parallel
 */
export const executeMultipleAnalyses = async (
  types: string[],
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData[]> => {
  console.log("Executing multiple analyses for types:", types);
  
  const promises = types.map(type => 
    executeSpecificAnalysis(type, chartImage, currentPrice, timeframe)
  );
  
  try {
    return await Promise.all(promises);
  } catch (error) {
    console.error("Error in multiple analyses execution:", error);
    return [];
  }
};
