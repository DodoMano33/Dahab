
import { AnalysisType, AnalysisData } from "@/types/analysis";
import { analyzeMLChart } from "../../ml/basicMLAnalysis";
import { advancedNeuralNetworkAnalysis } from "../../ml/advancedMLAnalysis";
import { analyzeMultiVariance } from "../../multiVarianceAnalysis";
import { analyzeICTChart } from "../../ictAnalysis";
import { analyzeSMCChart } from "../../smcAnalysis";
import { analyzeTurtleSoupChart } from "../../turtleSoupAnalysis";
import { analyzeGannChart } from "../../gannAnalysis";
import { analyzePattern } from "../../patternAnalysis";
import { analyzeWavesChart } from "../../wavesAnalysis";
import { analyzePriceAction } from "../../priceActionAnalysis";
import { analyzeTimeClustering } from "../../timeClusteringAnalysis";
import { analyzeNeuralNetworkChart } from "../../neuralNetworkAnalysis";
import { analyzeRNN } from "../../rnnAnalysis";
import { analyzeCompositeCandlestick } from "../../compositeCandlestickAnalysis";
import { analyzeBehavioral } from "../../behavioralAnalysis";
import { analyzeScalpingChart } from "../../scalpingAnalysis";
import { analyzeFibonacciChart } from "../../fibonacciAnalysis";
import { analyzeFibonacciAdvancedChart } from "../../fibonacciAdvancedAnalysis";

/**
 * Execute the appropriate analysis based on the analysis type
 */
export const executeAnalysisBasedOnType = async (
  analysisType: string,
  chartImage: string, 
  providedPrice: number, 
  timeframe: string
): Promise<AnalysisData> => {
  console.log(`Executing analysis for type: ${analysisType}`);
  
  switch (analysisType.toLowerCase()) {
    case "smart":
    case "ذكي":
      return await advancedNeuralNetworkAnalysis(chartImage || "", providedPrice, timeframe);
    case "scalping":
    case "سكالبينج":
    case "مضاربة":
      return await analyzeScalpingChart(chartImage || "", providedPrice, timeframe);
    case "smc":
      return await analyzeSMCChart(chartImage || "", providedPrice, timeframe);
    case "ict":
      return await analyzeICTChart(chartImage || "", providedPrice, timeframe);
    case "turtle soup":
    case "الحساء السلحفائي":
      return await analyzeTurtleSoupChart(chartImage || "", providedPrice, timeframe);
    case "gann":
    case "جان":
      return await analyzeGannChart(chartImage || "", providedPrice, timeframe);
    case "waves":
    case "موجات":
      return await analyzeWavesChart(chartImage || "", providedPrice, timeframe);
    case "patterns":
    case "أنماط":
    case "نمطي":
      return await analyzePattern(chartImage || "", providedPrice, timeframe);
    case "price action":
    case "حركة السعر":
      return await analyzePriceAction(chartImage || "", providedPrice, timeframe);
    case "neural network":
    case "شبكات عصبية":
      return await analyzeNeuralNetworkChart(chartImage || "", providedPrice, timeframe);
    case "rnn":
    case "شبكات عصبية متكررة":
      return await analyzeRNN(chartImage || "", providedPrice, timeframe);
    case "time clustering":
    case "تصفيق زمني":
      return await analyzeTimeClustering(chartImage || "", providedPrice, timeframe);
    case "multi variance":
    case "تباين متعدد العوامل":
      return await analyzeMultiVariance(chartImage || "", providedPrice, timeframe);
    case "composite candlestick":
    case "شمعات مركبة":
      return await analyzeCompositeCandlestick(chartImage || "", providedPrice, timeframe);
    case "behavioral":
    case "تحليل سلوكي":
      return await analyzeBehavioral(chartImage || "", providedPrice, timeframe);
    case "fibonacci":
    case "فيبوناتشي":
      return await analyzeFibonacciChart(chartImage || "", providedPrice, timeframe);
    case "fibonacci_advanced":
    case "fibonacci advanced":
    case "فيبوناتشي متقدم":
      return await analyzeFibonacciAdvancedChart(chartImage || "", providedPrice, timeframe);
    default:
      return await analyzeMLChart(chartImage || "", providedPrice, timeframe);
  }
};
