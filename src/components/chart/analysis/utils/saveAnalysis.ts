
import { supabase } from "@/lib/supabase";
import { AnalysisType, AnalysisData } from "@/types/analysis";
import { toast } from "sonner";
import { convertActivationTypeToEnglish } from "@/utils/directionConverter";

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
    throw new Error("All fields are required to save the analysis");
  }

  // Validate analysis result structure
  if (!analysisResult.pattern || !analysisResult.direction || !analysisResult.stopLoss) {
    console.error("Invalid analysis result structure:", analysisResult);
    throw new Error("Invalid analysis results");
  }

  // Ensure analysisType is a valid value for the database
  console.log("Original analysis type:", analysisType);
  
  // Ensure the activation_type is in English
  if (analysisResult.activation_type) {
    const activationType = analysisResult.activation_type;
    
    if (activationType === "يدوي" || activationType === "تلقائي") {
      analysisResult.activation_type = convertActivationTypeToEnglish(activationType);
    }
  }
  
  // Set automatic activation type for different analysis types if not set
  if (!analysisResult.activation_type) {
    if (analysisResult.pattern === "Advanced Fibonacci Analysis") {
      analysisResult.activation_type = "Manual";
    } else if (analysisResult.pattern === "Fibonacci Retracement & Extension") {
      analysisResult.activation_type = "Automatic";
    }
  }

  console.log("Inserting analysis data with duration:", durationHours, {
    user_id: userId,
    symbol,
    current_price: currentPrice,
    analysis: analysisResult,
    analysis_type: analysisType,
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
      analysis_type: analysisType,
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
