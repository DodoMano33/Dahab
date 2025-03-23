
/**
 * وحدة تحليل الشارت باستخدام خوارزميات التعلم الآلي الأساسية
 */
import { AnalysisData } from "@/types/analysis";
import { 
  predictFuturePrice, 
  predictFutureSupportResistance
} from "@/utils/technicalAnalysis/mlPrediction";
import { getExpectedTime } from "@/utils/technicalAnalysis";
import { 
  calculateTargets, 
  calculateStopLoss, 
  calculateBestEntryPoint 
} from "@/utils/technicalAnalysis/priceAnalysis";
import { generateSimulatedPrices } from "./simulatedData";

/**
 * تحليل الشارت باستخدام خوارزميات التعلم الآلي
 * @param chartImage - صورة الشارت (تستخدم فقط للتوافق مع واجهات أخرى، لا تُستخدم في التحليل الفعلي)
 * @param currentPrice - السعر الحالي
 * @param timeframe - الإطار الزمني
 * @param historicalPrices - البيانات التاريخية للأسعار (مطلوبة للخوارزميات)
 * @returns نتائج التحليل
 */
export const analyzeMLChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  historicalPrices: number[] = []
): Promise<AnalysisData> => {
  console.log("بدء تحليل ML للرمز:", timeframe);
  console.log(`باستخدام ${historicalPrices.length} نقطة بيانات تاريخية`);

  // التأكد من وجود بيانات كافية
  if (historicalPrices.length < 20) {
    console.warn("البيانات التاريخية غير كافية للتحليل، مطلوب 20 نقطة على الأقل");
    historicalPrices = generateSimulatedPrices(currentPrice);
  }

  // استخدام خوارزمية التعلم الآلي للتنبؤ بالسعر المستقبلي
  const prediction = predictFuturePrice(historicalPrices, timeframe, currentPrice);
  console.log("نتائج التنبؤ:", prediction);

  // التنبؤ بمستويات الدعم والمقاومة المستقبلية
  const levelsPredict = predictFutureSupportResistance(historicalPrices, currentPrice);
  console.log("مستويات الدعم والمقاومة المتوقعة:", levelsPredict);

  // استخدام مستويات الدعم والمقاومة المتنبأ بها
  const support = levelsPredict.futureSupport;
  const resistance = levelsPredict.futureResistance;

  // حساب وقف الخسارة بناءً على الاتجاه المتوقع
  const stopLoss = calculateStopLoss(
    currentPrice, 
    prediction.predictedDirection, 
    support, 
    resistance, 
    timeframe
  );

  // حساب الأهداف
  const targetPrices = calculateTargets(
    currentPrice, 
    prediction.predictedDirection, 
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
    prediction.predictedDirection, 
    support, 
    resistance, 
    fibLevels,
    timeframe
  );

  // إضافة معلومات الثقة إلى سبب نقطة الدخول
  bestEntry.reason = `${bestEntry.reason} (ثقة: ${Math.round(prediction.confidence * 100)}%)`;

  // بناء كائن التحليل النهائي
  const analysisResult: AnalysisData = {
    pattern: `نموذج تعلم آلي - ${prediction.algorithm}`,
    direction: prediction.predictedDirection,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    analysisType: "شبكات عصبية",
    activation_type: "تلقائي"
  };

  console.log("نتائج تحليل ML:", analysisResult);
  return analysisResult;
};
