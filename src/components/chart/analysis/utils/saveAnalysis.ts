import { supabase } from "@/lib/supabase";
import { AnalysisType } from "./analysisTypes";
import { toast } from "sonner";

interface SaveAnalysisParams {
  userId: string;
  symbol: string;
  currentPrice: number;
  analysisResult: any;
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

  if (!data) {
    throw new Error("No data returned from insert operation");
  }

  return data;
};