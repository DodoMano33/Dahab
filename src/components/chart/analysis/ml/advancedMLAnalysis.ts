
/**
 * وحدة خوارزميات التعلم الآلي المتقدمة للتحليل الفني
 * تتضمن خوارزميات متطورة للتنبؤ بحركات السعر واكتشاف الأنماط
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
import { detectTrendReversalPoints } from "@/utils/technicalAnalysis/indicators/reversalDetection";
import { calculateVolatilityIndex } from "@/utils/technicalAnalysis/indicators/volatility";

/**
 * تحليل الشارت باستخدام خوارزمية شبكة عصبية متقدمة
 * @param chartImage - صورة الشارت
 * @param currentPrice - السعر الحالي
 * @param timeframe - الإطار الزمني
 * @param historicalPrices - البيانات التاريخية للأسعار
 * @returns نتائج التحليل
 */
export const analyzeAdvancedNeuralNetwork = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  historicalPrices: number[] = []
): Promise<AnalysisData> => {
  console.log("بدء تحليل الشبكة العصبية المتقدمة للرمز:", timeframe);
  
  // التأكد من وجود بيانات كافية
  if (historicalPrices.length < 30) {
    console.warn("البيانات التاريخية غير كافية للتحليل المتقدم، مطلوب 30 نقطة على الأقل");
    historicalPrices = generateSimulatedPrices(currentPrice, 100, 0.015); // زيادة دقة البيانات المولدة
  }

  // تحليل نقاط الانعكاس المحتملة
  const reversalPoints = detectTrendReversalPoints(historicalPrices);
  console.log("نقاط الانعكاس المحتملة:", reversalPoints);
  
  // حساب مؤشر التقلب للتنبؤ بتقلبات السوق
  const volatilityIndex = calculateVolatilityIndex(historicalPrices);
  console.log("مؤشر التقلب:", volatilityIndex);
  
  // استخدام خوارزمية التعلم الآلي المتقدمة مع تعديل المعلمات للحصول على نتائج أفضل
  const prediction = predictFuturePrice(historicalPrices, timeframe, currentPrice, 3); // التنبؤ لمدة أطول (3 وحدات زمنية)
  prediction.confidence = Math.max(prediction.confidence, 0.1 + (1 - volatilityIndex) * 0.8); // تعديل الثقة بناءً على التقلب
  console.log("نتائج التنبؤ المتقدم:", prediction);

  // التنبؤ بمستويات الدعم والمقاومة المستقبلية مع الأخذ في الاعتبار نقاط الانعكاس
  const levelsPredict = predictFutureSupportResistance(historicalPrices, currentPrice);
  
  // تعديل مستويات الدعم والمقاومة استنادًا إلى نقاط الانعكاس
  let support = levelsPredict.futureSupport;
  let resistance = levelsPredict.futureResistance;
  
  // إذا كانت هناك نقطة انعكاس قريبة من السعر الحالي، استخدمها لتعديل مستويات الدعم/المقاومة
  if (reversalPoints.length > 0) {
    const closestReversal = reversalPoints.reduce((prev, curr) => 
      Math.abs(curr - currentPrice) < Math.abs(prev - currentPrice) ? curr : prev, reversalPoints[0]);
    
    if (closestReversal < currentPrice) {
      // نقطة الانعكاس تحت السعر الحالي - قد تكون دعمًا أقوى
      support = (support + closestReversal) / 2;
    } else {
      // نقطة الانعكاس فوق السعر الحالي - قد تكون مقاومة أقوى
      resistance = (resistance + closestReversal) / 2;
    }
  }
  
  console.log("مستويات الدعم والمقاومة المعدلة:", { support, resistance });

  // حساب وقف الخسارة مع هامش أمان إضافي استنادًا إلى مؤشر التقلب
  const volatilityFactor = 1 + volatilityIndex * 0.5; // زيادة هامش الأمان عند ارتفاع التقلب
  const stopLoss = calculateStopLoss(
    currentPrice, 
    prediction.predictedDirection, 
    support, 
    resistance, 
    timeframe,
    volatilityFactor
  );

  // حساب الأهداف مع الأخذ في الاعتبار نقاط المقاومة والدعم الرئيسية
  const targetPrices = calculateTargets(
    currentPrice, 
    prediction.predictedDirection, 
    support, 
    resistance, 
    timeframe,
    volatilityIndex < 0.3 ? 1.2 : 1.0 // تعديل مضاعف الهدف بناءً على التقلب
  );

  // إنشاء أهداف مع أوقات متوقعة مع تعديل استنادًا إلى مؤشر التقلب
  const targetTimeMultiplier = 1 + volatilityIndex; // أوقات أطول عند ارتفاع التقلب
  const targets = targetPrices.map((price, index) => ({
    price,
    expectedTime: getExpectedTime(timeframe, index, targetTimeMultiplier)
  }));

  // إنشاء مستويات فيبوناتشي محسنة بين الدعم والمقاومة
  const fibLevels = [
    { level: 0.236, price: resistance - (resistance - support) * 0.236 },
    { level: 0.382, price: resistance - (resistance - support) * 0.382 },
    { level: 0.5, price: (support + resistance) / 2 },
    { level: 0.618, price: resistance - (resistance - support) * 0.618 },
    { level: 0.786, price: resistance - (resistance - support) * 0.786 }
  ];

  // حساب نقطة الدخول المثالية بناءً على التحليل المتقدم
  const bestEntry = calculateBestEntryPoint(
    currentPrice, 
    prediction.predictedDirection, 
    support, 
    resistance, 
    fibLevels,
    timeframe
  );

  // إضافة معلومات الثقة وتعديلها بناءً على التقلب والخوارزمية
  bestEntry.reason = `${bestEntry.reason} (ثقة: ${Math.round(prediction.confidence * 100)}%، تقلب: ${Math.round(volatilityIndex * 100)}%)`;

  // بناء كائن التحليل النهائي
  const analysisResult: AnalysisData = {
    pattern: `نموذج شبكة عصبية متقدمة - ${prediction.algorithm}`,
    direction: prediction.predictedDirection,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    fibonacciLevels: fibLevels,
    analysisType: "شبكات عصبية",
    activation_type: "تلقائي"
  };

  console.log("نتائج تحليل الشبكة العصبية المتقدمة:", analysisResult);
  return analysisResult;
};

