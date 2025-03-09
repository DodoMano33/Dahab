
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

  // Define allowed analysis types
  const allowedTypes = [
    "فيبوناتشي", "فيبوناتشي متقدم", "تحليل الموجات", "حركة السعر", 
    "تحليل ICT", "تحليل SMC", "تحليل الأنماط", "سكالبينج", 
    "تحليل جان", "Turtle Soup", "شبكات عصبية", "شبكات RNN", 
    "تباين متعدد", "تصفيق زمني", "شمعات مركبة", "تحليل سلوكي", "ذكي"
  ];

  // Map any legacy or non-standard types to allowed types
  const typeMapping: Record<string, string> = {
    "normal": "تحليل الأنماط",
    "pattern": "تحليل الأنماط",
    "patterns": "تحليل الأنماط",
    "fibonacci": "فيبوناتشي",
    "fibonacci_advanced": "فيبوناتشي متقدم",
    "waves": "تحليل الموجات",
    "price_action": "حركة السعر",
    "ict": "تحليل ICT",
    "smc": "تحليل SMC",
    "scalping": "سكالبينج",
    "gann": "تحليل جان",
    "turtle_soup": "Turtle Soup",
    "neural_network": "شبكات عصبية",
    "rnn": "شبكات RNN",
    "multi_variance": "تباين متعدد",
    "time_clustering": "تصفيق زمني",
    "composite_candlestick": "شمعات مركبة",
    "behavioral": "تحليل سلوكي",
    "smart": "ذكي"
  };

  // Normalize the analysis type 
  let validAnalysisType = analysisType;
  const analysisTypeStr = String(analysisType).toLowerCase();
  
  if (typeMapping[analysisTypeStr]) {
    validAnalysisType = typeMapping[analysisTypeStr] as AnalysisType;
  }

  // Check if the normalized type is in our allowed list
  if (!allowedTypes.includes(validAnalysisType as string)) {
    console.error("Invalid analysis type after normalization:", validAnalysisType);
    // Default to pattern analysis if we still don't have a valid type
    validAnalysisType = "تحليل الأنماط" as AnalysisType;
  }

  // Log the analysis type transformation
  console.log("Original analysis type:", analysisType);
  console.log("Mapped analysis type being saved to database:", validAnalysisType);

  // Make sure the analysis result also has the correct analysis type
  if (analysisResult.analysisType !== validAnalysisType) {
    console.log("Updating analysis result type from", analysisResult.analysisType, "to", validAnalysisType);
    analysisResult.analysisType = validAnalysisType;
  }

  // Don't change activation_type if it's already set
  if (!analysisResult.activation_type) {
    console.log("No activation_type provided, setting a default");
    
    // For analyses we know are automatic or manual based on specific patterns
    if (analysisResult.pattern === "تحليل فيبوناتشي متقدم") {
      analysisResult.activation_type = "يدوي";
      console.log("Set activation_type to يدوي based on pattern match");
    } else if (analysisResult.pattern === "فيبوناتشي ريتريسمينت وإكستينشين") {
      analysisResult.activation_type = "تلقائي";
      console.log("Set activation_type to تلقائي based on pattern match");
    } else if (analysisResult.analysisType === "ذكي" || analysisResult.analysisType === "شمعات مركبة") {
      // Smart analysis and composite candlestick analysis are always automatic
      analysisResult.activation_type = "تلقائي";
      console.log("Set activation_type to تلقائي based on analysisType");
    } else {
      // Default is manual
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
