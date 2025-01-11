import { supabase } from "@/lib/supabase";
import { AnalysisData } from "@/types/analysis";
import { toast } from "sonner";

export const saveAnalysisToHistory = async (
  result: { 
    analysisResult: AnalysisData; 
    currentPrice: number; 
    symbol: string; 
  },
  symbol: string,
  timeframe: string,
  analysisType: AnalysisData['analysisType'],
  userId: string
) => {
  try {
    console.log("Saving analysis to history with user_id:", userId);
    console.log("Mapped analysis type:", analysisType);

    const { data, error } = await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        symbol: symbol.toUpperCase(),
        current_price: result.currentPrice,
        analysis: result.analysisResult,
        analysis_type: analysisType,
        timeframe: timeframe
      })
      .select('*')
      .maybeSingle();

    if (error) {
      console.error("Error saving analysis to history:", error);
      toast.error("حدث خطأ أثناء حفظ التحليل في السجل");
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from insert operation");
    }

    console.log("Analysis saved successfully to history");
    toast.success("تم حفظ نتائج التحليل في السجل");
    return data;
  } catch (error) {
    console.error("Error saving analysis to history:", error);
    toast.error("حدث خطأ أثناء حفظ التحليل في السجل");
    throw error;
  }
};