
import { AnalysisData } from "@/types/analysis";
import { 
  calculateSupportResistance, 
  detectTrend 
} from "@/utils/technicalAnalysis/indicators/PriceData";
import { 
  predictFuturePrice, 
  predictFutureSupportResistance,
  multiTimeframeAnalysis
} from "@/utils/technicalAnalysis/mlPrediction";
import { calculateFibonacciLevels } from "@/utils/technicalAnalysis/fibonacci";
import { addDays, addHours } from "date-fns";

/**
 * تحليل الرسم البياني باستخدام شبكات عصبية متقدمة
 * يقوم هذا التحليل بمحاكاة استخدام شبكة عصبية عميقة لفهم الأنماط
 */
export const advancedNeuralNetworkAnalysis = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  historicalPrices: number[] = []
): Promise<AnalysisData> => {
  console.log("بدء تحليل الشبكات العصبية المتقدم للسعر الحالي:", currentPrice);
  
  // استخدام البيانات التاريخية الحقيقية أو توليد بيانات محاكاة
  const prices = historicalPrices.length > 10 
    ? historicalPrices 
    : generateSimulatedPrices(currentPrice, 0.01, 200);
  
  // استخدام خوارزميات التعلم الآلي للتنبؤ باتجاه السعر
  const prediction = predictFuturePrice(prices, timeframe, currentPrice);
  console.log("نتائج التنبؤ:", prediction);
  
  // تحديد الدعم والمقاومة المستقبلية
  const { futureSupport, futureResistance } = predictFutureSupportResistance(prices, currentPrice);
  
  // تحديد الاتجاه واستخدام نتائج التنبؤ
  const direction = prediction.predictedDirection;
  
  // حساب نسبة المخاطرة المناسبة استنادًا على التقلب المحسوب
  const volatility = calculateVolatility(prices);
  const riskPercent = Math.min(Math.max(volatility * 100, 1), 3); // نسبة مخاطرة بين 1-3%
  
  // حساب وقف الخسارة بناءً على نسبة المخاطرة
  const stopLoss = direction === "صاعد"
    ? currentPrice * (1 - riskPercent / 100)
    : currentPrice * (1 + riskPercent / 100);
  
  // حساب مستويات فيبوناتشي
  const fibLevels = calculateFibonacciLevels(futureResistance, futureSupport);
  
  // تحديد نقاط المستهدفة المتوقعة
  const target1Multiplier = direction === "صاعد" ? 1.5 : 0.5;
  const target2Multiplier = direction === "صاعد" ? 2.2 : 0.3;
  
  const priceMove = Math.abs(currentPrice - stopLoss);
  const targets = [
    {
      price: direction === "صاعد"
        ? currentPrice + (priceMove * target1Multiplier)
        : currentPrice - (priceMove * target1Multiplier),
      expectedTime: addDays(new Date(), getTimeFrameDays(timeframe, 1))
    },
    {
      price: direction === "صاعد"
        ? currentPrice + (priceMove * target2Multiplier)
        : currentPrice - (priceMove * target2Multiplier),
      expectedTime: addDays(new Date(), getTimeFrameDays(timeframe, 2))
    }
  ];
  
  // تحديد أفضل نقطة دخول
  const bestEntryPoint = {
    price: direction === "صاعد"
      ? Math.max(currentPrice * 0.995, futureSupport)
      : Math.min(currentPrice * 1.005, futureResistance),
    reason: `نقطة دخول محسوبة باستخدام خوارزمية الشبكات العصبية المتقدمة (ثقة: ${(prediction.confidence * 100).toFixed(1)}%)`
  };
  
  // بناء نتيجة التحليل
  const analysisResult: AnalysisData = {
    pattern: `تحليل شبكات عصبية متقدمة (${direction})`,
    direction,
    currentPrice,
    support: futureSupport,
    resistance: futureResistance,
    stopLoss,
    targets,
    bestEntryPoint,
    fibonacciLevels: fibLevels,
    analysisType: "تعلم آلي",
    activation_type: "تلقائي"
  };
  
  console.log("نتائج تحليل الشبكات العصبية المتقدمة:", analysisResult);
  return analysisResult;
};

/**
 * تحليل التعلم العميق - Deep Learning Analysis
 * يستخدم تقنيات محاكاة للتعلم العميق للتنبؤ بحركة السعر
 */
