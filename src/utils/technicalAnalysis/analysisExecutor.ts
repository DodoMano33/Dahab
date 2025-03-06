
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
  const normalizedType = type.toLowerCase().replace(/[_\s-]/g, '').trim();
  console.log(`Normalized type for analysis: ${normalizedType}`);
  
  switch (normalizedType) {
    case "scalping":
    case "مضاربة":
    case "سكالبينج":
      console.log("Executing Scalping analysis");
      return await analyzeScalpingChart(chartImage, currentPrice, timeframe);
      
    case "smc":
    case "تحليلتحكمالسيولة":
      console.log("Executing SMC analysis");
      return await analyzeSMCChart(chartImage, currentPrice, timeframe);
      
    case "ict":
    case "تحليلict":
      console.log("Executing ICT analysis");
      return await analyzeICTChart(chartImage, currentPrice, timeframe);
      
    case "turtlesoup":
    case "turtle":
    case "تحليلturtlesoup":
      console.log("Executing Turtle Soup analysis");
      return await analyzeTurtleSoupChart(chartImage, currentPrice, timeframe);
      
    case "gann":
    case "جان":
    case "تحليلجان":
      console.log("Executing Gann analysis");
      return await analyzeGannChart(chartImage, currentPrice, timeframe);
      
    case "waves":
    case "تحليلالموجات":
    case "موجات":
      console.log("Executing Waves analysis");
      return await analyzeWavesChart(chartImage, currentPrice, timeframe);
      
    case "pattern":
    case "نمطي":
    case "تحليلالأنماط":
      console.log("Executing Pattern analysis");
      return await analyzePattern(chartImage, currentPrice, timeframe);
      
    case "priceaction":
    case "حركةالسعر":
      console.log("Executing Price Action analysis");
      return await analyzePriceAction(chartImage, currentPrice, timeframe);
      
    case "neuralnetwork":
    case "شبكةعصبية":
    case "الشبكةالعصبية":
      console.log("Executing Neural Network analysis");
      return await analyzeNeuralNetworkChart(chartImage, currentPrice, timeframe);
      
    case "rnn":
    case "شبكةrnnالعصبية":
      console.log("Executing RNN analysis");
      return await analyzeRNN(chartImage, currentPrice, timeframe);
      
    case "timeclustering":
    case "تحليلتجمعالوقت":
      console.log("Executing Time Clustering analysis");
      return await analyzeTimeClustering(chartImage, currentPrice, timeframe);
      
    case "multivariance":
    case "التباينالمتعدد":
      console.log("Executing Multi Variance analysis");
      return await analyzeMultiVariance(chartImage, currentPrice, timeframe);
      
    case "compositecandlestick":
    case "compositecandlesticks":
    case "تحليلالشموعالمركب":
      console.log("Executing Composite Candlestick analysis");
      return await analyzeCompositeCandlestick(chartImage, currentPrice, timeframe);
      
    case "behavioral":
    case "behaviors":
    case "تحليلالسلوك":
      console.log("Executing Behavioral analysis");
      return await analyzeBehavioral(chartImage, currentPrice, timeframe);
      
    case "fibonacciadvanced":
    case "تحليلفيبوناتشيمتقدم":
    case "fibonacciمتقدم":
      console.log("Executing Fibonacci Advanced analysis");
      return await analyzeFibonacciAdvancedChart(chartImage, currentPrice, timeframe);
      
    case "fibonacci":
    case "فيبوناتشي":
      console.log("Executing Fibonacci analysis");
      return await analyzeFibonacciChart(chartImage, currentPrice, timeframe);
      
    case "normal":
    case "daily":
    case "يومي":
    case "تحليلعادي":
    case "التحليلالعادي":
      console.log("Executing Daily analysis");
      return await analyzeDailyChart(chartImage, currentPrice, timeframe);
      
    default:
      console.log(`Unknown analysis type "${type}", defaulting to Daily analysis`);
      return await analyzeDailyChart(chartImage, currentPrice, timeframe);
  }
};

/**
 * Execute analysis based on provided options
 */
export const executeAnalysis = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  options: {
    isScalping?: boolean;
    isSMC?: boolean;
    isICT?: boolean;
    isTurtleSoup?: boolean;
    isGann?: boolean;
    isWaves?: boolean;
    isPatternAnalysis?: boolean;
    isPriceAction?: boolean;
    isNeuralNetwork?: boolean;
    isRNN?: boolean;
    isTimeClustering?: boolean;
    isMultiVariance?: boolean;
    isCompositeCandlestick?: boolean;
    isBehavioral?: boolean;
    isFibonacci?: boolean;
    isFibonacciAdvanced?: boolean;
  }
): Promise<AnalysisData> => {
  console.log("Executing analysis with options:", options);
  
  // Determine which analysis to run based on options
  if (options.isScalping) {
    return executeSpecificAnalysis("scalping", chartImage, currentPrice, timeframe);
  } else if (options.isSMC) {
    return executeSpecificAnalysis("smc", chartImage, currentPrice, timeframe);
  } else if (options.isICT) {
    return executeSpecificAnalysis("ict", chartImage, currentPrice, timeframe);
  } else if (options.isTurtleSoup) {
    return executeSpecificAnalysis("turtle_soup", chartImage, currentPrice, timeframe);
  } else if (options.isGann) {
    return executeSpecificAnalysis("gann", chartImage, currentPrice, timeframe);
  } else if (options.isWaves) {
    return executeSpecificAnalysis("waves", chartImage, currentPrice, timeframe);
  } else if (options.isPatternAnalysis) {
    return executeSpecificAnalysis("pattern", chartImage, currentPrice, timeframe);
  } else if (options.isPriceAction) {
    return executeSpecificAnalysis("price_action", chartImage, currentPrice, timeframe);
  } else if (options.isNeuralNetwork) {
    return executeSpecificAnalysis("neural_network", chartImage, currentPrice, timeframe);
  } else if (options.isRNN) {
    return executeSpecificAnalysis("rnn", chartImage, currentPrice, timeframe);
  } else if (options.isTimeClustering) {
    return executeSpecificAnalysis("time_clustering", chartImage, currentPrice, timeframe);
  } else if (options.isMultiVariance) {
    return executeSpecificAnalysis("multi_variance", chartImage, currentPrice, timeframe);
  } else if (options.isCompositeCandlestick) {
    return executeSpecificAnalysis("composite_candlesticks", chartImage, currentPrice, timeframe);
  } else if (options.isBehavioral) {
    return executeSpecificAnalysis("behaviors", chartImage, currentPrice, timeframe);
  } else if (options.isFibonacci) {
    return executeSpecificAnalysis("fibonacci", chartImage, currentPrice, timeframe);
  } else if (options.isFibonacciAdvanced) {
    return executeSpecificAnalysis("fibonacci_advanced", chartImage, currentPrice, timeframe);
  } else {
    return executeSpecificAnalysis("normal", chartImage, currentPrice, timeframe);
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
