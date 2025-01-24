import { supabase } from "@/lib/supabase";
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { toast } from "sonner";

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
  try {
    // Validate required fields
    if (!userId || !symbol || !currentPrice || !analysisResult || !analysisType || !timeframe) {
      console.error("Missing required fields for analysis:", {
        userId,
        symbol,
        currentPrice,
        analysisResult,
        analysisType,
        timeframe
      });
      throw new Error("جميع الحقول مطلوبة");
    }

    // Validate customHours
    if (customHours && (customHours < 1 || customHours > 72)) {
      throw new Error("مدة التحليل يجب أن تكون بين 1 و 72 ساعة");
    }

    console.log("Saving analysis with params:", {
      userId,
      symbol,
      currentPrice,
      analysisType,
      timeframe,
      customHours
    });

    const { data, error } = await supabase
      .from("search_history")
      .insert({
        user_id: userId,
        symbol: symbol.toUpperCase(),
        current_price: currentPrice,
        analysis: analysisResult,
        analysis_type: analysisType,
        timeframe,
        analysis_duration_hours: customHours
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error saving analysis:", error);
      throw error;
    }

    console.log("Analysis saved successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in saveAnalysis:", error);
    toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء حفظ التحليل");
    throw error;
  }
};