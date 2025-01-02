import { AnalysisData } from "@/types/analysis";
import { analyzePattern } from "@/utils/patternAnalysis";
import { analyzeWavesChart } from "../wavesAnalysis";
import { analyzeGannChart } from "../gannAnalysis";
import { analyzeTurtleSoupChart } from "../turtleSoupAnalysis";
import { analyzeICTChart } from "../ictAnalysis";
import { analyzeSMCChart } from "../smcAnalysis";
import { analyzeScalpingChart } from "../scalpingAnalysis";

export const executeAnalysis = async (
  chartImage: string,
  providedPrice: number,
  timeframe: string,
  analysisFlags: {
    isPatternAnalysis: boolean;
    isWaves: boolean;
    isGann: boolean;
    isTurtleSoup: boolean;
    isICT: boolean;
    isSMC: boolean;
    isScalping: boolean;
  }
): Promise<AnalysisData | null> => {
  const {
    isPatternAnalysis,
    isWaves,
    isGann,
    isTurtleSoup,
    isICT,
    isSMC,
    isScalping
  } = analysisFlags;

  if (isPatternAnalysis) {
    console.log("بدء تحليل النمط مع البيانات:", { chartImage, providedPrice, timeframe });
    return await analyzePattern(chartImage, providedPrice, timeframe);
  }
  
  if (isWaves) return await analyzeWavesChart(chartImage, providedPrice, timeframe);
  if (isGann) return await analyzeGannChart(chartImage, providedPrice, timeframe);
  if (isTurtleSoup) return await analyzeTurtleSoupChart(chartImage, providedPrice, timeframe);
  if (isICT) return await analyzeICTChart(chartImage, providedPrice, timeframe);
  if (isSMC) return await analyzeSMCChart(chartImage, providedPrice, timeframe);
  if (isScalping) return await analyzeScalpingChart(chartImage, providedPrice, timeframe);

  return null;
};