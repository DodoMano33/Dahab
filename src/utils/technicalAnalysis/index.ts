
/**
 * Re-export technical analysis utilities
 */

// Core analysis executors
export { executeSpecificAnalysis, executeMultipleAnalyses } from './core/executeAnalysis';

// Type normalization and display
export { normalizeAnalysisType, getAnalysisDisplayName } from './normalizeAnalysisType';

// Export other utility functions from calculations explicitly
export { 
  calculateTargets,
  calculateStopLoss,
  calculateSupportResistance,
  calculateBestEntryPoint,
  detectTrend
} from './calculations';

// Export from fibonacci with a renamed function to avoid conflicts
export { 
  calculateFibonacciLevels as calculateFibLevels,
  findOptimalFibonacciEntry,
  calculateFibonacciTargets
} from './fibonacci';

// Re-export the calculations version as the main version
export { calculateFibonacciLevels } from './calculations';

// Export remaining utility functions
export * from './timeframeMultipliers';
export * from './timeUtils';
export * from './combinedAnalysis';