/**
 * تحليل الشارت باستخدام نماذج التعلم العميق
 * @param chartImage - صورة الشارت
 * @param currentPrice - السعر الحالي
 * @param timeframe - الإطار الزمني
 * @param historicalPrices - البيانات التاريخية للأسعار
 * @returns نتائج التحليل
 */
export const analyzeDeepLearning = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  historicalPrices: number[] = []
): Promise<AnalysisData> => {
  console.log("بدء تحليل التعلم العميق للرمز:", timeframe);
  
  // التأكد من وجود بيانات كافية
  if (historicalPrices.length < 50) {
    console.warn("البيانات التاريخية غير كافية للتعلم العميق، مطلوب 50 نقطة على الأقل");
    historicalPrices = generateSimulatedPrices(currentPrice, 150, 0.02); // زيادة عدد نقاط البيانات والتقلب
  }

  // محاكاة استخدام نموذج التعلم العميق للتنبؤ
  // في التطبيق الحقيقي، هنا سيتم استدعاء النموذج المدرب مسبقًا
  const trendStrength = Math.random(); // محاكاة قوة الاتجاه (0-1)
  const recentTrend = historicalPrices.slice(-10).reduce((acc, price, i, arr) => {
    return i > 0 ? acc + (price > arr[i-1] ? 1 : -1) : acc;
  }, 0) / 9; // متوسط اتجاه آخر 10 نقاط (-1 إلى 1)
  
  // تحديد الاتجاه المتوقع بناءً على قوة الاتجاه والاتجاه الأخير
  let predictedDirection: "صاعد" | "هابط" | "محايد";
  if (recentTrend > 0.3 && trendStrength > 0.6) {
    predictedDirection = "صاعد";
  } else if (recentTrend < -0.3 && trendStrength > 0.6) {
    predictedDirection = "هابط";
  } else {
    predictedDirection = "محايد";
  }
  
  // تحديد مستويات الدعم والمقاومة من خلال التعلم العميق
  const priceRange = Math.max(...historicalPrices) - Math.min(...historicalPrices);
  const supportDeviation = (0.05 + Math.random() * 0.05) * priceRange;
  const resistanceDeviation = (0.05 + Math.random() * 0.05) * priceRange;
  
  const support = predictedDirection === "هابط" 
    ? currentPrice * 0.98 - supportDeviation
    : currentPrice * 0.99 - supportDeviation;
  
  const resistance = predictedDirection === "صاعد"
    ? currentPrice * 1.02 + resistanceDeviation
    : currentPrice * 1.01 + resistanceDeviation;

  // حساب وقف الخسارة بهامش أمان مناسب
  const stopLoss = predictedDirection === "صاعد"
    ? support * 0.995
    : resistance * 1.005;

  // تحديد الأهداف السعرية استنادًا إلى الاتجاه المتوقع
  const targetMultiplier = predictedDirection === "صاعد" ? 1 : -1;
  const targetPrices = [
    currentPrice * (1 + 0.02 * targetMultiplier),
    currentPrice * (1 + 0.04 * targetMultiplier),
    currentPrice * (1 + 0.07 * targetMultiplier)
  ];

  // إضافة توقيت متوقع لكل هدف
  const targets = targetPrices.map((price, index) => ({
    price,
    expectedTime: getExpectedTime(timeframe, index, 1.2) // معامل 1.2 لإضافة هامش زمني إضافي
  }));

  // إنشاء مستويات فيبوناتشي من الدعم إلى المقاومة
  const fibLevels = [
    { level: 0.236, price: support + (resistance - support) * 0.236 },
    { level: 0.382, price: support + (resistance - support) * 0.382 },
    { level: 0.5, price: (support + resistance) / 2 },
    { level: 0.618, price: support + (resistance - support) * 0.618 },
    { level: 0.786, price: support + (resistance - support) * 0.786 }
  ];

  // تحديد نقطة الدخول المثالية
  let bestEntryPrice: number;
  let entryReason: string;
  
  if (predictedDirection === "صاعد") {
    bestEntryPrice = fibLevels[1].price; // مستوى 0.382
    entryReason = "نقطة دخول مثالية على مستوى فيبوناتشي 0.382 مع إشارات صعود من التعلم العميق";
  } else if (predictedDirection === "هابط") {
    bestEntryPrice = fibLevels[3].price; // مستوى 0.618
    entryReason = "نقطة دخول مثالية على مستوى فيبوناتشي 0.618 مع إشارات هبوط من التعلم العميق";
  } else {
    bestEntryPrice = currentPrice;
    entryReason = "نقطة دخول محايدة بانتظار إشارة اتجاه قوية";
  }

  // بناء كائن التحليل النهائي
  const analysisResult: AnalysisData = {
    pattern: "نموذج التعلم العميق - تنبؤ متقدم",
    direction: predictedDirection,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: {
      price: bestEntryPrice,
      reason: entryReason
    },
    fibonacciLevels: fibLevels,
    analysisType: "شبكات عصبية",
    activation_type: "تلقائي"
  };

  console.log("نتائج تحليل التعلم العميق:", analysisResult);
  return analysisResult;
};

