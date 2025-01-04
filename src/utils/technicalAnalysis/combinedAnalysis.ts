import { AnalysisData } from "@/types/analysis";
import { analyzeScalpingChart } from "@/components/chart/analysis/scalpingAnalysis";
import { analyzeSMCChart } from "@/components/chart/analysis/smcAnalysis";
import { analyzeICTChart } from "@/components/chart/analysis/ictAnalysis";
import { analyzeTurtleSoupChart } from "@/components/chart/analysis/turtleSoupAnalysis";
import { analyzeGannChart } from "@/components/chart/analysis/gannAnalysis";
import { analyzeWavesChart } from "@/components/chart/analysis/wavesAnalysis";
import { analyzePattern } from "@/utils/patternAnalysis";
import { analyzePriceAction } from "@/components/chart/analysis/priceActionAnalysis";

const getStrategyName = (type: string): string => {
  switch (type) {
    case "scalping": return "Scalping";
    case "smc": return "SMC";
    case "ict": return "ICT";
    case "turtleSoup": return "Turtle Soup";
    case "gann": return "Gann";
    case "waves": return "Waves";
    case "patterns": return "Patterns";
    case "priceAction": return "Price Action";
    default: return type;
  }
};

export const combinedAnalysis = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  selectedTypes: string[]
): Promise<AnalysisData> => {
  console.log("Starting combined analysis with types:", selectedTypes);

  const analysisResults: AnalysisData[] = [];
  const strategyNames = selectedTypes.map(getStrategyName);

  // Collect analysis results from each strategy
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
        case "priceAction":
          result = await analyzePriceAction(chartImage, currentPrice, timeframe);
          break;
      }
      if (result) analysisResults.push(result);
    } catch (error) {
      console.error(`Error in ${type} analysis:`, error);
    }
  }

  // Calculate weighted averages for important values
  const weightedValues = analysisResults.reduce((acc, result, index) => {
    const weight = (analysisResults.length - index) / analysisResults.length;
    return {
      support: acc.support + (result.support * weight),
      resistance: acc.resistance + (result.resistance * weight),
      stopLoss: acc.stopLoss + (result.stopLoss * weight),
      entryPrice: acc.entryPrice + ((result.bestEntryPoint?.price || currentPrice) * weight),
      totalWeight: acc.totalWeight + weight
    };
  }, { support: 0, resistance: 0, stopLoss: 0, entryPrice: 0, totalWeight: 0 });

  // Determine direction based on combined analysis
  const direction = calculateCombinedDirection(analysisResults);

  // Combine and sort targets
  const combinedTargets = combineAndSortTargets(analysisResults);

  const combinedResult: AnalysisData = {
    pattern: `Smart Analysis (${strategyNames.join(', ')})`,
    direction,
    currentPrice,
    support: Number((weightedValues.support / weightedValues.totalWeight).toFixed(2)),
    resistance: Number((weightedValues.resistance / weightedValues.totalWeight).toFixed(2)),
    stopLoss: Number((weightedValues.stopLoss / weightedValues.totalWeight).toFixed(2)),
    targets: combinedTargets.slice(0, 3),
    bestEntryPoint: {
      price: Number((weightedValues.entryPrice / weightedValues.totalWeight).toFixed(2)),
      reason: `Based on combining ${selectedTypes.length} strategies (${strategyNames.join(', ')})`
    },
    analysisType: "Smart"
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

const combineAndSortTargets = (results: AnalysisData[]): { price: number; expectedTime: Date; }[] => {
  const allTargets = results.flatMap(r => r.targets || []);
  
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

  return groupedTargets
    .map(group => ({
      price: Number((group.prices.reduce((a: number, b: number) => a + b, 0) / group.prices.length).toFixed(2)),
      expectedTime: new Date(Math.max(...group.times.map((t: Date) => t.getTime())))
    }))
    .sort((a, b) => Math.abs(a.price) - Math.abs(b.price));
};