
import { AnalysisData } from "@/types/analysis"; 
import { supabase } from "@/lib/supabase";
import { fetchHistoricalPrices } from "@/utils/price/api/historyFetcher";
import { 
  detectTrend,
  calculateSupportResistance
} from "@/utils/technicalAnalysis/indicators/PriceData";
import { calculateFibonacciLevels } from "@/utils/technicalAnalysis/calculations";
import { analyzeSMCChart } from "@/components/chart/analysis/smcAnalysis";
import { analyzeWavesChart } from "@/components/chart/analysis/wavesAnalysis";
import { analyzePriceAction } from "@/components/chart/analysis/priceActionAnalysis";
import { analyzeBehavioral } from "@/components/chart/analysis/behavioralAnalysis";

// معالجة تحليل الشارت بناءً على المدخلات
export const processChartAnalysis = async (input: any) => {
  console.log("معالجة تحليل الشارت باستخدام المدخلات:", input);

  try {
    // جلب بيانات الأسعار التاريخية الحقيقية
    let historicalPrices: number[] = [];
    try {
      historicalPrices = await fetchHistoricalPrices(input.symbol, input.timeframe);
      console.log(`تم جلب ${historicalPrices.length} من نقاط بيانات الأسعار التاريخية`);
    } catch (error) {
      console.warn("تعذر جلب البيانات التاريخية، سيتم استخدام بيانات محاكاة:", error);
      // إنشاء بيانات تاريخية محاكاة إذا فشل الجلب
      historicalPrices = generateFallbackPrices(input.providedPrice || 0);
    }

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
        // التحليل الافتراضي - تحليل أساسي باستخدام البيانات التاريخية
        console.log("استخدام التحليل الأساسي الافتراضي");
        
        // تحديد الاتجاه من البيانات التاريخية
        const trend = detectTrend(historicalPrices);
        console.log("الاتجاه المحدد:", trend);
        
        // حساب الدعم والمقاومة
        const { support, resistance } = calculateSupportResistance(historicalPrices);
        console.log("الدعم والمقاومة المحسوبة:", { support, resistance });
        
        // حساب مستويات فيبوناتشي
        const fibLevels = calculateFibonacciLevels(resistance, support);
        console.log("مستويات فيبوناتشي:", fibLevels);
        
        // تحديد مناطق إضافية بناءً على البيانات التاريخية
        const priceRange = resistance - support;
        const volatilityFactor = Math.min(0.03, priceRange / input.providedPrice);
        
        // يجب أن تعتمد أهداف السعر على الاتجاه
        let target1, target2, stopLossPrice;
        if (trend === "صاعد") {
          target1 = Number((input.providedPrice * (1 + volatilityFactor)).toFixed(2));
          target2 = Number((input.providedPrice * (1 + volatilityFactor * 2)).toFixed(2));
          stopLossPrice = Number((Math.min(support, input.providedPrice * (1 - volatilityFactor))).toFixed(2));
        } else {
          target1 = Number((input.providedPrice * (1 - volatilityFactor)).toFixed(2));
          target2 = Number((input.providedPrice * (1 - volatilityFactor * 2)).toFixed(2));
          stopLossPrice = Number((Math.max(resistance, input.providedPrice * (1 + volatilityFactor))).toFixed(2));
        }
        
        // تكوين أهداف مع أوقات متوقعة
        const targets = [
          { price: target1, expectedTime: new Date(Date.now() + 24 * 60 * 60 * 1000) },
          { price: target2, expectedTime: new Date(Date.now() + 48 * 60 * 60 * 1000) }
        ];
        
        // تحديد أفضل نقطة دخول استنادًا إلى الاتجاه
        const bestEntryPrice = trend === "صاعد" ? 
          Number((Math.max(support, input.providedPrice * 0.995)).toFixed(2)) : 
          Number((Math.min(resistance, input.providedPrice * 1.005)).toFixed(2));
        
        analysisResult = {
          pattern: trend === "صاعد" ? "نمط صعودي أساسي" : "نمط هبوطي أساسي",
          direction: trend,
          currentPrice: input.providedPrice || 0,
          support,
          resistance,
          stopLoss: stopLossPrice,
          targets,
          bestEntryPoint: {
            price: bestEntryPrice,
            reason: `نقطة دخول مناسبة بناءً على التحليل الأساسي واتجاه ${trend}`
          },
          analysisType: input.analysisType || "تحليل أساسي"
        };
    }

    // إضافة معلومات المدة إلى التحليل
    analysisResult.analysis_duration_hours = parseInt(input.duration || "36");
    // إضافة الإطار الزمني للتحليل (مهم للعرض)
    analysisResult.timeframe = input.timeframe;

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

// دالة مساعدة لإنشاء بيانات أسعار احتياطية إذا فشل جلب البيانات التاريخية
const generateFallbackPrices = (currentPrice: number): number[] => {
  const prices: number[] = [];
  const volatility = 0.02;
  
  // توليد سلسلة من الأسعار بنمط شبه عشوائي
  let lastPrice = currentPrice * 0.95;
  
  // إنشاء اتجاه عشوائي
  const trend = Math.random() > 0.5 ? 1 : -1;
  
  for (let i = 0; i < 100; i++) {
    prices.push(lastPrice);
    
    // إضافة تغيير عشوائي مع ميل للاتجاه
    const change = (Math.random() - 0.5) * volatility + trend * volatility * 0.1;
    lastPrice *= (1 + change);
    
    // إضافة بعض الدعم والمقاومة
    if (i % 15 === 0) {
      const level = lastPrice;
      for (let j = 0; j < 3; j++) {
        prices.push(level * (1 + (Math.random() - 0.5) * 0.005));
      }
    }
  }
  
  // إضافة السعر الحالي في النهاية
  prices.push(currentPrice);
  
  return prices;
};
