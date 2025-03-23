
/**
 * وحدة تحليل الشارت باستخدام خوارزميات التعلم الآلي الأساسية
 * تم تحسينها لتضمين مؤشرات فنية إضافية وتحسين دقة التنبؤات
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
import { 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands 
} from "@/utils/technicalAnalysis/indicators";

/**
 * تحليل الشارت باستخدام خوارزميات التعلم الآلي المحسنة
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
  console.log("بدء تحليل ML المحسّن للرمز:", timeframe);
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

  // تحليل مؤشرات فنية إضافية لتحسين الدقة
  let additionalConfidence = 0;
  let additionalInsights = "";

  // تحليل RSI للكشف عن التشبع الشرائي أو البيعي
  try {
    const rsiValues = calculateRSI(historicalPrices);
    const lastRSI = rsiValues[rsiValues.length - 1];
    
    if (lastRSI > 70) {
      additionalInsights += "مؤشر RSI يشير إلى تشبع شرائي محتمل. ";
      if (prediction.predictedDirection === "هابط") {
        additionalConfidence += 0.1;
      } else {
        additionalConfidence -= 0.1;
      }
    } else if (lastRSI < 30) {
      additionalInsights += "مؤشر RSI يشير إلى تشبع بيعي محتمل. ";
      if (prediction.predictedDirection === "صاعد") {
        additionalConfidence += 0.1;
      } else {
        additionalConfidence -= 0.1;
      }
    }
  } catch (error) {
    console.warn("تعذر حساب مؤشر RSI:", error);
  }

  // تحليل MACD للكشف عن تقاطعات السعر
  try {
    const macdResult = calculateMACD(historicalPrices);
    const lastMACD = macdResult.macdLine[macdResult.macdLine.length - 1];
    const lastSignal = macdResult.signalLine[macdResult.signalLine.length - 1];
    const prevMACD = macdResult.macdLine[macdResult.macdLine.length - 2];
    const prevSignal = macdResult.signalLine[macdResult.signalLine.length - 2];
    
    // تقاطع صعودي (MACD يتجاوز خط الإشارة)
    if (prevMACD < prevSignal && lastMACD > lastSignal) {
      additionalInsights += "مؤشر MACD يشير إلى تقاطع صعودي محتمل. ";
      if (prediction.predictedDirection === "صاعد") {
        additionalConfidence += 0.15;
      } else {
        additionalConfidence -= 0.05;
      }
    }
    // تقاطع هبوطي (MACD ينخفض تحت خط الإشارة)
    else if (prevMACD > prevSignal && lastMACD < lastSignal) {
      additionalInsights += "مؤشر MACD يشير إلى تقاطع هبوطي محتمل. ";
      if (prediction.predictedDirection === "هابط") {
        additionalConfidence += 0.15;
      } else {
        additionalConfidence -= 0.05;
      }
    }
  } catch (error) {
    console.warn("تعذر حساب مؤشر MACD:", error);
  }

  // تحليل مؤشر بولينجر باند للكشف عن التقلبات
  try {
    const bollingerResult = calculateBollingerBands(historicalPrices);
    const lastPrice = historicalPrices[historicalPrices.length - 1];
    const lastUpper = bollingerResult.upper[bollingerResult.upper.length - 1];
    const lastLower = bollingerResult.lower[bollingerResult.lower.length - 1];
    
    if (lastPrice > lastUpper * 0.98) {
      additionalInsights += "السعر الحالي قريب من الحد العلوي لمؤشر بولينجر باند، مما قد يشير إلى إمكانية الارتداد للأسفل. ";
      if (prediction.predictedDirection === "هابط") {
        additionalConfidence += 0.1;
      }
    } else if (lastPrice < lastLower * 1.02) {
      additionalInsights += "السعر الحالي قريب من الحد السفلي لمؤشر بولينجر باند، مما قد يشير إلى إمكانية الارتداد للأعلى. ";
      if (prediction.predictedDirection === "صاعد") {
        additionalConfidence += 0.1;
      }
    }
  } catch (error) {
    console.warn("تعذر حساب مؤشر بولينجر باند:", error);
  }

  // تعديل مستوى الثقة بناءً على المؤشرات الإضافية
  const adjustedConfidence = Math.min(0.95, Math.max(0.05, prediction.confidence + additionalConfidence));
  console.log(`تم تعديل مستوى الثقة من ${prediction.confidence} إلى ${adjustedConfidence}`);

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
  const fibLevels = [
    { level: 0.236, price: resistance - (resistance - support) * 0.236 },
    { level: 0.382, price: resistance - (resistance - support) * 0.382 },
    { level: 0.5, price: (support + resistance) / 2 },
    { level: 0.618, price: resistance - (resistance - support) * 0.618 },
    { level: 0.786, price: resistance - (resistance - support) * 0.786 }
  ];
  
  const bestEntry = calculateBestEntryPoint(
    currentPrice, 
    prediction.predictedDirection, 
    support, 
    resistance, 
    fibLevels,
    timeframe
  );

  // إضافة معلومات الثقة والمؤشرات الإضافية إلى سبب نقطة الدخول
  bestEntry.reason = `${bestEntry.reason} (ثقة: ${Math.round(adjustedConfidence * 100)}%)${additionalInsights ? ` ${additionalInsights}` : ''}`;

  // بناء كائن التحليل النهائي
  const analysisResult: AnalysisData = {
    pattern: `نموذج تعلم آلي محسّن - ${prediction.algorithm}`,
    direction: prediction.predictedDirection,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    analysisType: "شبكات عصبية",
    activation_type: "تلقائي",
    confidence_score: adjustedConfidence // إضافة درجة الثقة المعدلة
  };

  console.log("نتائج تحليل ML المحسّن:", analysisResult);
  return analysisResult;
};
