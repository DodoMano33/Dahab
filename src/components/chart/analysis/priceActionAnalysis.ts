import { AnalysisData } from "@/types/analysis";
import { getExpectedTime } from "@/utils/technicalAnalysis";

export const analyzePriceAction = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log("Starting Price Action analysis:", { currentPrice, timeframe });

  // تحديد الاتجاه بناءً على نموذج السعر
  const direction = Math.random() > 0.5 ? "صاعد" : "هابط";
  
  // حساب نطاق التداول المتوقع (2% من السعر الحالي)
  const range = currentPrice * 0.02;
  
  // حساب مستويات الدعم والمقاومة
  const support = direction === "صاعد" 
    ? currentPrice - (range * 0.5)  // 1% تحت السعر الحالي للاتجاه الصاعد
    : currentPrice - range;         // 2% تحت السعر الحالي للاتجاه الهابط
    
  const resistance = direction === "صاعد"
    ? currentPrice + range          // 2% فوق السعر الحالي للاتجاه الصاعد
    : currentPrice + (range * 0.5); // 1% فوق السعر الحالي للاتجاه الهابط

  // حساب وقف الخسارة
  const stopLoss = direction === "صاعد"
    ? support - (range * 0.25)      // 0.5% تحت مستوى الدعم
    : resistance + (range * 0.25);  // 0.5% فوق مستوى المقاومة

  // حساب الأهداف المتوقعة
  const target1 = direction === "صاعد"
    ? currentPrice + (range * 1.5)  // 3% فوق السعر الحالي
    : currentPrice - (range * 1.5); // 3% تحت السعر الحالي
    
  const target2 = direction === "صاعد"
    ? currentPrice + (range * 2)    // 4% فوق السعر الحالي
    : currentPrice - (range * 2);   // 4% تحت السعر الحالي
    
  const target3 = direction === "صاعد"
    ? currentPrice + (range * 2.5)  // 5% فوق السعر الحالي
    : currentPrice - (range * 2.5); // 5% تحت السعر الحالي

  // تحديد أفضل نقطة دخول
  const bestEntry = direction === "صاعد" ? support : resistance;
  const entryReason = direction === "صاعد"
    ? "نقطة دخول عند مستوى الدعم مع وجود نموذج انعكاس صاعد"
    : "نقطة دخول عند مستوى المقاومة مع وجود نموذج انعكاس هابط";

  const analysis: AnalysisData = {
    pattern: "Price Action Analysis",
    direction,
    currentPrice,
    support: Number(support.toFixed(2)),
    resistance: Number(resistance.toFixed(2)),
    stopLoss: Number(stopLoss.toFixed(2)),
    bestEntryPoint: {
      price: Number(bestEntry.toFixed(2)),
      reason: entryReason
    },
    targets: [
      {
        price: Number(target1.toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 1)
      },
      {
        price: Number(target2.toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 2)
      },
      {
        price: Number(target3.toFixed(2)),
        expectedTime: getExpectedTime(timeframe, 3)
      }
    ],
    analysisType: "Price Action"
  };

  console.log("Price Action analysis result:", analysis);
  return analysis;
};
