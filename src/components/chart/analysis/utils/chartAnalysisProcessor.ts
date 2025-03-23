
import { AnalysisData } from "@/types/analysis"; 
import { supabase } from "@/lib/supabase";
import { fetchHistoricalPrices } from "@/utils/price/api/historyFetcher";
import { 
  detectTrend,
  calculateSupportResistance,
  calculateFibonacciLevels
} from "@/utils/technicalAnalysis";
import { analyzeSMCChart } from "@/components/chart/analysis/smcAnalysis";
import { analyzeWavesChart } from "@/components/chart/analysis/wavesAnalysis";
import { analyzePriceAction } from "@/components/chart/analysis/priceActionAnalysis";
import { analyzeBehavioral } from "@/components/chart/analysis/behavioralAnalysis";

// معالجة تحليل الشارت بناءً على المدخلات
export const processChartAnalysis = async (input: any) => {
  console.log("معالجة تحليل الشارت باستخدام المدخلات:", input);

  try {
    // جلب بيانات الأسعار التاريخية الحقيقية
    const historicalPrices = await fetchHistoricalPrices(input.symbol, input.timeframe);
    console.log(`تم جلب ${historicalPrices.length} من نقاط بيانات الأسعار التاريخية`);

    // تحديد نوع التحليل المطلوب
    let analysisResult: AnalysisData;
    
    switch(input.analysisType.toLowerCase()) {
      case "نظرية هيكل السوق":
      case "smc":
        analysisResult = await analyzeSMCChart(
          input.chartImage, 
          input.providedPrice, 
          input.timeframe, 
          parseInt(input.duration || "36"),
          historicalPrices
        );
        break;
      
      case "تقلبات":
      case "waves":
        analysisResult = await analyzeWavesChart(
          input.chartImage, 
          input.providedPrice, 
          input.timeframe, 
          parseInt(input.duration || "36"),
          historicalPrices
        );
        break;
      
      case "price action":
      case "حركة السعر":
        analysisResult = await analyzePriceAction(
          input.chartImage, 
          input.providedPrice, 
          input.timeframe,
          historicalPrices
        );
        break;
      
      case "behavioral":
      case "تحليل سلوكي":
        analysisResult = await analyzeBehavioral(
          input.chartImage, 
          input.providedPrice, 
          input.timeframe,
          historicalPrices
        );
        break;
      
      default:
        // التحليل الافتراضي - تحليل أساسي
        const trend = detectTrend(historicalPrices);
        const { support, resistance } = calculateSupportResistance(historicalPrices);
        const fibLevels = calculateFibonacciLevels(support, resistance, trend);
        
        analysisResult = {
          pattern: "تحليل أساسي",
          direction: trend,
          currentPrice: input.providedPrice || 0,
          support: support,
          resistance: resistance,
          stopLoss: trend === "صاعد" ? support * 0.995 : resistance * 1.005,
          targets: [
            { price: trend === "صاعد" ? resistance : support, expectedTime: new Date(Date.now() + 24 * 60 * 60 * 1000) },
            { price: trend === "صاعد" ? resistance * 1.01 : support * 0.99, expectedTime: new Date(Date.now() + 48 * 60 * 60 * 1000) }
          ],
          bestEntryPoint: {
            price: trend === "صاعد" ? input.providedPrice * 0.995 : input.providedPrice * 1.005,
            reason: "نقطة دخول مناسبة بناءً على التحليل الأساسي"
          },
          analysisType: input.analysisType || "تحليل أساسي"
        };
    }

    // إضافة معلومات المدة إلى التحليل
    analysisResult.analysis_duration_hours = parseInt(input.duration || "36");

    // بناء النتيجة النهائية
    const result = {
      analysisResult,
      duration: parseInt(input.duration || "36"),
      symbol: input.symbol || "",
      currentPrice: input.providedPrice || 0
    };

    return result;
  } catch (error) {
    console.error("خطأ في معالجة تحليل الشارت:", error);
    throw error;
  }
};

// حفظ التحليل في قاعدة البيانات
export const saveAnalysisToDatabase = async (
  symbol: string,
  analysisType: string,
  currentPrice: number,
  analysis: AnalysisData,
  duration: number = 8
) => {
  try {
    console.log("حفظ التحليل في قاعدة البيانات:", {
      symbol,
      analysisType,
      currentPrice,
      analysis,
      duration
    });

    const { data, error } = await supabase.from("search_history").insert([
      {
        symbol,
        type: analysisType,
        price: currentPrice,
        analysis_data: analysis,
        duration_hours: duration,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      },
    ]);

    if (error) {
      console.error("خطأ في حفظ التحليل في قاعدة البيانات:", error);
      throw error;
    }

    console.log("تم حفظ التحليل بنجاح:", data);
    return data;
  } catch (error) {
    console.error("خطأ في saveAnalysisToDatabase:", error);
    throw error;
  }
};

