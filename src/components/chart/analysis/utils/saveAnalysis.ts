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
}

export const saveAnalysis = async ({
  userId,
  symbol,
  currentPrice,
  analysisResult,
  analysisType,
  timeframe
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
    timeframe
  });

  const { data, error } = await supabase
    .from('search_history')
    .insert({
      user_id: userId,
      symbol,
      current_price: currentPrice,
      analysis: analysisResult,
      analysis_type: analysisType,
      timeframe
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error saving to Supabase:", error);
    throw error;
  }

  return data;
};