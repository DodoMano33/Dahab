
/**
 * وحدة التنبؤ المحسنة باستخدام التعلم الآلي
 */

import { AnalysisData } from "@/types/analysis";
import { 
  predictFuturePrice, 
  predictFutureSupportResistance, 
  multiTimeframeAnalysis 
} from "@/utils/technicalAnalysis/mlPrediction";
import { getExpectedTime } from "@/utils/technicalAnalysis";
import { 
  calculateTargets, 
  calculateStopLoss, 
  calculateBestEntryPoint 
} from "@/utils/technicalAnalysis/priceAnalysis";
import { 
  getMultiTimeframeTrendSyncScore, 
  analyzeMultiTimeframeMomentum 
} from "@/utils/technicalAnalysis/predictors/multiTimeframePredictor";
import { analyzeTrendReversalPoints } from "@/utils/technicalAnalysis/predictors/trendReversalPredictor";

/**
 * تنفيذ تحليل محسن باستخدام التعلم الآلي ودمج عدة أطر زمنية
 */
export async function performEnhancedMLAnalysis(
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  historicalPrices: number[]
): Promise<AnalysisData> {
  console.log("تنفيذ تحليل محسن باستخدام التعلم الآلي");
  
  // 1. تحليل توافق الأطر الزمنية المتعددة
  const mtfSyncData = await getMultiTimeframeTrendSyncScore(historicalPrices, timeframe);
  console.log("نتائج تحليل توافق الأطر الزمنية:", mtfSyncData);
  
  // 2. تحليل الزخم
  const momentumData = await analyzeMultiTimeframeMomentum('XAUUSD', currentPrice);
  console.log("نتائج تحليل الزخم:", momentumData);
  
  // 3. تحليل نقاط الانعكاس المحتملة
  const reversalData = analyzeTrendReversalPoints(historicalPrices, currentPrice);
  console.log("نتائج تحليل نقاط الانعكاس:", reversalData);
  
  // 4. التنبؤ بالاتجاه والسعر المستقبلي
  const prediction = predictFuturePrice(historicalPrices, timeframe, currentPrice);
  console.log("نتائج التنبؤ بالسعر:", prediction);
  
  // 5. التنبؤ بمستويات الدعم والمقاومة
  const levelsPredict = predictFutureSupportResistance(historicalPrices, currentPrice);
  console.log("نتائج التنبؤ بالدعم والمقاومة:", levelsPredict);
  
  // دمج البيانات وتحديد الاتجاه النهائي
  // نستخدم توافق الأطر الزمنية كعامل ترجيح رئيسي
  let finalDirection: "صاعد" | "هابط" | "محايد" = mtfSyncData.dominantTrend;
  
  // زيادة الثقة إذا كان هناك توافق بين التحليلات المختلفة
  let confidenceMultiplier = 1.0;
  
  if (mtfSyncData.dominantTrend === prediction.predictedDirection) {
    confidenceMultiplier += 0.2;
  }
  
  if (momentumData.momentumScore > 0 && mtfSyncData.dominantTrend === "صاعد") {
    confidenceMultiplier += 0.15;
  } else if (momentumData.momentumScore < 0 && mtfSyncData.dominantTrend === "هابط") {
    confidenceMultiplier += 0.15;
  }
  
  // خفض الثقة إذا كان هناك احتمال انعكاس قوي
  if (reversalData.isReversalLikely && reversalData.reversalProbability > 0.7) {
    confidenceMultiplier -= 0.25;
    // قد نقوم بعكس الاتجاه المتوقع إذا كانت إشارات الانعكاس قوية جدًا
    if (reversalData.reversalProbability > 0.85) {
      finalDirection = finalDirection === "صاعد" ? "هابط" : "صاعد";
    }
  }
  
  // حساب الثقة النهائية
  const finalConfidence = Math.min(0.95, mtfSyncData.confidence * confidenceMultiplier);
  
  // اختيار مستويات الدعم والمقاومة النهائية
  const support = levelsPredict.futureSupport;
  const resistance = levelsPredict.futureResistance;
  
  // حساب وقف الخسارة
  const stopLoss = calculateStopLoss(
    currentPrice, 
    finalDirection, 
    support, 
    resistance, 
    timeframe
  );
  
  // حساب الأهداف
  const targetPrices = calculateTargets(
    currentPrice, 
    finalDirection, 
    support, 
    resistance, 
    timeframe
  );
  
  // إضافة أوقات متوقعة للأهداف
  const targets = targetPrices.map((price, index) => ({
    price,
    expectedTime: getExpectedTime(timeframe, index + 1)
  }));
  
  // إضافة أي تحذيرات من تحليل الانعكاس
  let pattern = `تحليل محسن (${Math.round(finalConfidence * 100)}% ثقة)`;
  
  if (reversalData.warnings.length > 0) {
    pattern += ` - تحذير: ${reversalData.warnings[0]}`;
  }
  
  // حساب نقطة الدخول المثالية
  const fibLevels = [{ level: 0.5, price: (support + resistance) / 2 }];
  const bestEntry = calculateBestEntryPoint(
    currentPrice, 
    finalDirection, 
    support, 
    resistance, 
    fibLevels,
    timeframe
  );
  
  // إضافة معلومات توافق الأطر الزمنية إلى سبب نقطة الدخول
  bestEntry.reason = `${bestEntry.reason} (توافق الأطر الزمنية: ${mtfSyncData.alignedTimeframes.join(', ')})`;
  
  // بناء كائن التحليل النهائي
  return {
    pattern,
    direction: finalDirection,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    analysisType: "تعلم آلي",
    activation_type: "تلقائي"
  };
}
