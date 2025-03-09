
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

  // Map Fibonacci analysis types to valid database values
  let validAnalysisType = analysisType;
  const analysisTypeStr = String(analysisType).toLowerCase();
  
  if (
    analysisTypeStr === "فيبوناتشي" || 
    analysisTypeStr === "فيبوناتشي متقدم" || 
    analysisTypeStr === "fibonacci" || 
    analysisTypeStr === "fibonacci_advanced"
  ) {
    validAnalysisType = "فيبوناتشي" as AnalysisType;
  }

  // Ensure analysisType is a valid value for the database
  console.log("Original analysis type:", analysisType);
  console.log("Mapped analysis type being saved to database:", validAnalysisType);

  // Make sure the analysis result also has the correct analysis type
  if (analysisResult.analysisType !== validAnalysisType) {
    console.log("Updating analysis result type from", analysisResult.analysisType, "to", validAnalysisType);
    analysisResult.analysisType = validAnalysisType;
  }

  // Ensure the activation_type is set properly
  if (!analysisResult.activation_type) {
    console.log("Setting default activation_type as it was not provided");
    // For certain specific patterns we know are automatic
    if (analysisResult.pattern === "تحليل فيبوناتشي متقدم") {
      analysisResult.activation_type = "يدوي";
    } else if (analysisResult.pattern === "فيبوناتشي ريتريسمينت وإكستينشين") {
      analysisResult.activation_type = "تلقائي";
    } else {
      // Default to manual if nothing else matches
      analysisResult.activation_type = "يدوي";
    }
  }

  console.log("Final activation_type before saving:", analysisResult.activation_type);
  console.log("Inserting analysis data with duration:", durationHours, {
    user_id: userId,
    symbol,
    current_price: currentPrice,
    analysis: analysisResult,
    analysis_type: validAnalysisType,
    timeframe,
    analysis_duration_hours: durationHours
  });

  const { data, error } = await supabase
    .from('search_history')
    .insert({
      user_id: userId,
      symbol,
      current_price: currentPrice,
      analysis: analysisResult,
      analysis_type: validAnalysisType,
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
};
