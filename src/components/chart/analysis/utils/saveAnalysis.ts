
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
    throw new Error("جميع الحقول مطلوبة لحفظ التحليل");
  }

  // Validate analysis result structure
  if (!analysisResult.pattern || !analysisResult.direction || !analysisResult.stopLoss) {
    console.error("Invalid analysis result structure:", analysisResult);
    throw new Error("نتائج التحليل غير صالحة");
  }

  // Log the analysis type before saving
  console.log("Final analysis type being saved to database:", analysisType);

  // Process activation_type (default to تلقائي if not provided)
  const activation_type = analysisResult.activation_type || "تلقائي";
  
  // Prepare data for insertion
  const insertData = {
    user_id: userId,
    symbol,
    current_price: currentPrice,
    analysis: analysisResult,
    analysis_type: analysisType,
    timeframe,
    analysis_duration_hours: durationHours,
    activation_type
  };
  
  console.log("Inserting analysis data with duration:", durationHours, insertData);

  try {
    const { data, error } = await supabase
      .from('search_history')
      .insert(insertData)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error saving to Supabase:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in saveAnalysis function:", error);
    throw error;
  }
};
