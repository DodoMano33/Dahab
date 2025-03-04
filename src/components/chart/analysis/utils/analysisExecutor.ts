
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
    isBehavioral = false
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
        default: return analyzeDailyChart(chartImage, currentPrice, timeframe);
      }
    });

    const results = await Promise.all(promises);
    
    analysis = results[0];
    if (analysis.bestEntryPoint) {
      analysis.bestEntryPoint.reason = `Based on combining ${selectedStrategies.length} strategies (${selectedStrategies.join(', ')})`;
    }
    analysis.pattern = `Smart Analysis (${selectedStrategies.join(', ')})`;
    analysis.analysisType = "ذكي" as AnalysisType;
    analysis.activation_type = "تلقائي";
  } else {
    const strategy = selectedStrategies[0] || "Standard";
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
        if (analysis) {
          analysis.analysisType = "شبكات عصبية" as AnalysisType;
        }
        break;
      case "Time Clustering":
        analysis = await analyzeTimeClustering(chartImage, currentPrice, timeframe);
        if (analysis) {
          analysis.analysisType = "تقلبات" as AnalysisType;
        }
        break;
      case "Multi Variance":
        analysis = await analyzeMultiVariance(chartImage, currentPrice, timeframe);
        if (analysis) {
          analysis.analysisType = "تقلبات" as AnalysisType;
        }
        break;
      case "Composite Candlestick":
        analysis = await analyzeCompositeCandlestick(chartImage, currentPrice, timeframe);
        if (analysis) {
          analysis.analysisType = "نمطي" as AnalysisType;
        }
        break;
      case "Behavioral":
        analysis = await analyzeBehavioral(chartImage, currentPrice, timeframe);
        if (analysis) {
          analysis.analysisType = "حركة السعر" as AnalysisType;
        }
        break;
      default:
        analysis = await analyzeDailyChart(chartImage, currentPrice, timeframe);
    }
  }

  return analysis;
};
