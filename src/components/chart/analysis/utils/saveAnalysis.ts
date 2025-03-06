
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

  // Ensure analysisType is a valid value for the database
  console.log("Final analysis type being saved to database:", analysisType);

  // Make sure the analysisType in analysisResult matches the one we're saving
  if (analysisResult.analysisType !== analysisType) {
    console.log(`Correcting analysis type in result from ${analysisResult.analysisType} to ${analysisType}`);
    analysisResult.analysisType = analysisType;
  }

  // Set automatic activation type for Fibonacci Advanced Analysis
  if (!analysisResult.activation_type) {
    if (analysisType === "fibonacci_advanced" || analysisResult.pattern === "تحليل فيبوناتشي متقدم") {
      analysisResult.activation_type = "يدوي";
    } else if (analysisType === "fibonacci" || analysisResult.pattern === "فيبوناتشي ريتريسمينت وإكستينشين") {
      analysisResult.activation_type = "تلقائي";
    }
  }

  console.log("Inserting analysis data with duration:", durationHours, {
    user_id: userId,
    symbol,
    current_price: currentPrice,
    analysis: analysisResult,
    analysis_type: analysisType,
    timeframe,
    analysis_duration_hours: durationHours
  });

  try {
    const { data, error } = await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        symbol,
        current_price: currentPrice,
        analysis: analysisResult,
        analysis_type: analysisType,
        timeframe,
        analysis_duration_hours: durationHours
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error saving to Supabase:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Database error during save:", error);
    throw new Error("حدث خطأ أثناء حفظ التحليل في قاعدة البيانات");
  }
};
