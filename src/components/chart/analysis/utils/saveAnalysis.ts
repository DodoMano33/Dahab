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
    // Fix comparisons by directly checking with string literals instead of comparing with AnalysisType
    let pattern = analysisResult.pattern;
    let activation_type = analysisResult.activation_type || "تلقائي";
    
    // Special handling for fibonacci types
    if (analysisType === "fibonacci_advanced" as AnalysisType) {
      pattern = "تحليل فيبوناتشي متقدم";
    } else if (analysisType === "fibonacci" as AnalysisType) {
      pattern = "تحليل فيبوناتشي";
    }

    const { data, error } = await supabase
      .from("search_history")
      .insert([
        {
          user_id: userId,
          symbol: symbol,
          date: new Date(),
          current_price: currentPrice,
          pattern: pattern,
          direction: analysisResult.direction,
          support: analysisResult.support,
          resistance: analysisResult.resistance,
          stop_loss: analysisResult.stopLoss,
          best_entry_point_price: analysisResult.bestEntryPoint?.price,
          best_entry_point_reason: analysisResult.bestEntryPoint?.reason,
          targets: analysisResult.targets,
          activation_type: activation_type,
          analysis_type: analysisType,
          timeframe: timeframe,
          expiry_time: expiryTime,
        }
      ])
      .select()

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
