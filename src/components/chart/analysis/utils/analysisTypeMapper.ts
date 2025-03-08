
/**
 * Re-export functions from the new modular files
 * This maintains backwards compatibility while allowing for a cleaner codebase
 */

import { mapToAnalysisType as mapType } from './mapAnalysisType';
import { mapAnalysisTypeToConfig as mapConfig } from './mapAnalysisConfig';
import { analysisTypeMap, VALID_ANALYSIS_TYPES } from './constants/analysisTypes';

// Re-export the functions for backward compatibility
export const mapToAnalysisType = mapType;
export const mapAnalysisTypeToConfig = mapConfig;

// Export other useful utilities
export { 
  isValidAnalysisType, 
  getNormalizedAnalysisType 
} from './mapAnalysisType';

export { 
  analysisTypeMap,
  VALID_ANALYSIS_TYPES
};
