
/**
 * وحدة تحليل الشارت عبر أطر زمنية متعددة باستخدام خوارزميات التعلم الآلي
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
import { generateSimulatedPrices } from "./simulatedData";

/**
 * تحليل الشارت عبر أطر زمنية متعددة باستخدام التعلم الآلي
 * @param chartImage - صورة الشارت
 * @param currentPrice - السعر الحالي
 * @param timeframe - الإطار الزمني الرئيسي
 * @param historicalPricesMap - خريطة تحتوي على بيانات أسعار تاريخية لكل إطار زمني
 * @returns نتائج التحليل
 */
export const analyzeMultiTimeframeML = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  historicalPricesMap: { [timeframe: string]: number[] } = {}
): Promise<AnalysisData> => {
  console.log("بدء تحليل ML متعدد الأطر الزمنية للرمز:", timeframe);
  
  // التأكد من وجود بيانات كافية
  if (Object.keys(historicalPricesMap).length === 0) {
    const simulatedPrices = generateSimulatedPrices(currentPrice);
    historicalPricesMap = {
      "1h": simulatedPrices,
      "4h": simulatedPrices.slice(0, Math.floor(simulatedPrices.length * 0.8)),
      "1d": simulatedPrices.slice(0, Math.floor(simulatedPrices.length * 0.5))
    };
  }
  
  // تحليل عبر الأطر الزمنية المتعددة
  const mtfAnalysis = multiTimeframeAnalysis(
    historicalPricesMap,
    currentPrice,
    Object.keys(historicalPricesMap)
  );
  
  console.log("نتائج تحليل الأطر الزمنية المتعددة:", mtfAnalysis);
  
  // استخدام نتائج تحليل الإطار الزمني المتعدد
  const mainTimeframePredict = mtfAnalysis.predictions[timeframe] || 
                              predictFuturePrice(historicalPricesMap[timeframe] || [], timeframe, currentPrice);
  
  // التنبؤ بمستويات الدعم والمقاومة
  const levelsPredict = predictFutureSupportResistance(historicalPricesMap[timeframe] || [], currentPrice);
  
  // استخدام الاتجاه العام من تحليل الأطر الزمنية المتعددة
  const direction = mtfAnalysis.overallDirection;
  
  const support = levelsPredict.futureSupport;
  const resistance = levelsPredict.futureResistance;
  
  // حساب وقف الخسارة
  const stopLoss = calculateStopLoss(
    currentPrice, 
    direction, 
    support, 
    resistance, 
    timeframe
  );
  
  // حساب الأهداف
  const targetPrices = calculateTargets(
    currentPrice, 
    direction, 
    support, 
    resistance, 
    timeframe
  );
  
  // إنشاء أهداف مع أوقات متوقعة
  const targets = targetPrices.map((price, index) => ({
    price,
    expectedTime: getExpectedTime(timeframe, index)
  }));
  
  // حساب نقطة الدخول المثالية
  const fibLevels = [{ level: 0.5, price: (support + resistance) / 2 }];
  const bestEntry = calculateBestEntryPoint(
    currentPrice, 
    direction, 
    support, 
    resistance, 
    fibLevels,
    timeframe
  );
  
  // إضافة معلومات الثقة وتوافق الأطر الزمنية إلى سبب نقطة الدخول
  bestEntry.reason = `${bestEntry.reason} (ثقة: ${Math.round(mtfAnalysis.confidence * 100)}%، توافق الأطر الزمنية: ${Math.round(mtfAnalysis.timeframeSyncScore * 100)}%)`;
  
  // بناء كائن التحليل النهائي
  const analysisResult: AnalysisData = {
    pattern: `تحليل ML متعدد الأطر الزمنية - ${Object.keys(mtfAnalysis.predictions).join(', ')}`,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    analysisType: "شبكات عصبية",
    activation_type: "تلقائي"
  };
  
  console.log("نتائج تحليل ML متعدد الأطر الزمنية:", analysisResult);
  return analysisResult;
};
