
/**
 * Utility for getting strategy names from analysis types
 */

import { getAnalysisDisplayName } from "./normalizeAnalysisType";

/**
 * Get a formatted display name for an analysis type
 */
export const getStrategyName = (type: string): string => {
  return getAnalysisDisplayName(type);
};
