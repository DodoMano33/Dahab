
import { AnalysisData } from "@/types/analysis";
import { getExpectedTime } from "@/utils/technicalAnalysis/timeUtils";

export const analyzePriceAction = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string = "1d"
): Promise<AnalysisData> => {
  console.log("بدء تحليل حركة السعر - البيانات المستلمة:", { chartImage, currentPrice, timeframe });
  
  try {
    if (!currentPrice || isNaN(currentPrice)) {
      console.error("خطأ: السعر الحالي غير صالح:", currentPrice);
      throw new Error("السعر الحالي غير صالح");
    }

    if (!chartImage) {
      console.error("خطأ: لم يتم استلام صورة الشارت");
      throw new Error("لم يتم استلام صورة الشارت");
    }

    // تحليل اتجاه السعر (تقديري)
    const trend = detectTrend(chartImage);
    console.log("تم اكتشاف الاتجاه:", trend);

    // حساب مستويات الدعم والمقاومة
    const support = calculateSupport(currentPrice, trend);
    const resistance = calculateResistance(currentPrice, trend);
    
    // حساب وقف الخسارة المناسب
    const stopLoss = calculateStopLoss(currentPrice, trend);
    
    // تحديد أفضل نقطة دخول
    const bestEntryPoint = {
      price: trend === "صاعد" ? support + (resistance - support) * 0.236 : resistance - (resistance - support) * 0.236,
      reason: `أفضل نقطة دخول بناءً على تحليل حركة السعر والاتجاه ${trend}`
    };
    
    // حساب مستويات المستهدفات
    const targets = [
      {
        price: trend === "صاعد" 
          ? currentPrice + (resistance - currentPrice) * 0.5
          : currentPrice - (currentPrice - support) * 0.5,
        expectedTime: getExpectedTime(timeframe, 1)
      },
      {
        price: trend === "صاعد" ? resistance : support,
        expectedTime: getExpectedTime(timeframe, 2)
      }
    ];

    // إنشاء كائن نتيجة التحليل
    const analysis: AnalysisData = {
      pattern: "تحليل حركة السعر",
      direction: trend,
      currentPrice: currentPrice,
      support: support,
      resistance: resistance,
      stopLoss: stopLoss,
      bestEntryPoint: bestEntryPoint,
      targets: targets,
      fibonacciLevels: [
        { level: 0.236, price: support + (resistance - support) * 0.236 },
        { level: 0.382, price: support + (resistance - support) * 0.382 },
        { level: 0.5, price: support + (resistance - support) * 0.5 },
        { level: 0.618, price: support + (resistance - support) * 0.618 },
        { level: 0.786, price: support + (resistance - support) * 0.786 }
      ],
      analysisType: "Price Action"
    };

    console.log("تم إكمال تحليل حركة السعر بنجاح:", analysis);
    return analysis;

  } catch (error) {
    console.error("خطأ في تحليل حركة السعر:", error);
    throw new Error(`فشل في تحليل حركة السعر: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
  }
};

// وظيفة محاكاة لتحديد الاتجاه من صورة الشارت
function detectTrend(chartImage: string): "صاعد" | "هابط" | "محايد" {
  // سنقوم بإنشاء اتجاه عشوائي للمحاكاة
  const trends: ["صاعد", "هابط", "محايد"] = ["صاعد", "هابط", "محايد"];
  return trends[Math.floor(Math.random() * trends.length)];
}

// وظائف حساب الدعم والمقاومة
function calculateSupport(currentPrice: number, trend: string): number {
  return trend === "صاعد" 
    ? Math.round((currentPrice * 0.98) * 100) / 100
    : Math.round((currentPrice * 0.95) * 100) / 100;
}

function calculateResistance(currentPrice: number, trend: string): number {
  return trend === "صاعد"
    ? Math.round((currentPrice * 1.05) * 100) / 100
    : Math.round((currentPrice * 1.02) * 100) / 100;
}

// وظيفة حساب وقف الخسارة
function calculateStopLoss(currentPrice: number, trend: string): number {
  return trend === "صاعد"
    ? Math.round((currentPrice * 0.97) * 100) / 100
    : Math.round((currentPrice * 1.03) * 100) / 100;
}
