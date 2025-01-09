import { AnalysisData } from "@/types/analysis";
import { analyzeSMCChart } from "../smcAnalysis";
import { analyzeICTChart } from "../ictAnalysis";
import { analyzeTurtleSoupChart } from "../turtleSoupAnalysis";
import { analyzeGannChart } from "../gannAnalysis";
import { analyzeWavesChart } from "../wavesAnalysis";
import { analyzePattern } from "@/utils/patternAnalysis";
import { analyzeDailyChart } from "../dailyAnalysis";
import { analyzeScalpingChart } from "../scalpingAnalysis";
import { analyzePriceAction } from "../priceActionAnalysis";

interface AnalysisOptions {
  isPatternAnalysis: boolean;
  isWaves: boolean;
  isGann: boolean;
  isTurtleSoup: boolean;
  isICT: boolean;
  isSMC: boolean;
  isScalping: boolean;
  isPriceAction: boolean;
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
    isPriceAction
  } = options;

  let selectedStrategies = [];
  if (isPatternAnalysis) selectedStrategies.push("Patterns");
  if (isWaves) selectedStrategies.push("Waves");
  if (isGann) selectedStrategies.push("Gann");
  if (isTurtleSoup) selectedStrategies.push("Turtle Soup");
  if (isICT) selectedStrategies.push("ICT");
  if (isSMC) selectedStrategies.push("SMC");
  if (isScalping) selectedStrategies.push("سكالبينج");
  if (isPriceAction) selectedStrategies.push("Price Action");

  let analysis: AnalysisData;

  // Handle each analysis type separately
  if (isPatternAnalysis) {
    analysis = await analyzePattern(chartImage, currentPrice, timeframe);
  } else if (isWaves) {
    analysis = await analyzeWavesChart(chartImage, currentPrice, timeframe);
  } else if (isGann) {
    analysis = await analyzeGannChart(chartImage, currentPrice, timeframe);
  } else if (isTurtleSoup) {
    analysis = await analyzeTurtleSoupChart(chartImage, currentPrice, timeframe);
  } else if (isICT) {
    analysis = await analyzeICTChart(chartImage, currentPrice, timeframe);
  } else if (isSMC) {
    analysis = await analyzeSMCChart(chartImage, currentPrice, timeframe);
  } else if (isScalping) {
    analysis = await analyzeScalpingChart(chartImage, currentPrice, timeframe);
  } else if (isPriceAction) {
    analysis = await analyzePriceAction(chartImage, currentPrice, timeframe);
  } else {
    analysis = await analyzeDailyChart(chartImage, currentPrice, timeframe);
  }

  // Set the analysis type based on the selected strategy
  if (selectedStrategies.length === 1) {
    analysis.analysisType = selectedStrategies[0] as AnalysisData['analysisType'];
    analysis.activation_type = "يدوي";
  }

  return analysis;
};