
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { analyzeSMCChart } from "../smcAnalysis";
import { analyzeICTChart } from "../ictAnalysis";
import { analyzeTurtleSoupChart } from "../turtleSoupAnalysis";
import { analyzeGannChart } from "../gannAnalysis";
import { analyzeWavesChart } from "../wavesAnalysis";
import { analyzePattern } from "../patternAnalysis";
import { analyzeDailyChart } from "../dailyAnalysis";
import { analyzeScalpingChart } from "../scalpingAnalysis";
import { analyzePriceAction } from "../priceActionAnalysis";
import { analyzeNeuralNetworkChart } from "../neuralNetworkAnalysis";
import { analyzeRNN } from "../rnnAnalysis";
import { analyzeTimeClustering } from "../timeClusteringAnalysis";
import { analyzeMultiVariance } from "../multiVarianceAnalysis";
import { analyzeCompositeCandlestick } from "../compositeCandlestickAnalysis";
import { analyzeBehavioral } from "../behavioralAnalysis";
import { analyzeFibonacciChart } from "../fibonacciAnalysis";
import { analyzeFibonacciAdvancedChart } from "../fibonacciAdvancedAnalysis";
import { mapToAnalysisType } from "./analysisTypeMapper";

interface AnalysisOptions {
  isPatternAnalysis: boolean;
  isWaves: boolean;
  isGann: boolean;
  isTurtleSoup: boolean;
  isICT: boolean;
  isSMC: boolean;
  isScalping: boolean;
  isPriceAction: boolean;
  isNeuralNetwork: boolean;
  isRNN?: boolean;
  isTimeClustering?: boolean;
  isMultiVariance?: boolean;
  isCompositeCandlestick?: boolean;
  isBehavioral?: boolean;
  isFibonacci?: boolean;
  isFibonacciAdvanced?: boolean;
}

