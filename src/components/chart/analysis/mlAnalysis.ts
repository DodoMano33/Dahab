
/**
 * وحدة تحليل ML المطورة
 * تم تحسينها لتقديم أهداف ووقف خسارة مختلفة عن أنواع التحليل الأخرى
 */

import { AnalysisData } from "@/types/analysis";
import { 
  calculateOptimalStopLoss, 
  calculateOptimalTargets
} from "@/utils/technicalAnalysis";
import { getExpectedTime } from "@/utils/technicalAnalysis/timeUtils";
import { analyzeMLChart as basicMLAnalysis } from "./ml/basicMLAnalysis";

/**
 * تحليل الشارت باستخدام خوارزميات التعلم الآلي المحسنة
 * تم تحديثها لإنتاج أهداف ووقف خسارة فريدة لتحليل ML
 */
export const analyzeMLChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  historicalPrices: number[] = []
): Promise<AnalysisData> => {
  console.log("تحليل ML محسن للشارت:", timeframe);
  
  // استخدام التحليل الأساسي للحصول على النتائج الأولية
  const baseAnalysis = await basicMLAnalysis(chartImage, currentPrice, timeframe, historicalPrices);
  
  // تخصيص وقف الخسارة باستخدام خوارزمية ML محددة
  const stopLoss = calculateOptimalStopLoss(
    currentPrice,
    baseAnalysis.direction as 'صاعد' | 'هابط',
    "ml", // نستخدم القيم المخصصة للتعلم الآلي
    timeframe,
    baseAnalysis.support,
    baseAnalysis.resistance
  );
  
  // تخصيص الأهداف باستخدام خوارزمية ML محددة
  const targetPrices = calculateOptimalTargets(
    currentPrice,
    baseAnalysis.direction as 'صاعد' | 'هابط',
    "ml", // نستخدم القيم المخصصة للتعلم الآلي
    timeframe,
    baseAnalysis.support,
    baseAnalysis.resistance
  );
  
  // إنشاء أهداف مع أوقات متوقعة
  const targets = targetPrices.map((price, index) => ({
    price,
    expectedTime: getExpectedTime(timeframe, index)
  }));
  
  // التأكد من وجود نقطة دخول مثالية
  const bestEntryPoint = baseAnalysis.bestEntryPoint || {
    price: currentPrice,
    reason: "نقطة الدخول المثالية بناءً على تحليل التعلم الآلي"
  };
  
  return {
    ...baseAnalysis,
    stopLoss,
    targets,
    bestEntryPoint,
    analysisType: "تعلم آلي",
    pattern: "نموذج تعلم آلي متقدم"
  };
};

/**
 * تحليل الشارت باستخدام تحليل الأطر الزمنية المتعددة
 */
export const analyzeMultiTimeframeML = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  multiTimeframeHistoricalPrices?: { [timeframe: string]: number[] }
): Promise<AnalysisData> => {
  console.log("تحليل متعدد الأطر الزمنية للشارت:", timeframe);
  
  // استخدام التحليل الأساسي للحصول على النتائج الأولية
  const baseAnalysis = await analyzeMLChart(chartImage, currentPrice, timeframe);
  
  // تخصيص وقف الخسارة بقيم مختلفة للتحليل متعدد الأطر الزمنية
  const stopLoss = calculateOptimalStopLoss(
    currentPrice,
    baseAnalysis.direction as 'صاعد' | 'هابط',
    "متعددالأطر", // نوع التحليل المخصص
    timeframe,
    baseAnalysis.support,
    baseAnalysis.resistance
  );
  
  // تخصيص الأهداف للتحليل متعدد الأطر الزمنية
  let targetPrices = calculateOptimalTargets(
    currentPrice,
    baseAnalysis.direction as 'صاعد' | 'هابط',
    "متعددالأطر", // نوع التحليل المخصص
    timeframe,
    baseAnalysis.support,
    baseAnalysis.resistance
  );
  
  // تعديل القيم بناءً على نسبة التقلب الإضافية
  const volatilityFactor = 1.2; // زيادة نطاق الأهداف
  targetPrices = targetPrices.map(target => {
    const diff = target - currentPrice;
    return currentPrice + (diff * volatilityFactor);
  });
  
  // إنشاء أهداف مع أوقات متوقعة أطول للتحليل متعدد الأطر الزمنية
  const targets = targetPrices.map((price, index) => ({
    price,
    expectedTime: getExpectedTime(timeframe, index + 2) // أوقات أطول للأهداف
  }));
  
  return {
    ...baseAnalysis,
    stopLoss,
    targets,
    analysisType: "تحليل متعدد الأطر الزمنية",
    pattern: "تحليل متعدد الأطر الزمنية باستخدام التعلم الآلي"
  };
};

