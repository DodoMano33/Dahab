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
import { analyzeFibonacciAdvanced } from "@/components/chart/analysis/fibonacciAdvancedAnalysis";
import { analyzeDailyChart } from "@/components/chart/analysis/dailyAnalysis";
import { getStrategyName } from "./analysisTypeMap";

/**
 * Execute a specific analysis based on the given type
 */
export const executeSpecificAnalysis = async (
  type: string,
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log(`Executing specific analysis for type: ${type} (Display name: ${getStrategyName(type)})`);
  
  // Normalize the type for switching
  const normalizedType = type.toLowerCase().replace(/_/g, '').trim();
  console.log(`Normalized type for analysis: ${normalizedType}`);
  
  switch (normalizedType) {
    case "scalping":
      console.log("Executing Scalping analysis");
      return await analyzeScalpingChart(chartImage, currentPrice, timeframe);
      
    case "smc":
      console.log("Executing SMC analysis");
      return await analyzeSMCChart(chartImage, currentPrice, timeframe);
      
    case "ict":
      console.log("Executing ICT analysis");
      return await analyzeICTChart(chartImage, currentPrice, timeframe);
      
    case "turtlesoup":
    case "turtle":
      console.log("Executing Turtle Soup analysis");
      return await analyzeTurtleSoupChart(chartImage, currentPrice, timeframe);
      
    case "gann":
      console.log("Executing Gann analysis");
      return await analyzeGannChart(chartImage, currentPrice, timeframe);
      
    case "waves":
      console.log("Executing Waves analysis");
      return await analyzeWavesChart(chartImage, currentPrice, timeframe);
      
    case "patterns":
    case "pattern":
      console.log("Executing Pattern analysis");
      return await analyzePattern(chartImage, currentPrice, timeframe);
      
    case "priceaction":
      console.log("Executing Price Action analysis");
      return await analyzePriceAction(chartImage, currentPrice, timeframe);
      
    case "neuralnetworks":
      console.log("Executing Neural Networks analysis");
      return await analyzeNeuralNetworkChart(chartImage, currentPrice, timeframe);
      
    case "rnn":
      console.log("Executing RNN analysis");
      return await analyzeRNN(chartImage, currentPrice, timeframe);
      
    case "timeclustering":
      console.log("Executing Time Clustering analysis");
      return await analyzeTimeClustering(chartImage, currentPrice, timeframe);
      
    case "multivariance":
      console.log("Executing Multi Variance analysis");
      return await analyzeMultiVariance(chartImage, currentPrice, timeframe);
      
    case "compositecandlestick":
      console.log("Executing Composite Candlestick analysis");
      return await analyzeCompositeCandlestick(chartImage, currentPrice, timeframe);
      
    case "behavioral":
      console.log("Executing Behavioral analysis");
      return await analyzeBehavioral(chartImage, currentPrice, timeframe);
      
    case "fibonacciadvanced":
      console.log("Executing Fibonacci Advanced analysis");
      const advancedResult = await analyzeFibonacciAdvanced(chartImage, currentPrice, timeframe);
      if (advancedResult) {
        // Make sure analysis type is correctly set
        advancedResult.analysisType = "Fibonacci";
      }
      return advancedResult;
      
    case "fibonacci":
      console.log("Executing Fibonacci analysis");
      const result = await analyzeFibonacciChart(chartImage, currentPrice, timeframe);
      if (result) {
        // Make sure analysis type is correctly set
        result.analysisType = "Fibonacci";
      }
      return result;
      
    case "daily":
      console.log("Executing Daily analysis");
      return await analyzeDailyChart(chartImage, currentPrice, timeframe);
      
    default:
      console.log(`Unknown analysis type "${type}", defaulting to Daily analysis`);
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
  console.log("Analysis display names:", types.map(t => getStrategyName(t)));
  
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
