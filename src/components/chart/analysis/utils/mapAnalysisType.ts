
import { analysisTypeMap, ValidAnalysisType, VALID_ANALYSIS_TYPES } from "./constants/analysisTypes";

/**
 * Maps analysis type names to valid database enum values
 */
export const mapToAnalysisType = (analysisType: string): ValidAnalysisType => {
  // Early exit if the input is empty
  if (!analysisType) {
    console.log("Empty analysis type provided, defaulting to Normal");
    return "Normal";
  }
  
  // Log the original analysis type for debugging
  console.log("Mapping analysis type from:", analysisType);
  
  // Special cases - if it's directly one of SMC or Scalping, return immediately
  if (analysisType === "SMC" || analysisType === "Scalping") {
    console.log(`Analysis type "${analysisType}" is already valid`);
    return analysisType as ValidAnalysisType;
  }
  
  // Check if it's already a valid type (array-based approach for exact match)
  if (VALID_ANALYSIS_TYPES.includes(analysisType as ValidAnalysisType)) {
    console.log(`Analysis type "${analysisType}" is already valid`);
    return analysisType as ValidAnalysisType;
  }
  
  // Normalize the analysis type by removing spaces, underscores, and converting to lowercase
  const normalizedType = analysisType.toLowerCase().replace(/[_\s-]/g, "");
  
  // Direct lookup first - most efficient path
  if (normalizedType in analysisTypeMap) {
    console.log(`Found direct match for "${normalizedType}": ${analysisTypeMap[normalizedType]}`);
    return analysisTypeMap[normalizedType];
  }
  
  // Try to find a match after normalization
  for (const key in analysisTypeMap) {
    const normalizedKey = key.toLowerCase().replace(/[_\s-]/g, "");
    if (normalizedType === normalizedKey) {
      console.log(`Found match after normalization: "${normalizedType}" -> "${key}" -> ${analysisTypeMap[key]}`);
      return analysisTypeMap[key];
    }
  }
  
  // Try partial matches as a fallback
  for (const key in analysisTypeMap) {
    const normalizedKey = key.toLowerCase().replace(/[_\s-]/g, "");
    if (normalizedType.includes(normalizedKey) || normalizedKey.includes(normalizedType)) {
      console.log(`Found partial match: "${normalizedType}" matches "${normalizedKey}" -> ${analysisTypeMap[key]}`);
      return analysisTypeMap[key];
    }
  }
  
  // If no match found, log and return a default value
  console.warn(`Unknown analysis type "${analysisType}", defaulting to "Normal"`);
  return "Normal";
};

/**
 * Validates if a string is a valid analysis type according to database constraints
 */
export const isValidAnalysisType = (type: string): boolean => {
  return VALID_ANALYSIS_TYPES.includes(type as ValidAnalysisType);
};

/**
 * Gets the normalized analysis type, ensuring it matches one of the valid database values
 */
export const getNormalizedAnalysisType = (type: string): ValidAnalysisType => {
  if (!type) return "Normal";
  
  if (isValidAnalysisType(type)) {
    return type as ValidAnalysisType;
  }
  
  return mapToAnalysisType(type);
};
