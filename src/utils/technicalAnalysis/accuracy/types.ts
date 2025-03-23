
/**
 * Shared types for analysis accuracy modules
 */

export interface DirectionAccuracyResult {
  accuracy: number;
  totalAnalyses: number;
  correctPredictions: number;
  detailedStats: {
    [timeframe: string]: {
      accuracy: number;
      totalAnalyses: number;
      correctPredictions: number;
    }
  }
}

export interface TimeToTargetResult {
  averageTimeToFirstTarget: number;
  averageTimeToLastTarget: number;
  timeframeStats: {
    [timeframe: string]: {
      averageTimeToFirstTarget: number;
      averageTimeToLastTarget: number;
    }
  }
}

export interface StopLossRateResult {
  stopLossRate: number;
  totalAnalyses: number;
  stopLossHits: number;
  timeframeStats: {
    [timeframe: string]: {
      stopLossRate: number;
      totalAnalyses: number;
      stopLossHits: number;
    }
  }
}

export interface AnalysisPerformanceResult {
  overallScore: number;
  directionAccuracy: number;
  targetHitRate: number;
  stopLossRate: number;
  averageTimeToTarget: number;
  recommendedTimeframes: string[];
  recommendedSymbols: string[];
  weaknesses: string[];
  strengths: string[];
}
