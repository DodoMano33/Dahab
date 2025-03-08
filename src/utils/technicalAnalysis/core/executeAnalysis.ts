
/**
 * Core analysis execution module
 */

import { AnalysisData } from "@/types/analysis";
import { normalizeAnalysisType } from "../normalizeAnalysisType";
import { executePriceBasedAnalysis } from "./executors/executePriceBasedAnalysis";
import { executePatternBasedAnalysis } from "./executors/executePatternBasedAnalysis";
import { executeFibonacciBasedAnalysis } from "./executors/executeFibonacciBasedAnalysis";
import { executeMachineLearningAnalysis } from "./executors/executeMachineLearningAnalysis";
import { executeAdvancedAnalysis } from "./executors/executeAdvancedAnalysis";
import { analysisCategoryMap } from "../constants/analysisTypes";

/**
 * Execute a specific analysis based on the given type
 */
export const executeSpecificAnalysis = async (
  type: string,
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log(`Executing specific analysis for type: ${type}`);
  
  // Normalize the type for switching
  const normalizedType = normalizeAnalysisType(type);
  console.log(`Normalized type for analysis: ${normalizedType}`);
  
  // Determine the category of analysis
  const category = analysisCategoryMap[normalizedType] || "pattern-based";
  console.log(`Analysis category: ${category}`);
  
  // Execute the appropriate analysis based on category
  switch (category) {
    case "price-based":
      return executePriceBasedAnalysis(normalizedType, chartImage, currentPrice, timeframe);
      
    case "pattern-based":
      return executePatternBasedAnalysis(normalizedType, chartImage, currentPrice, timeframe);
      
    case "fibonacci-based":
      return executeFibonacciBasedAnalysis(normalizedType, chartImage, currentPrice, timeframe);
      
    case "machine-learning":
      return executeMachineLearningAnalysis(normalizedType, chartImage, currentPrice, timeframe);
      
    case "advanced-analysis":
      return executeAdvancedAnalysis(normalizedType, chartImage, currentPrice, timeframe);
      
    default:
      console.log(`Unknown analysis category, defaulting to pattern-based analysis for type: ${normalizedType}`);
      return executePatternBasedAnalysis("daily", chartImage, currentPrice, timeframe);
  }
};

/**
 * Execute multiple analyses in parallel
 */
export const executeMultipleAnalyses = async (
  types: string[],
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData[]> => {
  console.log("Executing multiple analyses for types:", types);
  
  const promises = types.map(type => 
    executeSpecificAnalysis(type, chartImage, currentPrice, timeframe)
  );
  
  try {
    return await Promise.all(promises);
  } catch (error) {
    console.error("Error in multiple analyses execution:", error);
    return [];
  }
};
