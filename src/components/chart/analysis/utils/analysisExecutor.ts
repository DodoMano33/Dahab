import { AnalysisData } from "@/types/analysis";
import { analyzeSMCChart } from "../smcAnalysis";
import { analyzeICTChart } from "../ictAnalysis";
import { analyzeTurtleSoupChart } from "../turtleSoupAnalysis";
import { analyzeGannChart } from "../gannAnalysis";
import { analyzeWavesChart } from "../wavesAnalysis";
import { analyzePattern } from "../patternAnalysis";
import { analyzeDailyChart } from "../dailyAnalysis";
import { analyzeScalpingChart } from "../scalpingAnalysis";

interface AnalysisOptions {
  isPatternAnalysis: boolean;
  isWaves: boolean;
  isGann: boolean;
  isTurtleSoup: boolean;
  isICT: boolean;
  isSMC: boolean;
  isScalping: boolean;
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
    isScalping
  } = options;

  let selectedStrategies = [];
  if (isPatternAnalysis) selectedStrategies.push("Patterns");
  if (isWaves) selectedStrategies.push("Waves");
  if (isGann) selectedStrategies.push("Gann");
  if (isTurtleSoup) selectedStrategies.push("Turtle Soup");
  if (isICT) selectedStrategies.push("ICT");
  if (isSMC) selectedStrategies.push("SMC");
  if (isScalping) selectedStrategies.push("Scalping");

  let analysis: AnalysisData;

  if (selectedStrategies.length > 1) {
    // For combined analysis
    const promises = selectedStrategies.map(strategy => {
      switch (strategy) {
        case "Patterns": return analyzePattern(chartImage, currentPrice, timeframe);
        case "Waves": return analyzeWavesChart(chartImage, currentPrice, timeframe);
        case "Gann": return analyzeGannChart(chartImage, currentPrice, timeframe);
        case "Turtle Soup": return analyzeTurtleSoupChart(chartImage, currentPrice, timeframe);
        case "ICT": return analyzeICTChart(chartImage, currentPrice, timeframe);
        case "SMC": return analyzeSMCChart(chartImage, currentPrice, timeframe);
        case "Scalping": return analyzeScalpingChart(chartImage, currentPrice, timeframe);
        default: return analyzeDailyChart(chartImage, currentPrice, timeframe);
      }
    });

    const results = await Promise.all(promises);
    
    // Combine the results
    analysis = results[0]; // Start with the first analysis
    if (analysis.bestEntryPoint) {
      analysis.bestEntryPoint.reason = `Based on combining ${selectedStrategies.length} strategies (${selectedStrategies.join(', ')})`;
    }
    analysis.pattern = `Smart Analysis (${selectedStrategies.join(', ')})`;
    analysis.analysisType = "Smart"; // Set analysis type to Smart consistently
  } else {
    // For single strategy analysis
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
      default:
        analysis = await analyzeDailyChart(chartImage, currentPrice, timeframe);
    }
  }

  return analysis;
};