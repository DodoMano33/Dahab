
import { supabase } from "@/lib/supabase";
import { AnalysisType, AnalysisData } from "@/types/analysis";
import { toast } from "sonner";

interface SaveAnalysisParams {
  userId: string;
  symbol: string;
  currentPrice: number;
  analysisResult: AnalysisData;
  analysisType: AnalysisType;
  timeframe: string;
  durationHours?: number;
}

export const saveAnalysis = async ({
  userId,
  symbol,
  currentPrice,
  analysisResult,
  analysisType,
  timeframe,
  durationHours = 8
}: SaveAnalysisParams) => {
  // Validate required fields
  if (!userId || !symbol || !currentPrice || !analysisResult || !analysisType || !timeframe) {
    console.error("Missing required fields:", { userId, symbol, currentPrice, analysisResult, analysisType, timeframe });
    throw new Error("All fields are required for saving analysis");
  }

  // Validate analysis result structure
  if (!analysisResult.pattern || !analysisResult.direction || !analysisResult.stopLoss) {
    console.error("Invalid analysis result structure:", analysisResult);
    throw new Error("Invalid analysis results");
  }

  // Map Fibonacci analysis types to valid database values
  let validAnalysisType = analysisType;
  const analysisTypeStr = String(analysisType).toLowerCase();
  
  if (
    analysisTypeStr === "fibonacci" || 
    analysisTypeStr === "fibonacci advanced" || 
    analysisTypeStr === "fibonacci_advanced"
  ) {
    validAnalysisType = "Fibonacci" as AnalysisType;
  }

  // Ensure analysisType is a valid value for the database
  console.log("Original analysis type:", analysisType);
  console.log("Mapped analysis type being saved to database:", validAnalysisType);

  // Make sure the analysis result also has the correct analysis type
  if (analysisResult.analysisType !== validAnalysisType) {
    console.log("Updating analysis result type from", analysisResult.analysisType, "to", validAnalysisType);
    analysisResult.analysisType = validAnalysisType;
  }

  // Set automatic activation type for Fibonacci Advanced Analysis
  if (!analysisResult.activation_type) {
    if (analysisResult.pattern === "Fibonacci Advanced Analysis") {
      analysisResult.activation_type = "manual";
    } else if (analysisResult.pattern === "Fibonacci Retracement and Extension") {
      analysisResult.activation_type = "auto";
    }
  }

  console.log("Inserting analysis data with duration:", durationHours, {
    user_id: userId,
    symbol,
    current_price: currentPrice,
    analysis: analysisResult,
    analysis_type: validAnalysisType,
    timeframe,
    analysis_duration_hours: durationHours
  });

  const { data, error } = await supabase
    .from('search_history')
    .insert({
      user_id: userId,
      symbol,
      current_price: currentPrice,
      analysis: analysisResult,
      analysis_type: validAnalysisType,
      timeframe,
      analysis_duration_hours: durationHours
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error saving to Supabase:", error);
    throw error;
  }

  return data;
};
