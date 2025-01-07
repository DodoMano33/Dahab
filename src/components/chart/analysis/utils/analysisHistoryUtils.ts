import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const mapAnalysisTypeToDbValue = (type: string): string => {
  const mapping: { [key: string]: string } = {
    'scalping': 'سكالبينج',
    'smc': 'SMC',
    'ict': 'ICT',
    'turtleSoup': 'Turtle Soup',
    'gann': 'Gann',
    'waves': 'Waves',
    'patterns': 'Patterns',
    'priceAction': 'Price Action',
    'smart': 'Smart'
  };
  return mapping[type] || 'عادي';
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
    
    const { error } = await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        symbol: symbol.toUpperCase(),
        current_price: result.currentPrice,
        analysis: result.analysisResult,
        analysis_type: mappedAnalysisType,
        timeframe: timeframe
      });

    if (error) {
      console.error("Error saving analysis to history:", error);
      throw error;
    }

    console.log("Analysis saved successfully to history");
    toast.success("تم حفظ نتائج التحليل في السجل");
  } catch (error) {
    console.error("Error saving analysis to history:", error);
    toast.error("حدث خطأ أثناء حفظ التحليل في السجل");
    throw error;
  }
};