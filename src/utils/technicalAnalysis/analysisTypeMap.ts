
import { analysisTypeMap } from "@/components/chart/analysis/utils/constants/analysisTypes";

/**
 * Get a formatted display name for an analysis type
 */
export const getStrategyName = (type: string): string => {
  if (!type) {
    console.log(`Strategy name lookup for empty type`);
    return "Unknown";
  }
  
  // Debug logging to help diagnose issues
  console.log(`Looking up strategy name for type: "${type}" (${typeof type})`);
  
  // Direct lookup first
  if (type in analysisTypeMap) {
    console.log(`Direct match found for "${type}": ${analysisTypeMap[type]}`);
    return analysisTypeMap[type];
  }
  
  // Handle different case formats and variations
  const normalizedType = typeof type === 'string' 
    ? type.toLowerCase().replace(/_/g, '').trim() 
    : String(type).toLowerCase().trim();
    
  console.log(`Normalized type: "${normalizedType}"`);
  
  for (const key in analysisTypeMap) {
    const normalizedKey = key.toLowerCase().replace(/_/g, '').trim();
    if (normalizedType === normalizedKey) {
      console.log(`Match found after normalization: "${type}" -> "${key}" -> ${analysisTypeMap[key]}`);
      return analysisTypeMap[key];
    }
  }
  
  // If no direct match, check for partial matches
  for (const key in analysisTypeMap) {
    const normalizedKey = key.toLowerCase().replace(/_/g, '').trim();
    if (normalizedType.includes(normalizedKey) || normalizedKey.includes(normalizedType)) {
      console.log(`Partial match found: "${normalizedType}" matches "${normalizedKey}" -> ${analysisTypeMap[key]}`);
      return analysisTypeMap[key];
    }
  }
  
  // For debugging
  console.log(`No match found for analysis type: "${type}" (normalized: "${normalizedType}")`);
  
  // If no match at all, return the original type
  return type;
};
