import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AnalysisData } from "@/types/analysis";

export const mapAnalysisTypeToDbValue = (type: string): AnalysisData['analysisType'] => {
  const mapping: { [key: string]: AnalysisData['analysisType'] } = {
    'scalping': 'سكالبينج',
    'smc': 'SMC',
    'ict': 'ICT',
    'turtleSoup': 'Turtle Soup',
    'gann': 'Gann',
    'waves': 'Waves',
    'patterns': 'Patterns',
    'priceAction': 'Price Action'
  };
  return mapping[type] || 'Patterns';
};

export const saveAnalysisToHistory = async (
  result: any,
  symbol: string,
  timeframe: string,
  analysisType: string,
  userId: string
) => {
  try {
    console.log("Saving analysis to history with user_id:", userId);
    const mappedAnalysisType = mapAnalysisTypeToDbValue(analysisType);
    console.log("Mapped analysis type:", mappedAnalysisType);
    
    if (!userId) {
      throw new Error("User ID is required to save analysis history");
    }

    const { data, error } = await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        symbol: symbol.toUpperCase(),
        current_price: result.currentPrice,
        analysis: result.analysisResult,
        analysis_type: mappedAnalysisType,
        timeframe: timeframe
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving analysis to history:", error);
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