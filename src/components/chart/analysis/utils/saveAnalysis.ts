
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

  // Normalize the analysis type to make sure it's one of the valid types for database
  let validAnalysisType: AnalysisType = analysisType;

  // Make sure the analysis result also has the correct analysis type
  analysisResult.analysisType = validAnalysisType;
  
  // Don't change activation_type if it's already set
  if (!analysisResult.activation_type) {
    console.log("No activation_type provided, setting a default");
    
    // Set automatic for known automatic analysis types
    if (analysisResult.pattern === "فيبوناتشي ريتريسمينت وإكستينشين" || 
        validAnalysisType === "ذكي" || 
        validAnalysisType === "شمعات مركبة") {
      analysisResult.activation_type = "تلقائي";
      console.log("Set activation_type to تلقائي based on analysis type");
    } else {
      // Default to manual
      analysisResult.activation_type = "يدوي";
      console.log("Set default activation_type to يدوي");
    }
  } else {
    console.log("Using provided activation_type:", analysisResult.activation_type);
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
