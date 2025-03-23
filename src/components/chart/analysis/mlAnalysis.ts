
/**
 * وحدة تحليل الشارت باستخدام خوارزميات التعلم الآلي
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

/**
 * دالة مساعدة لتوليد بيانات محاكاة إذا لم تتوفر بيانات حقيقية
 */
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
