
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { executeBasicAnalysis } from "../ml/basicMLAnalysis";
import { executeAdvancedAnalysis } from "../ml/advancedMLAnalysis";
import { processMultiVarianceAnalysis } from "../multiVarianceAnalysis";
import { processICTAnalysis } from "../ictAnalysis";
import { processSMCAnalysis } from "../smcAnalysis";
import { processTurtleSoupAnalysis } from "../turtleSoupAnalysis";
import { processGannAnalysis } from "../gannAnalysis";
import { processPatternAnalysis } from "../patternAnalysis";
import { processWavesAnalysis } from "../wavesAnalysis";
import { processPriceActionAnalysis } from "../priceActionAnalysis";
import { processTimeClusteringAnalysis } from "../timeClusteringAnalysis";
import { processNeuralNetworkAnalysis } from "../neuralNetworkAnalysis";
import { processRNNAnalysis } from "../rnnAnalysis";
import { processCompositeCandlestickAnalysis } from "../compositeCandlestickAnalysis";
import { processBehavioralAnalysis } from "../behavioralAnalysis";
import { processScalpingAnalysis } from "../scalpingAnalysis";
import { processFibonacciAnalysis } from "../fibonacciAnalysis";
import { processFibonacciAdvancedAnalysis } from "../fibonacciAdvancedAnalysis";
import { supabase } from "@/lib/supabase";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";

type AnalysisInput = {
  symbol: string;
  timeframe: string;
  providedPrice: number;
  analysisType: string;
  selectedTypes?: string[];
  isAI?: boolean;
  isSMC?: boolean;
  isICT?: boolean;
  isTurtleSoup?: boolean;
  isGann?: boolean;
  isWaves?: boolean;
  isPatternAnalysis?: boolean;
  isPriceAction?: boolean;
  isNeuralNetwork?: boolean;
  isRNN?: boolean;
  isTimeClustering?: boolean;
  isMultiVariance?: boolean;
  isCompositeCandlestick?: boolean;
  isBehavioral?: boolean;
  isFibonacci?: boolean;
  isFibonacciAdvanced?: boolean;
  duration?: string;
  chartImage?: string;
};

// تحديث تعريف النتيجة
export interface AnalysisResult {
  analysisResult: AnalysisData;
  duration?: string;
}

export const processChartAnalysis = async (input: AnalysisInput): Promise<AnalysisResult> => {
  try {
    console.log("Processing chart analysis with input:", input);
    
    // الحصول على البيانات الأساسية
    const { symbol, timeframe, providedPrice, analysisType, chartImage, duration } = input;
    
    // إنشاء كائن نتائج التحليل الأساسي
    const baseResult: AnalysisData = {
      analysisType,
      direction: "محايد",
      pattern: "قيد التحليل",
      confidence: 0,
      timeframe: timeframe,
      bestEntryPoint: {
        price: providedPrice,
        time: new Date().toISOString()
      },
      stopLoss: providedPrice * 0.99,
      targets: [
        {
          price: providedPrice * 1.01,
          expectedTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      currentPrice: providedPrice,
      analysis_duration_hours: duration ? parseInt(duration) : 8
    };

    // تنفيذ التحليل المناسب بناءً على النوع
    let analysisResult: AnalysisData;

    switch (analysisType.toLowerCase()) {
      case "smart":
      case "ذكي":
        analysisResult = await executeAdvancedAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "scalping":
      case "سكالبينج":
      case "مضاربة":
        analysisResult = await processScalpingAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "smc":
        analysisResult = await processSMCAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "ict":
        analysisResult = await processICTAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "turtle soup":
      case "الحساء السلحفائي":
        analysisResult = await processTurtleSoupAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "gann":
      case "جان":
        analysisResult = await processGannAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "waves":
      case "موجات":
        analysisResult = await processWavesAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "patterns":
      case "أنماط":
      case "نمطي":
        analysisResult = await processPatternAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "price action":
      case "حركة السعر":
        analysisResult = await processPriceActionAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "neural network":
      case "شبكات عصبية":
        analysisResult = await processNeuralNetworkAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "rnn":
      case "شبكات عصبية متكررة":
        analysisResult = await processRNNAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "time clustering":
      case "تصفيق زمني":
        analysisResult = await processTimeClusteringAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "multi variance":
      case "تباين متعدد العوامل":
        analysisResult = await processMultiVarianceAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "composite candlestick":
      case "شمعات مركبة":
        analysisResult = await processCompositeCandlestickAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "behavioral":
      case "تحليل سلوكي":
        analysisResult = await processBehavioralAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "fibonacci":
      case "فيبوناتشي":
        analysisResult = await processFibonacciAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      case "fibonacci_advanced":
      case "fibonacci advanced":
      case "فيبوناتشي متقدم":
        analysisResult = await processFibonacciAdvancedAnalysis(providedPrice, symbol, timeframe, chartImage);
        break;
      default:
        analysisResult = await executeBasicAnalysis(providedPrice, symbol, timeframe, chartImage);
    }

    // التأكد من تضمين كل البيانات المطلوبة
    analysisResult = {
      ...baseResult,
      ...analysisResult,
      timeframe,
      analysis_duration_hours: duration ? parseInt(duration) : (analysisResult.analysis_duration_hours || 8),
      currentPrice: providedPrice
    };

    console.log("Analysis completed with result:", analysisResult);
    
    // إرجاع كائن النتيجة النهائي
    return {
      analysisResult,
      duration: duration
    };
  } catch (error: any) {
    console.error("فشل في معالجة تحليل الشارت:", error);
    throw new Error(`فشل في معالجة تحليل الشارت: ${error.message}`);
  }
};

export const saveAnalysisToDatabase = async (
  symbol: string,
  analysisType: string,
  currentPrice: number,
  analysisResult: AnalysisData,
  durationHours: number = 8
) => {
  try {
    console.log("جاري حفظ التحليل في قاعدة البيانات:", {
      symbol,
      analysisType,
      currentPrice,
      durationHours
    });

    // الحصول على المستخدم الحالي
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("يجب تسجيل الدخول لحفظ التحليلات");
    }
    
    // مسح التخزين المؤقت قبل العملية
    await clearSupabaseCache();
    await clearSearchHistoryCache();
    
    const { data, error } = await supabase.from('search_history').insert({
      user_id: session.user.id,
      symbol: symbol.toUpperCase(),
      current_price: currentPrice,
      analysis: analysisResult,
      analysis_type: analysisType,
      timeframe: analysisResult.timeframe || '1d',
      analysis_duration_hours: durationHours
    }).select();

    if (error) {
      console.error("خطأ أثناء حفظ التحليل في قاعدة البيانات:", error);
      throw error;
    }

    console.log("تم حفظ التحليل بنجاح:", data);
    return data;
  } catch (error) {
    console.error("حدث خطأ أثناء حفظ التحليل:", error);
    throw error;
  }
};
