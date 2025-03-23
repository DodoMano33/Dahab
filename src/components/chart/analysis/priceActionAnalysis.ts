
import { AnalysisData } from "@/types/analysis";
import { getExpectedTime } from "@/utils/technicalAnalysis/timeUtils";
import { detectTrend, calculateSupportResistance } from "@/utils/technicalAnalysis/indicators/PriceData";

export const analyzePriceAction = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string = "1d",
  historicalPrices: number[] = []
): Promise<AnalysisData> => {
  console.log("بدء تحليل حركة السعر - البيانات المستلمة:", { chartImage, currentPrice, timeframe });
  console.log(`باستخدام ${historicalPrices.length} نقطة بيانات تاريخية`);
  
  try {
    if (!currentPrice || isNaN(currentPrice)) {
      console.error("خطأ: السعر الحالي غير صالح:", currentPrice);
      throw new Error("السعر الحالي غير صالح");
    }

    if (!chartImage) {
      console.error("خطأ: لم يتم استلام صورة الشارت");
      throw new Error("لم يتم استلام صورة الشارت");
    }

    // استخدام البيانات التاريخية إذا كانت متوفرة
    const prices = historicalPrices.length > 0 ? 
      historicalPrices : 
      generateSimulatedPrices(currentPrice);

    // تحليل اتجاه السعر
    const trend = detectTrend(prices);
    console.log("تم اكتشاف الاتجاه:", trend);

    // حساب مستويات الدعم والمقاومة
    const { support, resistance } = calculateSupportResistance(prices);
    
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

    // إنشاء مستويات فيبوناتشي
    const fibonacciLevels = [
      { level: 0.236, price: support + (resistance - support) * 0.236 },
      { level: 0.382, price: support + (resistance - support) * 0.382 },
      { level: 0.5, price: support + (resistance - support) * 0.5 },
      { level: 0.618, price: support + (resistance - support) * 0.618 },
      { level: 0.786, price: support + (resistance - support) * 0.786 }
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
      fibonacciLevels: fibonacciLevels,
      analysisType: "Price Action"
    };

    console.log("تم إكمال تحليل حركة السعر بنجاح:", analysis);
    return analysis;

  } catch (error) {
    console.error("خطأ في تحليل حركة السعر:", error);
    throw new Error(`فشل في تحليل حركة السعر: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
  }
};

// وظيفة حساب وقف الخسارة
function calculateStopLoss(currentPrice: number, trend: "صاعد" | "هابط" | "محايد"): number {
  return trend === "صاعد"
    ? Math.round((currentPrice * 0.97) * 100) / 100
    : Math.round((currentPrice * 1.03) * 100) / 100;
}

// دالة مساعدة لتوليد بيانات محاكاة إذا لم تتوفر بيانات حقيقية
const generateSimulatedPrices = (currentPrice: number): number[] => {
  const simulatedPrices: number[] = [];
  const volatility = 0.01; // نسبة التقلب
  
  // توليد 200 سعر تاريخي للمحاكاة
  for (let i = 0; i < 200; i++) {
    if (i === 0) {
      simulatedPrices.push(currentPrice * (1 - volatility));
    } else {
      const change = (Math.random() - 0.5) * volatility * 2;
      simulatedPrices.push(simulatedPrices[i - 1] * (1 + change));
    }
  }
  simulatedPrices.push(currentPrice);
  
  return simulatedPrices;
};