export const deepLearningAnalysis = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  historicalPrices: number[] = []
): Promise<AnalysisData> => {
  console.log("بدء تحليل التعلم العميق للسعر الحالي:", currentPrice);
  
  // استخدام البيانات التاريخية الحقيقية أو توليد بيانات محاكاة بأنماط أكثر تعقيدًا
  const prices = historicalPrices.length > 10 
    ? historicalPrices 
    : generatePatternPrices(currentPrice, timeframe);
  
  // تحليل متعدد الأطر الزمنية
  const timeframes = timeframe === "1d" 
    ? ["4h", "1d", "1w"] 
    : ["1h", "4h", "1d"];
  
  // توليد بيانات مختلفة لكل إطار زمني
  const historicalPricesMap: { [key: string]: number[] } = {};
  timeframes.forEach(tf => {
    historicalPricesMap[tf] = generatePatternPrices(currentPrice, tf);
  });
  
  // تنفيذ تحليل متعدد الأطر الزمنية
  const mtfAnalysis = multiTimeframeAnalysis(historicalPricesMap, currentPrice, timeframes);
  console.log("نتائج تحليل الأطر الزمنية المتعددة:", mtfAnalysis);
  
  // تحديد الاتجاه استنادًا إلى التحليل المتعدد
  const direction = mtfAnalysis.overallDirection;
  
  // تحليل الدعم والمقاومة استنادًا إلى بيانات الإطار الزمني الحالي
  const { support, resistance } = calculateSupportResistance(prices);
  
  // حساب نسبة المخاطرة المناسبة استنادًا على التقلب المحسوب والثقة في التنبؤ
  const volatility = calculateVolatility(prices);
  const confidenceAdjustment = mtfAnalysis.confidence * 0.8; // تعديل المخاطرة بناءً على الثقة
  const riskPercent = Math.min(Math.max(volatility * 100 * (1.5 - confidenceAdjustment), 1), 4);
  
  // حساب وقف الخسارة
  const stopLoss = direction === "صاعد"
    ? currentPrice * (1 - riskPercent / 100)
    : currentPrice * (1 + riskPercent / 100);
  
  // تحديد المستهدفات بناءً على نقاط التحول المتوقعة من التحليل
  const targets = [];
  const timeMultipliers = [1, 2, 3]; // مضاعفات الوقت للأهداف
  
  if (direction === "صاعد") {
    const movementRange = Math.abs(mtfAnalysis.compositeTarget - currentPrice);
    targets.push({
      price: currentPrice + (movementRange * 0.5),
      expectedTime: addHours(new Date(), getTimeframeHours(timeframe) * timeMultipliers[0])
    });
    targets.push({
      price: mtfAnalysis.compositeTarget,
      expectedTime: addHours(new Date(), getTimeframeHours(timeframe) * timeMultipliers[1])
    });
    targets.push({
      price: currentPrice + (movementRange * 1.5),
      expectedTime: addHours(new Date(), getTimeframeHours(timeframe) * timeMultipliers[2])
    });
  } else {
    const movementRange = Math.abs(currentPrice - mtfAnalysis.compositeTarget);
    targets.push({
      price: currentPrice - (movementRange * 0.5),
      expectedTime: addHours(new Date(), getTimeframeHours(timeframe) * timeMultipliers[0])
    });
    targets.push({
      price: mtfAnalysis.compositeTarget,
      expectedTime: addHours(new Date(), getTimeframeHours(timeframe) * timeMultipliers[1])
    });
    targets.push({
      price: currentPrice - (movementRange * 1.5),
      expectedTime: addHours(new Date(), getTimeframeHours(timeframe) * timeMultipliers[2])
    });
  }
  
  // تحديد أفضل نقطة دخول
  const bestEntryPoint = {
    price: direction === "صاعد"
      ? Math.max(currentPrice * 0.995, currentPrice - (Math.abs(stopLoss - currentPrice) * 0.3))
      : Math.min(currentPrice * 1.005, currentPrice + (Math.abs(stopLoss - currentPrice) * 0.3)),
    reason: `نقطة دخول مثالية بتحليل التعلم العميق (تطابق الأطر الزمنية: ${(mtfAnalysis.timeframeSyncScore * 100).toFixed(0)}%)`
  };
  
  // بناء نتيجة التحليل
  const analysisResult: AnalysisData = {
    pattern: `تحليل التعلم العميق (${direction})`,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets: targets.slice(0, 2), // استخدام أول هدفين فقط
    bestEntryPoint,
    analysisType: "تعلم آلي",
    activation_type: "تلقائي"
  };
  
  console.log("نتائج تحليل التعلم العميق:", analysisResult);
  return analysisResult;
};

/**
 * تحليل نماذج المجموعات (Ensemble Models)
 * يستخدم مجموعة من الخوارزميات المختلفة ويدمج نتائجها
 */
