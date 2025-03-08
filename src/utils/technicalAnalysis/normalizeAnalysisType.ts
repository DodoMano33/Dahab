
/**
 * Utility for normalizing analysis type strings
 */

import { analysisTypeDisplayMap } from "./constants/analysisTypes";

/**
 * Normalize an analysis type string by removing spaces, underscores, and converting to lowercase
 */
export const normalizeAnalysisType = (type: string): string => {
  if (!type) {
    console.log("Empty analysis type provided for normalization");
    return "";
  }
  
  return typeof type === 'string' 
    ? type.toLowerCase().replace(/[_\s-]/g, '').trim() 
    : String(type).toLowerCase().trim();
};

/**
 * Get the display name for an analysis type
 */
export const getAnalysisDisplayName = (type: string): string => {
  if (!type) {
    console.log(`Display name lookup for empty type`);
    return "Unknown";
  }
  
  // Debug logging to help diagnose issues
  console.log(`Looking up display name for type: "${type}" (${typeof type})`);
  
  // Direct lookup first
  if (type in analysisTypeDisplayMap) {
    console.log(`Direct match found for "${type}": ${analysisTypeDisplayMap[type]}`);
    return analysisTypeDisplayMap[type];
  }
  
  // Handle different case formats and variations
  const normalizedType = normalizeAnalysisType(type);
  console.log(`Normalized type: "${normalizedType}"`);
  
  for (const key in analysisTypeDisplayMap) {
    const normalizedKey = key.toLowerCase().replace(/[_\s-]/g, '').trim();
    if (normalizedType === normalizedKey) {
      console.log(`Match found after normalization: "${type}" -> "${key}" -> ${analysisTypeDisplayMap[key]}`);
      return analysisTypeDisplayMap[key];
    }
  }
  
  // If no direct match, check for partial matches
  for (const key in analysisTypeDisplayMap) {
    const normalizedKey = key.toLowerCase().replace(/[_\s-]/g, '').trim();
    if (normalizedType.includes(normalizedKey) || normalizedKey.includes(normalizedType)) {
      console.log(`Partial match found: "${normalizedType}" matches "${normalizedKey}" -> ${analysisTypeDisplayMap[key]}`);
      return analysisTypeDisplayMap[key];
    }
  }
  
  // For debugging
  console.log(`No match found for analysis type: "${type}" (normalized: "${normalizedType}")`);
  
  // If no match at all, return the original type
  return type;
};
