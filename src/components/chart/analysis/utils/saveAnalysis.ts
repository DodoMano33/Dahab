
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
  // This ensures we're using the exact string values accepted by the database
  let validAnalysisType: AnalysisType;
  
  // Normalize to valid database values
  switch(analysisType.toLowerCase().replace(/\s+/g, '')) {
    case 'فيبوناتشي':
    case 'fibonacci':
      validAnalysisType = 'فيبوناتشي';
      break;
    case 'فيبوناتشيمتقدم':
    case 'advancedfibonacci':
    case 'fibonacci_advanced':
      validAnalysisType = 'فيبوناتشي متقدم';
      break;
    case 'تحليلجان':
    case 'جان':
    case 'gann':
      validAnalysisType = 'تحليل جان';
      break;
    case 'تحليلالموجات':
    case 'موجات':
    case 'waves':
      validAnalysisType = 'تحليل الموجات';
      break;
    case 'حركةالسعر':
    case 'priceaction':
      validAnalysisType = 'حركة السعر';
      break;
    case 'سكالبينج':
    case 'scalping':
      validAnalysisType = 'سكالبينج';
      break;
    case 'smc':
    case 'تحليلsmc':
      validAnalysisType = 'تحليل SMC';
      break;
    case 'ict':
    case 'تحليلict':
      validAnalysisType = 'تحليل ICT';
      break;
    case 'تصفيقزمني':
    case 'timeclustering':
      validAnalysisType = 'تصفيق زمني';
      break;
    case 'تحليلالأنماط':
    case 'patterns':
    case 'تحليلالانماط':
      validAnalysisType = 'تحليل الأنماط';
      break;
    case 'تباينمتعدد':
    case 'multivariance':
      validAnalysisType = 'تباين متعدد';
      break;
    case 'شبكاتعصبية':
    case 'neuralnetwork':
      validAnalysisType = 'شبكات عصبية';
      break;
    case 'تحليلسلوكي':
    case 'behavioral':
    case 'سلوكي':
      validAnalysisType = 'تحليل سلوكي';
      break;
    case 'turtlesoup':
    case 'حساءالسلحفاة':
      validAnalysisType = 'Turtle Soup';
      break;
    case 'rnn':
    case 'شبكاتrnn':
    case 'شبكاتعصبيةمتكررة':
      validAnalysisType = 'شبكات RNN';
      break;
    case 'شمعاتمركبة':
    case 'compositecandlestick':
      validAnalysisType = 'شمعات مركبة';
      break;
    case 'ذكي':
    case 'smart':
      validAnalysisType = 'ذكي';
      break;
    default:
      console.warn("Unrecognized analysis type:", analysisType, "using default 'تحليل الأنماط'");
      validAnalysisType = 'تحليل الأنماط';
  }

  console.log("Normalized analysis type from", analysisType, "to", validAnalysisType);
  
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
