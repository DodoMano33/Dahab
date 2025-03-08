
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

  // Valid analysis types from the database constraint
  const validTypes = [
    "Normal", "Scalping", "Smart", "SMC", "ICT", "Turtle Soup", "Gann", "Waves", "Patterns", 
    "Price Action", "Neural Networks", "RNN", "Time Clustering", 
    "Multi Variance", "Composite Candlestick", "Behavioral Analysis", "Fibonacci", "Fibonacci Advanced", "Daily"
  ];

  // Check if the analysisType is valid
  if (!validTypes.includes(analysisType)) {
    console.error(`Invalid analysis type: "${analysisType}". Must be one of: ${validTypes.join(", ")}`);
    throw new Error(`نوع التحليل "${analysisType}" غير صالح`);
  }

  // Also check the analysis type in the result
  if (analysisResult.analysisType && !validTypes.includes(analysisResult.analysisType)) {
    // Correct the analysisType in the analysisResult to match the one being saved
    console.log(`Correcting analysis result type from "${analysisResult.analysisType}" to "${analysisType}"`);
    analysisResult.analysisType = analysisType;
  }

  console.log("Final analysis type being saved to database:", analysisType);

  // Set automatic activation type for Fibonacci Advanced Analysis
  if (!analysisResult.activation_type) {
    if (analysisResult.pattern === "تحليل فيبوناتشي متقدم") {
      analysisResult.activation_type = "يدوي";
    } else if (analysisResult.pattern === "فيبوناتشي ريتريسمينت وإكستينشين") {
      analysisResult.activation_type = "تلقائي";
    }
  }

  // Create a safe copy of the analysis data to avoid any unexpected properties
  const safeAnalysis = {
    pattern: analysisResult.pattern,
    direction: analysisResult.direction,
    currentPrice: analysisResult.currentPrice,
    support: analysisResult.support,
    resistance: analysisResult.resistance,
    stopLoss: analysisResult.stopLoss,
    targets: analysisResult.targets,
    bestEntryPoint: analysisResult.bestEntryPoint,
    analysisType: analysisType,
    activation_type: analysisResult.activation_type
  };

  console.log("Inserting analysis data with duration:", durationHours, {
    user_id: userId,
    symbol,
    current_price: currentPrice,
    analysis: safeAnalysis,
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
        analysis: safeAnalysis,
        analysis_type: analysisType,
        timeframe,
        analysis_duration_hours: durationHours
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error saving to Supabase:", error);
      console.error("Error details:", error.details, error.hint, error.message);
      throw new Error(`خطأ في حفظ التحليل: ${error.message}`);
    }

    console.log("Analysis saved successfully:", data);
    return data;
  } catch (error) {
    console.error("Exception during save operation:", error);
    throw error;
  }
};
