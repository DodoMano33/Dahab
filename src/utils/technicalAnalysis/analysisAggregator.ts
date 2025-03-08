
import { AnalysisData } from "@/types/analysis";

/**
 * Calculate combined direction from multiple analysis results
 */
export const calculateCombinedDirection = (results: AnalysisData[]): "صاعد" | "هابط" | "محايد" => {
  if (!results.length) return "محايد";
  
  const directions = results.map(r => r.direction);
  const upCount = directions.filter(d => d === "صاعد").length;
  const downCount = directions.filter(d => d === "هابط").length;
  
  if (upCount > downCount) return "صاعد";
  if (downCount > upCount) return "هابط";
  return "محايد";
};

/**
 * Combine and sort targets from multiple analyses
 */
export const combineAndSortTargets = (results: AnalysisData[]): { price: number; expectedTime: Date; }[] => {
  const allTargets = results.flatMap(r => r.targets || []);
  if (!allTargets.length) return [];
  
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

/**
 * Calculate weighted averages for important values
 */
export const calculateWeightedValues = (results: AnalysisData[]): {
  support: number;
  resistance: number;
  stopLoss: number;
  entryPrice: number;
} => {
  if (!results.length) {
    return { support: 0, resistance: 0, stopLoss: 0, entryPrice: 0 };
  }
  
  const weightedValues = results.reduce((acc, result, index) => {
    const weight = (results.length - index) / results.length;
    return {
      support: acc.support + (result.support * weight),
      resistance: acc.resistance + (result.resistance * weight),
      stopLoss: acc.stopLoss + (result.stopLoss * weight),
      entryPrice: acc.entryPrice + ((result.bestEntryPoint?.price || result.currentPrice) * weight),
      totalWeight: acc.totalWeight + weight
    };
  }, { support: 0, resistance: 0, stopLoss: 0, entryPrice: 0, totalWeight: 0 });

  return {
    support: Number((weightedValues.support / weightedValues.totalWeight).toFixed(2)),
    resistance: Number((weightedValues.resistance / weightedValues.totalWeight).toFixed(2)),
    stopLoss: Number((weightedValues.stopLoss / weightedValues.totalWeight).toFixed(2)),
    entryPrice: Number((weightedValues.entryPrice / weightedValues.totalWeight).toFixed(2))
  };
};