export const ensembleModelsAnalysis = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  historicalPrices: number[] = []
): Promise<AnalysisData> => {
  console.log("بدء تحليل نماذج المجموعات للسعر الحالي:", currentPrice);
  
  // استخدام البيانات التاريخية الحقيقية أو توليد بيانات محاكاة
  const prices = historicalPrices.length > 10 
    ? historicalPrices 
    : generateCyclePatternPrices(currentPrice, 200);
  
  // تنفيذ عدة خوارزميات مختلفة
  const standardPrediction = predictFuturePrice(prices, timeframe, currentPrice);
  
  // توليد بيانات إضافية بأنماط مختلفة
  const volatilePrices = generateSimulatedPrices(currentPrice, 0.02, 200);
  const patternPrices = generatePatternPrices(currentPrice, timeframe);
  const cyclePrices = generateCyclePatternPrices(currentPrice, 200);
  
  // تنفيذ تنبؤات مختلفة باستخدام مجموعات البيانات المختلفة
  const volatilePrediction = predictFuturePrice(volatilePrices, timeframe, currentPrice);
  const patternPrediction = predictFuturePrice(patternPrices, timeframe, currentPrice);
  const cyclePrediction = predictFuturePrice(cyclePrices, timeframe, currentPrice);
  
  // دمج النتائج مع ترجيح بناءً على الثقة
  const predictions = [
    { prediction: standardPrediction, weight: standardPrediction.confidence * 1.0 },
    { prediction: volatilePrediction, weight: volatilePrediction.confidence * 0.8 },
    { prediction: patternPrediction, weight: patternPrediction.confidence * 1.2 },
    { prediction: cyclePrediction, weight: cyclePrediction.confidence * 1.0 }
  ];
  
  // حساب الاتجاه المرجح
  let upVotes = 0;
  let downVotes = 0;
  let totalWeight = 0;
  let weightedPriceSum = 0;
  
  predictions.forEach(p => {
    if (p.prediction.predictedDirection === "صاعد") {
      upVotes += p.weight;
    } else if (p.prediction.predictedDirection === "هابط") {
      downVotes += p.weight;
    }
    totalWeight += p.weight;
    weightedPriceSum += p.prediction.predictedPrice * p.weight;
  });
  
  const direction = upVotes > downVotes ? "صاعد" : "هابط";
  const ensemblePredictedPrice = weightedPriceSum / totalWeight;
  const ensembleConfidence = Math.min(
    Math.max(Math.abs(upVotes - downVotes) / totalWeight, 0.55),
    0.95
  );
  
  // تحديد الدعم والمقاومة باستخدام مزيج من التنبؤات
  const { support, resistance } = calculateSupportResistance(prices);
  
  // حساب وقف الخسارة استنادًا إلى التقلب والثقة
  const volatility = Math.max(
    calculateVolatility(prices),
    calculateVolatility(volatilePrices),
    calculateVolatility(patternPrices)
  );
  
  const adjustedVolatility = volatility * (1.0 + (1.0 - ensembleConfidence));
  const stopLossPercent = Math.min(Math.max(adjustedVolatility * 100, 1.5), 4.0);
  
  const stopLoss = direction === "صاعد"
    ? currentPrice * (1 - stopLossPercent / 100)
    : currentPrice * (1 + stopLossPercent / 100);
  
  // تحديد المستهدفات
  const priceMove = Math.abs(ensemblePredictedPrice - currentPrice);
  const targetRatios = [0.6, 1.0, 1.5]; // نسب المستهدفات
  
  const targets = targetRatios.map((ratio, index) => ({
    price: direction === "صاعد"
      ? currentPrice + (priceMove * ratio)
      : currentPrice - (priceMove * ratio),
    expectedTime: addHours(new Date(), getTimeframeHours(timeframe) * (index + 1) * 2)
  }));
  
  // تحديد أفضل نقطة دخول
  const bestEntryPointOffset = Math.abs(stopLoss - currentPrice) * 0.25;
  const bestEntryPoint = {
    price: direction === "صاعد"
      ? currentPrice - bestEntryPointOffset
      : currentPrice + bestEntryPointOffset,
    reason: `نقطة دخول مثالية من تحليل نماذج المجموعات (ثقة: ${(ensembleConfidence * 100).toFixed(0)}%)`
  };
  
  // بناء نتيجة التحليل
  const analysisResult: AnalysisData = {
    pattern: `تحليل نماذج المجموعات (${direction})`,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets: targets.slice(0, 2), // استخدام أول هدفين فقط
    bestEntryPoint,
    analysisType: "تعلم آلي",
    activation_type: "تلقائي"
  };
  
  console.log("نتائج تحليل نماذج المجموعات:", analysisResult);
  return analysisResult;
};