export const executeAnalysis = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  options: AnalysisOptions
): Promise<AnalysisData> => {
  const {
    isPatternAnalysis,
    isWaves,
    isGann,
    isTurtleSoup,
    isICT,
    isSMC,
    isScalping,
    isPriceAction,
    isNeuralNetwork,
    isRNN = false,
    isTimeClustering = false,
    isMultiVariance = false,
    isCompositeCandlestick = false,
    isBehavioral = false,
    isFibonacci = false,
    isFibonacciAdvanced = false
  } = options;

  let selectedStrategies = [];
  if (isPatternAnalysis) selectedStrategies.push("Patterns");
  if (isWaves) selectedStrategies.push("Waves");
  if (isGann) selectedStrategies.push("Gann");
  if (isTurtleSoup) selectedStrategies.push("Turtle Soup");
  if (isICT) selectedStrategies.push("ICT");
  if (isSMC) selectedStrategies.push("SMC");
  if (isScalping) selectedStrategies.push("Scalping");
  if (isPriceAction) selectedStrategies.push("Price Action");
  if (isNeuralNetwork) selectedStrategies.push("Neural Networks");
  if (isRNN) selectedStrategies.push("RNN");
  if (isTimeClustering) selectedStrategies.push("Time Clustering");
  if (isMultiVariance) selectedStrategies.push("Multi Variance");
  if (isCompositeCandlestick) selectedStrategies.push("Composite Candlestick");
  if (isBehavioral) selectedStrategies.push("Behavioral");
  if (isFibonacci) selectedStrategies.push("Fibonacci");
  if (isFibonacciAdvanced) selectedStrategies.push("Fibonacci Advanced");

  let analysis: AnalysisData;

  if (selectedStrategies.length > 1) {
    const promises = selectedStrategies.map(strategy => {
      switch (strategy) {
        case "Patterns": return analyzePattern(chartImage, currentPrice, timeframe);
        case "Waves": return analyzeWavesChart(chartImage, currentPrice, timeframe);
        case "Gann": return analyzeGannChart(chartImage, currentPrice, timeframe);
        case "Turtle Soup": return analyzeTurtleSoupChart(chartImage, currentPrice, timeframe);
        case "ICT": return analyzeICTChart(chartImage, currentPrice, timeframe);
        case "SMC": return analyzeSMCChart(chartImage, currentPrice, timeframe);
        case "Scalping": return analyzeScalpingChart(chartImage, currentPrice, timeframe);
        case "Price Action": return analyzePriceAction(chartImage, currentPrice, timeframe);
        case "Neural Networks": return analyzeNeuralNetworkChart(chartImage, currentPrice, timeframe);
        case "RNN": return analyzeRNN(chartImage, currentPrice, timeframe);
        case "Time Clustering": return analyzeTimeClustering(chartImage, currentPrice, timeframe);
        case "Multi Variance": return analyzeMultiVariance(chartImage, currentPrice, timeframe);
        case "Composite Candlestick": return analyzeCompositeCandlestick(chartImage, currentPrice, timeframe);
        case "Behavioral": return analyzeBehavioral(chartImage, currentPrice, timeframe);
        case "Fibonacci": return analyzeFibonacciChart(chartImage, currentPrice, timeframe);
        case "Fibonacci Advanced": return analyzeFibonacciAdvancedChart(chartImage, currentPrice, timeframe);
        default: return analyzeDailyChart(chartImage, currentPrice, timeframe);
      }
    });

    const results = await Promise.all(promises);
    
    analysis = results[0];
    if (analysis.bestEntryPoint) {
      analysis.bestEntryPoint.reason = `Based on combining ${selectedStrategies.length} strategies (${selectedStrategies.join(', ')})`;
    }
    analysis.pattern = `Smart Analysis (${selectedStrategies.join(', ')})`;
    
    // Ensure we use a valid analysis type for database
    analysis.analysisType = "ذكي";
    analysis.activation_type = "تلقائي";
  } else {
    const strategy = selectedStrategies[0] || "Standard";
    console.log("Executing single strategy analysis:", strategy);
    
    switch (strategy) {
      case "Patterns":
        analysis = await analyzePattern(chartImage, currentPrice, timeframe);
        break;
      case "Waves":
        analysis = await analyzeWavesChart(chartImage, currentPrice, timeframe);
        break;
      case "Gann":
        analysis = await analyzeGannChart(chartImage, currentPrice, timeframe);
        break;
      case "Turtle Soup":
        analysis = await analyzeTurtleSoupChart(chartImage, currentPrice, timeframe);
        break;
      case "ICT":
        analysis = await analyzeICTChart(chartImage, currentPrice, timeframe);
        break;
      case "SMC":
        analysis = await analyzeSMCChart(chartImage, currentPrice, timeframe);
        break;
      case "Scalping":
        analysis = await analyzeScalpingChart(chartImage, currentPrice, timeframe);
        break;
      case "Price Action":
        analysis = await analyzePriceAction(chartImage, currentPrice, timeframe);
        break;
      case "Neural Networks":
        analysis = await analyzeNeuralNetworkChart(chartImage, currentPrice, timeframe);
        break;
      case "RNN":
        analysis = await analyzeRNN(chartImage, currentPrice, timeframe);
        break;
      case "Time Clustering":
        analysis = await analyzeTimeClustering(chartImage, currentPrice, timeframe);
        break;
      case "Multi Variance":
        analysis = await analyzeMultiVariance(chartImage, currentPrice, timeframe);
        break;
      case "Composite Candlestick":
        analysis = await analyzeCompositeCandlestick(chartImage, currentPrice, timeframe);
        break;
      case "Behavioral":
        analysis = await analyzeBehavioral(chartImage, currentPrice, timeframe);
        break;
      case "Fibonacci":
        analysis = await analyzeFibonacciChart(chartImage, currentPrice, timeframe);
        // Ensure we use a valid analysis type for database
        if (analysis && !analysis.analysisType) {
          analysis.analysisType = "فيبوناتشي";
        }
        break;
      case "Fibonacci Advanced":
        analysis = await analyzeFibonacciAdvancedChart(chartImage, currentPrice, timeframe);
        // Ensure we use a valid analysis type for database
        if (analysis && !analysis.analysisType) {
          analysis.analysisType = "فيبوناتشي متقدم";
        }
        break;
      default:
        analysis = await analyzeDailyChart(chartImage, currentPrice, timeframe);
        // Ensure we use a valid analysis type for database
        if (analysis && !analysis.analysisType) {
          analysis.analysisType = "تحليل الأنماط";
        }
    }
    
    // Final check to ensure the analysis type is valid for database
    if (analysis && analysis.analysisType) {
      analysis.analysisType = mapToAnalysisType(analysis.analysisType);
      console.log("Final normalized analysis type:", analysis.analysisType);
    }
  }

  return analysis;
};

