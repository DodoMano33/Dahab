
import { AnalysisData } from "@/types/analysis";
import { convertArabicDirectionToEnglish } from "@/utils/directionConverter";

// Calculate the most common direction across all analyses
export const calculateCombinedDirection = (analyses: AnalysisData[]): string => {
  let upCount = 0;
  let downCount = 0;
  
  for (const analysis of analyses) {
    const direction = analysis.direction;
    if (direction === "Up" || direction === "صاعد") upCount++;
    if (direction === "Down" || direction === "هابط") downCount++;
  }
  
  if (upCount > downCount) return "Up";
  if (downCount > upCount) return "Down";
  return "Neutral";
};

// Calculate weighted averages for support, resistance, stop loss, and entry price
export const calculateWeightedValues = (analyses: AnalysisData[]) => {
  if (!analyses.length) {
    throw new Error("No analysis results to calculate weighted values");
  }
  
  // Assign weights based on analysis types
  const weights = analyses.map(analysis => {
    // Higher weights for more sophisticated analyses
    if (analysis.analysisType === "Neural Network" || 
        analysis.analysisType === "RNN") return 1.5;
    if (analysis.analysisType === "ICT" || 
        analysis.analysisType === "SMC") return 1.3;
    if (analysis.analysisType === "Fibonacci" || 
        analysis.analysisType === "Fibonacci Advanced") return 1.2;
    return 1.0; // Default weight
  });
  
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  
  // Calculate weighted averages
  let support = 0;
  let resistance = 0;
  let stopLoss = 0;
  let entryPrice = 0;
  
  analyses.forEach((analysis, index) => {
    const weight = weights[index] / totalWeight;
    support += analysis.support * weight;
    resistance += analysis.resistance * weight;
    stopLoss += analysis.stopLoss * weight;
    
    if (analysis.bestEntryPoint && analysis.bestEntryPoint.price) {
      entryPrice += analysis.bestEntryPoint.price * weight;
    }
  });
  
  return {
    support: Number(support.toFixed(2)),
    resistance: Number(resistance.toFixed(2)),
    stopLoss: Number(stopLoss.toFixed(2)),
    entryPrice: Number(entryPrice.toFixed(2))
  };
};

// Combine and sort targets from all analyses
export const combineAndSortTargets = (analyses: AnalysisData[]) => {
  const allTargets = analyses.flatMap(analysis => 
    analysis.targets?.map(target => ({
      ...target,
      source: analysis.analysisType
    })) || []
  );
  
  // Group targets by expected time range (same day, 1-3 days, 4+ days)
  const now = new Date();
  const targetGroups: any = {
    shortTerm: [],
    mediumTerm: [],
    longTerm: []
  };
  
  allTargets.forEach(target => {
    const targetTime = new Date(target.expectedTime);
    const daysDiff = Math.floor((targetTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 1) {
      targetGroups.shortTerm.push(target);
    } else if (daysDiff < 4) {
      targetGroups.mediumTerm.push(target);
    } else {
      targetGroups.longTerm.push(target);
    }
  });
  
  // Select representative targets from each group
  const combinedTargets = [];
  
  if (targetGroups.shortTerm.length) {
    const shortTermTarget = targetGroups.shortTerm.reduce((acc: any, curr: any) => 
      (!acc || curr.price > acc.price) ? curr : acc, null);
    combinedTargets.push(shortTermTarget);
  }
  
  if (targetGroups.mediumTerm.length) {
    const mediumTermTarget = targetGroups.mediumTerm.reduce((acc: any, curr: any) => 
      (!acc || curr.price > acc.price) ? curr : acc, null);
    combinedTargets.push(mediumTermTarget);
  }
  
  if (targetGroups.longTerm.length) {
    const longTermTarget = targetGroups.longTerm.reduce((acc: any, curr: any) => 
      (!acc || curr.price > acc.price) ? curr : acc, null);
    combinedTargets.push(longTermTarget);
  }
  
  // Sort by expected time
  return combinedTargets
    .sort((a, b) => new Date(a.expectedTime).getTime() - new Date(b.expectedTime).getTime())
    .map(target => ({
      price: target.price,
      expectedTime: target.expectedTime
    }));
};
