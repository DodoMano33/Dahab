import { supabase } from "@/lib/supabase";
import { AnalysisType } from "./analysisTypes";
import { toast } from "sonner";
import { AnalysisData } from "@/types/analysis";

interface SaveAnalysisParams {
  userId: string;
  symbol: string;
  currentPrice: number;
  analysisResult: AnalysisData;
  analysisType: AnalysisType;
  timeframe: string;
  customHours?: number;
}

export const saveAnalysis = async ({
  userId,
  symbol,
  currentPrice,
  analysisResult,
  analysisType,
  timeframe,
  customHours = 8
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

  console.log("Inserting analysis data:", {
    user_id: userId,
    symbol,
    current_price: currentPrice,
    analysis: analysisResult,
    analysis_type: analysisType,
    timeframe,
    custom_hours: customHours
  });

  const { data, error } = await supabase.rpc('add_analysis_type', {
    p_user_id: userId,
    p_symbol: symbol,
    p_current_price: currentPrice,
    p_analysis: analysisResult,
    p_analysis_type: analysisType,
    p_timeframe: timeframe,
    p_custom_hours: customHours
  });

  if (error) {
    console.error("Error saving to Supabase:", error);
    throw error;
  }

  return data;
};