
import { AnalysisData } from "@/types/analysis";
import { toast } from "sonner";

// Import the analysis modules
import { analyzeSMCChart } from "@/components/chart/analysis/smcAnalysis";
import { analyzeICTChart } from "@/components/chart/analysis/ictAnalysis";
import { analyzeTurtleSoupChart } from "@/components/chart/analysis/turtleSoupAnalysis";
import { analyzeGannChart } from "@/components/chart/analysis/gannAnalysis";
import { analyzeWavesChart } from "@/components/chart/analysis/wavesAnalysis";
import { analyzePattern } from "@/components/chart/analysis/patternAnalysis";
import { analyzeDailyChart } from "@/components/chart/analysis/dailyAnalysis";
import { analyzeScalpingChart } from "@/components/chart/analysis/scalpingAnalysis";
import { analyzePriceAction } from "@/components/chart/analysis/priceActionAnalysis";
import { analyzeNeuralNetworkChart } from "@/components/chart/analysis/neuralNetworkAnalysis";
import { analyzeRNN } from "@/components/chart/analysis/rnnAnalysis";
import { analyzeTimeClustering } from "@/components/chart/analysis/timeClusteringAnalysis";
import { analyzeMultiVariance } from "@/components/chart/analysis/multiVarianceAnalysis";
import { analyzeCompositeCandlestick } from "@/components/chart/analysis/compositeCandlestickAnalysis";
import { analyzeBehavioral } from "@/components/chart/analysis/behavioralAnalysis";
import { analyzeFibonacciChart } from "@/components/chart/analysis/fibonacciAnalysis";
import { analyzeFibonacciAdvancedChart } from "@/components/chart/analysis/fibonacciAdvancedAnalysis";

// Execute a single analysis
export const executeAnalysis = async (
  type: string,
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  try {
    console.log(`Executing analysis of type: ${type} at price ${currentPrice} on timeframe ${timeframe}`);
    
    switch (type.toLowerCase()) {
      case 'pattern':
      case 'patterns':
        return await analyzePattern(chartImage, currentPrice, timeframe);
      
      case 'smc':
        return await analyzeSMCChart(chartImage, currentPrice, timeframe);
      
      case 'ict':
        return await analyzeICTChart(chartImage, currentPrice, timeframe);
      
      case 'turtlesoup':
        return await analyzeTurtleSoupChart(chartImage, currentPrice, timeframe);
      
      case 'gann':
        return await analyzeGannChart(chartImage, currentPrice, timeframe);
      
      case 'waves':
        return await analyzeWavesChart(chartImage, currentPrice, timeframe);
      
      case 'priceaction':
        return await analyzePriceAction(chartImage, currentPrice, timeframe);
      
      case 'fibonacci':
        return await analyzeFibonacciChart(chartImage, currentPrice, timeframe);
      
      case 'fibonacciadvanced':
        return await analyzeFibonacciAdvancedChart(chartImage, currentPrice, timeframe);
      
      case 'neuralnetwork':
        return await analyzeNeuralNetworkChart(chartImage, currentPrice, timeframe);
      
      case 'rnn':
        return await analyzeRNN(chartImage, currentPrice, timeframe);
      
      case 'timeclustering':
        return await analyzeTimeClustering(chartImage, currentPrice, timeframe);
      
      case 'multivariance':
        return await analyzeMultiVariance(chartImage, currentPrice, timeframe);
      
      case 'compositecandlestick':
        return await analyzeCompositeCandlestick(chartImage, currentPrice, timeframe);
      
      case 'behavioral':
        return await analyzeBehavioral(chartImage, currentPrice, timeframe);
      
      case 'scalping':
        return await analyzeScalpingChart(chartImage, currentPrice, timeframe);
      
      default:
        console.log(`Unknown analysis type: ${type}, using daily analysis as fallback`);
        return await analyzeDailyChart(chartImage, currentPrice, timeframe);
    }
  } catch (error) {
    console.error(`Error in ${type} analysis:`, error);
    toast.error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

// Execute multiple analyses in parallel
export const executeMultipleAnalyses = async (
  types: string[],
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData[]> => {
  console.log(`Executing ${types.length} analyses: ${types.join(', ')}`);
  
  const analysisPromises = types.map(type => 
    executeAnalysis(type, chartImage, currentPrice, timeframe)
      .catch(err => {
        console.error(`Failed to execute ${type} analysis:`, err);
        return null; // Return null for failed analyses
      })
  );
  
  const results = await Promise.all(analysisPromises);
  
  // Filter out null results (failed analyses)
  return results.filter(result => result !== null) as AnalysisData[];
};
