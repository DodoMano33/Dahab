import { AnalysisData } from "@/types/analysis";
import { analyzeScalpingChart } from "@/components/chart/analysis/scalpingAnalysis";
import { analyzeSMCChart } from "@/components/chart/analysis/smcAnalysis";
import { analyzeICTChart } from "@/components/chart/analysis/ictAnalysis";
import { analyzeTurtleSoupChart } from "@/components/chart/analysis/turtleSoupAnalysis";
import { analyzeGannChart } from "@/components/chart/analysis/gannAnalysis";
import { analyzeWavesChart } from "@/components/chart/analysis/wavesAnalysis";
import { analyzePattern } from "@/utils/patternAnalysis";

export const combinedAnalysis = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  selectedTypes: string[]
): Promise<AnalysisData> => {
  console.log("Starting combined analysis with types:", selectedTypes);

  const analysisResults: AnalysisData[] = [];

  // Collect all analysis results
  for (const type of selectedTypes) {
    try {
      let result: AnalysisData;
      switch (type) {
        case "scalping":
          result = await analyzeScalpingChart(chartImage, currentPrice, timeframe);
          break;
        case "smc":
          result = await analyzeSMCChart(chartImage, currentPrice, timeframe);
          break;
        case "ict":
          result = await analyzeICTChart(chartImage, currentPrice, timeframe);
          break;
        case "turtleSoup":
          result = await analyzeTurtleSoupChart(chartImage, currentPrice, timeframe);
          break;
        case "gann":
          result = await analyzeGannChart(chartImage, currentPrice, timeframe);
          break;
        case "waves":
          result = await analyzeWavesChart(chartImage, currentPrice, timeframe);
          break;
        case "patterns":
          result = await analyzePattern(chartImage, currentPrice, timeframe);
          break;
      }
      analysisResults.push(result!);
    } catch (error) {
      console.error(`Error in ${type} analysis:`, error);
    }
  }

  // Combine the results
  const combinedResult: AnalysisData = {
    pattern: `تحليل مدمج (${selectedTypes.length} استراتيجيات)`,
    direction: calculateCombinedDirection(analysisResults),
    currentPrice,
    support: calculateAverageValue(analysisResults.map(r => r.support)),
    resistance: calculateAverageValue(analysisResults.map(r => r.resistance)),
    stopLoss: calculateAverageValue(analysisResults.map(r => r.stopLoss)),
    targets: combinedTargets(analysisResults),
    bestEntryPoint: {
      price: calculateAverageValue(analysisResults.map(r => r.bestEntryPoint?.price || 0)),
      reason: `نقطة دخول محسوبة بناءً على دمج ${selectedTypes.length} استراتيجيات مختلفة`
    },
    analysisType: "ذكي"
  };

  console.log("Combined analysis result:", combinedResult);
  return combinedResult;
};

const calculateCombinedDirection = (results: AnalysisData[]): "صاعد" | "هابط" | "محايد" => {
  const directions = results.map(r => r.direction);
  const upCount = directions.filter(d => d === "صاعد").length;
  const downCount = directions.filter(d => d === "هابط").length;
  
  if (upCount > downCount) return "صاعد";
  if (downCount > upCount) return "هابط";
  return "محايد";
};

const calculateAverageValue = (values: number[]): number => {
  return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
};

const combinedTargets = (results: AnalysisData[]): { price: number; expectedTime: Date; }[] => {
  const allTargets = results.flatMap(r => r.targets || []);
  if (allTargets.length === 0) return [];

  // Group targets by similar price levels
  const groupedTargets = allTargets.reduce((groups: any[], target) => {
    const existingGroup = groups.find(g => 
      Math.abs(g.price - target.price) / target.price < 0.01
    );
    
    if (existingGroup) {
      existingGroup.prices.push(target.price);
      existingGroup.times.push(target.expectedTime);
    } else {
      groups.push({
        prices: [target.price],
        times: [target.expectedTime]
      });
    }
    return groups;
  }, []);

  return groupedTargets.map(group => ({
    price: calculateAverageValue(group.prices),
    expectedTime: new Date(Math.max(...group.times.map(t => t.getTime())))
  }));
};