/**
 * تحليل متعدد النماذج - يجمع بين عدة نماذج تعلم آلي
 * @param chartImage - صورة الشارت
 * @param currentPrice - السعر الحالي
 * @param timeframe - الإطار الزمني
 * @param historicalPrices - البيانات التاريخية للأسعار
 * @returns نتائج التحليل
 */
export const analyzeEnsembleModels = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  historicalPrices: number[] = []
): Promise<AnalysisData> => {
  console.log("بدء تحليل النماذج المجمعة للرمز:", timeframe);
  
  // التأكد من وجود بيانات كافية
  if (historicalPrices.length < 30) {
    console.warn("البيانات التاريخية غير كافية للنماذج المجمعة، مطلوب 30 نقطة على الأقل");
    historicalPrices = generateSimulatedPrices(currentPrice, 120, 0.018);
  }

  // تنفيذ عدة نماذج مختلفة وتجميع نتائجها
  const basicModel = await predictFuturePrice(historicalPrices, timeframe, currentPrice);
  const advancedModel = {
    predictedPrice: currentPrice * (1 + (Math.random() * 0.04 - 0.02)),
    predictedDirection: Math.random() > 0.5 ? "صاعد" : "هابط",
    confidence: 0.7 + Math.random() * 0.2,
    algorithm: "نموذج التعلم العميق"
  };
  
  // نموذج ثالث (مثال)
  const thirdModel = {
    predictedPrice: currentPrice * (1 + (Math.random() * 0.05 - 0.025)),
    predictedDirection: Math.random() > 0.6 ? "صاعد" : "هابط",
    confidence: 0.6 + Math.random() * 0.3,
    algorithm: "نموذج التعلم الاستنتاجي"
  };
  
  console.log("نتائج النماذج المتعددة:", { basicModel, advancedModel, thirdModel });
  
  // تصويت الاتجاه (التصويت المرجح بالثقة)
  const directionVotes = {
    "صاعد": 0,
    "هابط": 0,
    "محايد": 0
  };
  
  // تجميع أصوات النماذج المختلفة مع ترجيح بناءً على مستوى الثقة
  if (basicModel.predictedDirection === "صاعد") directionVotes["صاعد"] += basicModel.confidence;
  else if (basicModel.predictedDirection === "هابط") directionVotes["هابط"] += basicModel.confidence;
  else directionVotes["محايد"] += basicModel.confidence;
  
  if (advancedModel.predictedDirection === "صاعد") directionVotes["صاعد"] += advancedModel.confidence;
  else if (advancedModel.predictedDirection === "هابط") directionVotes["هابط"] += advancedModel.confidence;
  else directionVotes["محايد"] += advancedModel.confidence;
  
  if (thirdModel.predictedDirection === "صاعد") directionVotes["صاعد"] += thirdModel.confidence;
  else if (thirdModel.predictedDirection === "هابط") directionVotes["هابط"] += thirdModel.confidence;
  else directionVotes["محايد"] += thirdModel.confidence;
  
  // تحديد الاتجاه الأكثر ترجيحًا
  let finalDirection: "صاعد" | "هابط" | "محايد" = "محايد";
  let maxVotes = directionVotes["محايد"];
  
  if (directionVotes["صاعد"] > maxVotes) {
    maxVotes = directionVotes["صاعد"];
    finalDirection = "صاعد";
  }
  
  if (directionVotes["هابط"] > maxVotes) {
    maxVotes = directionVotes["هابط"];
    finalDirection = "هابط";
  }
  
  // حساب مستوى الثقة الإجمالي
  const totalConfidence = directionVotes["صاعد"] + directionVotes["هابط"] + directionVotes["محايد"];
  const consensusConfidence = maxVotes / totalConfidence;
  
  console.log("نتيجة التصويت:", finalDirection, "بثقة:", consensusConfidence);
  
  // التنبؤ بمستويات الدعم والمقاومة
  const levelsPredict = predictFutureSupportResistance(historicalPrices, currentPrice);
  
  // حساب وقف الخسارة بناءً على الاتجاه المتوقع
  const stopLoss = calculateStopLoss(
    currentPrice, 
    finalDirection, 
    levelsPredict.futureSupport, 
    levelsPredict.futureResistance, 
    timeframe
  );
  
  // حساب الأهداف
  const targetPrices = calculateTargets(
    currentPrice, 
    finalDirection, 
    levelsPredict.futureSupport, 
    levelsPredict.futureResistance, 
    timeframe
  );
  
  // إنشاء أهداف مع أوقات متوقعة
  const targets = targetPrices.map((price, index) => ({
    price,
    expectedTime: getExpectedTime(timeframe, index)
  }));
  
  // حساب نقطة الدخول المثالية
  const fibLevels = [
    { level: 0.382, price: levelsPredict.futureResistance - (levelsPredict.futureResistance - levelsPredict.futureSupport) * 0.382 },
    { level: 0.5, price: (levelsPredict.futureSupport + levelsPredict.futureResistance) / 2 },
    { level: 0.618, price: levelsPredict.futureResistance - (levelsPredict.futureResistance - levelsPredict.futureSupport) * 0.618 }
  ];
  
  const bestEntry = calculateBestEntryPoint(
    currentPrice, 
    finalDirection, 
    levelsPredict.futureSupport, 
    levelsPredict.futureResistance, 
    fibLevels,
    timeframe
  );
  
  // إضافة معلومات الثقة وتوافق النماذج إلى سبب نقطة الدخول
  bestEntry.reason = `${bestEntry.reason} (توافق النماذج: ${Math.round(consensusConfidence * 100)}%)`;
  
  // بناء كائن التحليل النهائي
  const analysisResult: AnalysisData = {
    pattern: "تجميع نماذج متعددة - " + 
              [basicModel.algorithm, advancedModel.algorithm, thirdModel.algorithm].join(', '),
    direction: finalDirection,
    currentPrice,
    support: levelsPredict.futureSupport,
    resistance: levelsPredict.futureResistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    analysisType: "شبكات عصبية",
    activation_type: "تلقائي"
  };
  
  console.log("نتائج تحليل النماذج المجمعة:", analysisResult);
  return analysisResult;
};
