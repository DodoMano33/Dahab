
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { supabase } from "@/lib/supabase";

// Types for saving analysis
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
  console.log("Saving analysis to database:", {
    userId,
    symbol,
    currentPrice,
    analysisType,
    timeframe,
    durationHours
  });

  // Calculate expiry time from duration in hours
  const now = new Date();
  const expiryTime = new Date(now.getTime() + durationHours * 60 * 60 * 1000);

  try {
    // Create the insert data object
    const insertData = {
      user_id: userId,
      symbol: symbol,
      current_price: currentPrice,
      analysis_type: analysisType,
      timeframe: timeframe,
      analysis_expiry_date: expiryTime,
      analysis_duration_hours: durationHours,
      activation_type: analysisResult.activation_type || "تلقائي",
      analysis: analysisResult // Store the full analysis object
    };

    const { data, error } = await supabase
      .from("search_history")
      .insert([insertData])
      .select();

    if (error) {
      console.error("Error saving analysis:", error);
      throw new Error("Failed to save analysis to database");
    }

    console.log("Analysis saved successfully:", data);
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error in saveAnalysis:", error);
    throw error;
  }
};
