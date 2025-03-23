
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { analyzeMLChart as executeBasicAnalysis } from "../ml/basicMLAnalysis";
import { advancedNeuralNetworkAnalysis as executeAdvancedAnalysis } from "../ml/advancedMLAnalysis";
import { analyzeMultiVariance as processMultiVarianceAnalysis } from "../multiVarianceAnalysis";
import { analyzeICTChart as processICTAnalysis } from "../ictAnalysis";
import { analyzeSMCChart as processSMCAnalysis } from "../smcAnalysis";
import { analyzeTurtleSoupChart as processTurtleSoupAnalysis } from "../turtleSoupAnalysis";
import { analyzeGannChart as processGannAnalysis } from "../gannAnalysis";
import { analyzePattern as processPatternAnalysis } from "../patternAnalysis";
import { analyzeWavesChart as processWavesAnalysis } from "../wavesAnalysis";
import { analyzePriceAction as processPriceActionAnalysis } from "../priceActionAnalysis";
import { analyzeTimeClustering as processTimeClusteringAnalysis } from "../timeClusteringAnalysis";
import { analyzeNeuralNetworkChart as processNeuralNetworkAnalysis } from "../neuralNetworkAnalysis";
import { analyzeRNN as processRNNAnalysis } from "../rnnAnalysis";
import { analyzeCompositeCandlestick as processCompositeCandlestickAnalysis } from "../compositeCandlestickAnalysis";
import { analyzeBehavioral as processBehavioralAnalysis } from "../behavioralAnalysis";
import { analyzeScalpingChart as processScalpingAnalysis } from "../scalpingAnalysis";
import { analyzeFibonacciChart as processFibonacciAnalysis } from "../fibonacciAnalysis";
import { analyzeFibonacciAdvancedChart as processFibonacciAdvancedAnalysis } from "../fibonacciAdvancedAnalysis";
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
      analysisType: analysisType as AnalysisType,
      direction: "محايد",
      pattern: "قيد التحليل",
      confidence_score: 0,
      timeframe: timeframe,
      bestEntryPoint: {
        price: providedPrice,
        reason: `تم التحليل في ${new Date().toISOString()}`
      },
      stopLoss: providedPrice * 0.99,
      targets: [
        {
          price: providedPrice * 1.01,
          expectedTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
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
        analysisResult = await executeAdvancedAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "scalping":
      case "سكالبينج":
      case "مضاربة":
        analysisResult = await processScalpingAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "smc":
        analysisResult = await processSMCAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "ict":
        analysisResult = await processICTAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "turtle soup":
      case "الحساء السلحفائي":
        analysisResult = await processTurtleSoupAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "gann":
      case "جان":
        analysisResult = await processGannAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "waves":
      case "موجات":
        analysisResult = await processWavesAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "patterns":
      case "أنماط":
      case "نمطي":
        analysisResult = await processPatternAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "price action":
      case "حركة السعر":
        analysisResult = await processPriceActionAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "neural network":
      case "شبكات عصبية":
        analysisResult = await processNeuralNetworkAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "rnn":
      case "شبكات عصبية متكررة":
        analysisResult = await processRNNAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "time clustering":
      case "تصفيق زمني":
        analysisResult = await processTimeClusteringAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "multi variance":
      case "تباين متعدد العوامل":
        analysisResult = await processMultiVarianceAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "composite candlestick":
      case "شمعات مركبة":
        analysisResult = await processCompositeCandlestickAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "behavioral":
      case "تحليل سلوكي":
        analysisResult = await processBehavioralAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "fibonacci":
      case "فيبوناتشي":
        analysisResult = await processFibonacciAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      case "fibonacci_advanced":
      case "fibonacci advanced":
      case "فيبوناتشي متقدم":
        analysisResult = await processFibonacciAdvancedAnalysis(chartImage || "", providedPrice, timeframe);
        break;
      default:
        analysisResult = await executeBasicAnalysis(chartImage || "", providedPrice, timeframe);
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