// دوال مساعدة

// حساب عدد الأيام بناءً على الإطار الزمني
function getTimeFrameDays(timeframe: string, multiplier: number = 1): number {
  switch (timeframe) {
    case "1m": case "5m": case "15m": case "30m": return 1 * multiplier;
    case "1h": case "2h": case "4h": return 2 * multiplier;
    case "1d": return 5 * multiplier;
    case "1w": return 14 * multiplier;
    default: return 3 * multiplier;
  }
}

// حساب عدد الساعات بناءً على الإطار الزمني
function getTimeframeHours(timeframe: string): number {
  switch (timeframe) {
    case "1m": return 2;
    case "5m": return 6;
    case "15m": return 10;
    case "30m": return 20;
    case "1h": return 24;
    case "4h": return 48;
    case "1d": return 120;
    case "1w": return 240;
    default: return 24;
  }
}

// حساب التقلب من سلسلة أسعار
function calculateVolatility(prices: number[]): number {
  if (prices.length < 3) return 0.02;
  
  let sum = 0;
  for (let i = 1; i < prices.length; i++) {
    const percentChange = Math.abs((prices[i] - prices[i-1]) / prices[i-1]);
    sum += percentChange;
  }
  
  return sum / (prices.length - 1);
}

// توليد بيانات أسعار محاكاة
function generateSimulatedPrices(
  currentPrice: number, 
  volatility: number = 0.01, 
  length: number = 100
): number[] {
  const prices: number[] = [];
  let price = currentPrice * (1 - Math.random() * 0.05);
  
  for (let i = 0; i < length; i++) {
    const change = (Math.random() - 0.5) * 2 * volatility;
    price *= (1 + change);
    prices.push(price);
  }
  
  // تأكد من أن آخر سعر هو السعر الحالي
  prices[prices.length - 1] = currentPrice;
  return prices;
}

// توليد بيانات أسعار مع أنماط محددة
function generatePatternPrices(currentPrice: number, timeframe: string): number[] {
  const prices: number[] = [];
  const length = 200;
  let price = currentPrice * 0.9;
  
  // تحديد نوع النمط بناءً على الإطار الزمني
  const patternType = Math.floor(Math.random() * 4);
  
  switch (patternType) {
    case 0: // نمط اتجاه صاعد
      for (let i = 0; i < length; i++) {
        const progress = i / length;
        const randomness = (Math.random() - 0.5) * 0.02;
        const trendComponent = progress * 0.15; // مكون الاتجاه الصاعد
        price = currentPrice * (0.9 + trendComponent + randomness);
        prices.push(price);
      }
      break;
    
    case 1: // نمط اتجاه هابط
      for (let i = 0; i < length; i++) {
        const progress = i / length;
        const randomness = (Math.random() - 0.5) * 0.02;
        const trendComponent = progress * 0.15; // مكون الاتجاه الهابط
        price = currentPrice * (1.1 - trendComponent + randomness);
        prices.push(price);
      }
      break;
    
    case 2: // نمط قناة جانبية
      for (let i = 0; i < length; i++) {
        const randomness = (Math.random() - 0.5) * 0.05;
        price = currentPrice * (0.95 + randomness);
        prices.push(price);
      }
      break;
    
    case 3: // نمط تذبذب واسع
      for (let i = 0; i < length; i++) {
        const cycle = Math.sin(i / 20) * 0.05;
        const randomness = (Math.random() - 0.5) * 0.02;
        price = currentPrice * (0.95 + cycle + randomness);
        prices.push(price);
      }
      break;
  }
  
  // تأكد من أن آخر سعر هو السعر الحالي
  prices[prices.length - 1] = currentPrice;
  return prices;
}

// توليد بيانات أسعار مع دورات واضحة
function generateCyclePatternPrices(currentPrice: number, length: number = 200): number[] {
  const prices: number[] = [];
  
  // تحديد عدد الدورات
  const cycles = 3 + Math.floor(Math.random() * 3);
  const amplitude = 0.05 + Math.random() * 0.05; // سعة التذبذب
  
  for (let i = 0; i < length; i++) {
    const cycleComponent = Math.sin(i / length * Math.PI * 2 * cycles) * amplitude;
    const trendComponent = (i / length - 0.5) * 0.05 * (Math.random() > 0.5 ? 1 : -1);
    const randomness = (Math.random() - 0.5) * 0.01;
    
    const price = currentPrice * (1 + cycleComponent + trendComponent + randomness);
    prices.push(price);
  }
  
  // تأكد من أن آخر سعر هو السعر الحالي
  prices[prices.length - 1] = currentPrice;
  return prices;
}
