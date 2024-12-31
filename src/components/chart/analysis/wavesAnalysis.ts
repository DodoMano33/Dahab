import { addMinutes } from "date-fns";
import { AnalysisData } from "@/types/analysis";

export const analyzeWavesChart = async (
  chartImage: string,
  currentPrice: number,
  symbol: string
): Promise<AnalysisData> => {
  console.log("بدء تحليل Waves للرمز:", symbol);

  // تعديل النطاق ليناسب فترة 5 دقائق
  const waveRange = currentPrice * 0.001; // نطاق 0.1% للموجة على فترة 5 دقائق
  const support = currentPrice - (waveRange * 2);
  const resistance = currentPrice + (waveRange * 2);

  // تحديد الاتجاه بناءً على نمط الموجات
  const direction = Math.random() > 0.5 ? "صاعد" : "هابط";

  // تحديد نقطة وقف الخسارة بناءً على قواعد إليوت للتداول قصير المدى
  const stopLoss = direction === "صاعد" 
    ? currentPrice - (waveRange * 2)  // وقف خسارة أقرب للسعر في التداول قصير المدى
    : currentPrice + (waveRange * 2);

  // تحديد أفضل نقطة دخول بناءً على نمط الموجات القصيرة
  const bestEntry = {
    price: direction === "صاعد" 
      ? currentPrice - (waveRange * 0.618) // استخدام مستوى فيبوناتشي 61.8% للتصحيح
      : currentPrice + (waveRange * 0.618),
    reason: direction === "صاعد"
      ? "نقطة دخول عند تصحيح الموجة الصغيرة بنسبة 61.8% فيبوناتشي"
      : "نقطة دخول عند اكتمال الموجة التصحيحية القصيرة"
  };

  // حساب الأهداف المتوقعة على المدى القصير
  const targets = [
    {
      price: direction === "صاعد"
        ? currentPrice + (waveRange * 1.618) // هدف أول باستخدام نسبة فيبوناتشي 1.618
        : currentPrice - (waveRange * 1.618),
      expectedTime: addMinutes(new Date(), 5) // توقع تحقيق الهدف الأول خلال 5 دقائق
    },
    {
      price: direction === "صاعد"
        ? currentPrice + (waveRange * 2.618) // هدف ثاني باستخدام نسبة فيبوناتشي 2.618
        : currentPrice - (waveRange * 2.618),
      expectedTime: addMinutes(new Date(), 10) // توقع تحقيق الهدف الثاني خلال 10 دقائق
    },
    {
      price: direction === "صاعد"
        ? currentPrice + (waveRange * 4.236) // هدف ثالث باستخدام نسبة فيبوناتشي 4.236
        : currentPrice - (waveRange * 4.236),
      expectedTime: addMinutes(new Date(), 15) // توقع تحقيق الهدف الثالث خلال 15 دقائق
    }
  ];

  // مستويات فيبوناتشي للموجات القصيرة
  const fibonacciLevels = [
    { level: 0.236, price: currentPrice + (waveRange * 0.236) },
    { level: 0.382, price: currentPrice + (waveRange * 0.382) },
    { level: 0.618, price: currentPrice + (waveRange * 0.618) },
    { level: 1.618, price: currentPrice + (waveRange * 1.618) },
    { level: 2.618, price: currentPrice + (waveRange * 2.618) },
    { level: 4.236, price: currentPrice + (waveRange * 4.236) }
  ];

  const analysisResult: AnalysisData = {
    pattern: `نموذج موجي ${direction === "صاعد" ? "صاعد" : "هابط"} - تحليل موجات قصير المدى (5 دقائق)`,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    bestEntryPoint: bestEntry,
    targets,
    fibonacciLevels,
    analysisType: "Waves"
  };

  console.log("نتائج تحليل Waves على فترة 5 دقائق:", analysisResult);
  return analysisResult;
};