// Adding this function to execute multiple analyses for combined strategies
export const executeMultipleAnalyses = async (
  analysisTypes: string[],
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData[]> => {
  const options: AnalysisOptions = {
    isPatternAnalysis: false,
    isWaves: false,
    isGann: false,
    isTurtleSoup: false,
    isICT: false,
    isSMC: false,
    isScalping: false,
    isPriceAction: false,
    isNeuralNetwork: false,
    isRNN: false,
    isTimeClustering: false,
    isMultiVariance: false,
    isCompositeCandlestick: false,
    isBehavioral: false,
    isFibonacci: false,
    isFibonacciAdvanced: false
  };
  
  const results: AnalysisData[] = [];
  
  for (const type of analysisTypes) {
    // Reset all options for each run
    Object.keys(options).forEach(key => {
      options[key as keyof AnalysisOptions] = false;
    });
    
    // Set the specific option for this analysis type
    const normalized = type.toLowerCase().replace(/\s+/g, '');
    
    if (normalized.includes('pattern') || normalized.includes('أنماط') || normalized.includes('انماط')) {
      options.isPatternAnalysis = true;
    } else if (normalized.includes('waves') || normalized.includes('موجات')) {
      options.isWaves = true;
    } else if (normalized.includes('gann') || normalized.includes('جان')) {
      options.isGann = true;
    } else if (normalized.includes('turtle') || normalized.includes('سلحفاة')) {
      options.isTurtleSoup = true;
    } else if (normalized.includes('ict')) {
      options.isICT = true;
    } else if (normalized.includes('smc')) {
      options.isSMC = true;
    } else if (normalized.includes('scalping') || normalized.includes('سكالبينج')) {
      options.isScalping = true;
    } else if (normalized.includes('priceaction') || normalized.includes('حركةالسعر')) {
      options.isPriceAction = true;
    } else if (normalized.includes('neural') || normalized.includes('عصبية')) {
      if (normalized.includes('rnn')) {
        options.isRNN = true;
      } else {
        options.isNeuralNetwork = true;
      }
    } else if (normalized.includes('time') || normalized.includes('تصفيق')) {
      options.isTimeClustering = true;
    } else if (normalized.includes('variance') || normalized.includes('تباين')) {
      options.isMultiVariance = true;
    } else if (normalized.includes('composite') || normalized.includes('شمعات')) {
      options.isCompositeCandlestick = true;
    } else if (normalized.includes('behav') || normalized.includes('سلوكي')) {
      options.isBehavioral = true;
    } else if (normalized.includes('fibonacci') || normalized.includes('فيبوناتشي')) {
      if (normalized.includes('advanced') || normalized.includes('متقدم')) {
        options.isFibonacciAdvanced = true;
      } else {
        options.isFibonacci = true;
      }
    }
    
    try {
      console.log(`Executing analysis for ${type} with options:`, options);
      const result = await executeAnalysis(chartImage, currentPrice, timeframe, options);
      
      // Ensure the result has a valid analysis type
      if (result) {
        result.analysisType = mapToAnalysisType(type);
        results.push(result);
      }
    } catch (error) {
      console.error(`Error executing analysis for ${type}:`, error);
    }
  }
  
  return results;
};
