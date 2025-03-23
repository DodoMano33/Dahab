
/**
 * محلل الأنماط المحسن
 * يستخدم تقنيات متقدمة لتحليل الأنماط واستنتاج أهداف مختلفة
 */

import { AnalysisData } from "@/types/analysis";
import { getExpectedTime } from "../timeUtils";
import { identifyPattern } from "../../patternRecognition";

/**
 * تحليل الأنماط الفنية بشكل متقدم مع ترجيح النتائج
 */
export const analyzeWeightedPatterns = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  historicalPrices: number[] = []
): Promise<AnalysisData> => {
  console.log("تحليل الأنماط باستخدام النظام المحسن");
  
  // استنباط نوع النمط المحتمل
  const patternIndex = choosePatternBasedOnPrice(currentPrice, historicalPrices);
  const pattern = identifyPattern(chartImage, patternIndex);
  
  // إنشاء تنويع في الأهداف بناءً على نوع النمط
  let direction = pattern.expectedMove;
  
  // تحليل احتمالية الاتجاه بناءً على البيانات التاريخية
  if (historicalPrices.length > 20) {
    const recentTrend = detectRecentTrend(historicalPrices);
    
    // إذا كان اتجاه النمط يعاكس الاتجاه الحالي، نخفض احتمالية الاتجاه
    if (recentTrend !== "محايد" && recentTrend !== direction) {
      if (Math.random() > 0.7) {
        console.log(`تعديل اتجاه النمط من ${direction} إلى ${recentTrend} بناءً على الاتجاه الحالي`);
        direction = recentTrend;
      }
    }
  }
  
  // حساب مستويات الدعم والمقاومة المتنوعة
  const { support, resistance } = calculateDynamicLevels(currentPrice, direction, historicalPrices, timeframe);
  
  // حساب نقطة وقف الخسارة بشكل ديناميكي
  const stopLoss = calculateEnhancedStopLoss(currentPrice, direction, support, resistance, pattern.name);
  
  // حساب أهداف متعددة بناءً على نوع النمط والإطار الزمني
  const targets = generateWeightedTargets(currentPrice, direction, timeframe, support, resistance, pattern.name);
  
  // إنشاء نقطة الدخول المثالية
  const bestEntryPoint = {
    price: calculateOptimalEntryPoint(currentPrice, direction, support, resistance),
    reason: `نقطة دخول مثالية بناءً على نمط ${pattern.arabicName} (${pattern.name}) مع موثوقية ${pattern.reliability}/10 على الإطار الزمني ${timeframe}`
  };
  
  // حساب مستويات فيبوناتشي بناءً على طريقة مختلفة
  const fibonacciLevels = calculatePatternBasedFibonacci(support, resistance, pattern.name);
  
  // إنشاء كائن التحليل النهائي
  return {
    pattern: `${pattern.arabicName} (${pattern.name})`,
    direction: direction,
    currentPrice: currentPrice,
    support: support,
    resistance: resistance,
    stopLoss: stopLoss,
    targets: targets,
    bestEntryPoint: bestEntryPoint,
    fibonacciLevels: fibonacciLevels,
    analysisType: "نمطي",
    timeframe: timeframe
  };
};

/**
 * اختيار نمط بناءً على السعر والبيانات التاريخية
 */
const choosePatternBasedOnPrice = (currentPrice: number, historicalPrices: number[]): number => {
  if (historicalPrices.length < 10) {
    // إذا لم يكن هناك بيانات كافية، نستخدم السعر لتحديد نوع النمط
    return Math.floor((currentPrice % 10));
  }
  
  // اكتشاف التقلبات
  const volatility = calculateHistoricalVolatility(historicalPrices);
  
  // اختيار أنماط أكثر تقلبًا في الأسواق المتقلبة
  if (volatility > 0.02) {
    return Math.floor(Math.random() * 5); // الأنماط 0-4 للأسواق المتقلبة
  } else if (volatility > 0.01) {
    return 5 + Math.floor(Math.random() * 3); // الأنماط 5-7 للأسواق متوسطة التقلب
  } else {
    return 8 + Math.floor(Math.random() * 2); // الأنماط 8-9 للأسواق منخفضة التقلب
  }
};

/**
 * كشف الاتجاه الحديث من البيانات التاريخية
 */
const detectRecentTrend = (prices: number[]): "صاعد" | "هابط" | "محايد" => {
  if (prices.length < 10) return "محايد";
  
  const recentPrices = prices.slice(-10);
  let ups = 0;
  let downs = 0;
  
  for (let i = 1; i < recentPrices.length; i++) {
    if (recentPrices[i] > recentPrices[i-1]) ups++;
    else if (recentPrices[i] < recentPrices[i-1]) downs++;
  }
  
  if (ups > downs + 2) return "صاعد";
  if (downs > ups + 2) return "هابط";
  return "محايد";
};

/**
 * حساب مستويات الدعم والمقاومة الديناميكية
 */
const calculateDynamicLevels = (
  currentPrice: number, 
  direction: string, 
  historicalPrices: number[],
  timeframe: string
) => {
  // استخدام وظيفة مختلفة لكل إطار زمني
  const timeframeMultiplier = getTimeframeMultiplier(timeframe);
  
  // حساب التقلبات من البيانات التاريخية
  let volatility = 0.015; // قيمة افتراضية معقولة
  
  if (historicalPrices.length > 10) {
    volatility = calculateHistoricalVolatility(historicalPrices);
  }
  
  // تنويع مستويات الدعم والمقاومة بناءً على الاتجاه
  const baseOffset = volatility * 5 * timeframeMultiplier;
  
  let support: number;
  let resistance: number;
  
  if (direction === "صاعد") {
    support = currentPrice * (1 - baseOffset * 0.8);
    resistance = currentPrice * (1 + baseOffset * 1.2);
  } else if (direction === "هابط") {
    support = currentPrice * (1 - baseOffset * 1.2);
    resistance = currentPrice * (1 + baseOffset * 0.8);
  } else {
    // محايد
    support = currentPrice * (1 - baseOffset);
    resistance = currentPrice * (1 + baseOffset);
  }
  
  return { support, resistance };
};

/**
 * حساب وقف الخسارة المحسن
 */
const calculateEnhancedStopLoss = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number,
  patternName: string
): number => {
  // تعديل وقف الخسارة بناءً على نوع النمط
  let patternRiskFactor = 1.0;
  
  // تعديل عامل المخاطرة بناءً على نوع النمط
  if (patternName.includes("Triangle") || patternName.includes("مثلث")) {
    patternRiskFactor = 0.8; // مخاطرة أقل للمثلثات (وقف خسارة أقرب)
  } else if (patternName.includes("Head and Shoulders") || patternName.includes("رأس وكتفين")) {
    patternRiskFactor = 1.2; // مخاطرة أعلى لنمط الرأس والكتفين (وقف خسارة أبعد)
  } else if (patternName.includes("Wedge") || patternName.includes("وتد")) {
    patternRiskFactor = 0.9; // مخاطرة متوسطة للوتد
  }
  
  // حساب وقف الخسارة بناءً على الاتجاه وعامل المخاطرة
  if (direction === "صاعد") {
    // للاتجاه الصاعد، وقف الخسارة أسفل مستوى الدعم
    return support * (1 - 0.01 * patternRiskFactor);
  } else {
    // للاتجاه الهابط، وقف الخسارة فوق مستوى المقاومة
    return resistance * (1 + 0.01 * patternRiskFactor);
  }
};

/**
 * إنشاء أهداف مرجحة بناءً على النمط
 */
const generateWeightedTargets = (
  currentPrice: number, 
  direction: string, 
  timeframe: string,
  support: number,
  resistance: number,
  patternName: string
): { price: number; expectedTime: Date }[] => {
  const range = Math.abs(resistance - support);
  const targetMultipliers = getTargetMultipliersForPattern(patternName);
  
  if (direction === "صاعد") {
    return targetMultipliers.map((multiplier, index) => ({
      price: Number((currentPrice + range * multiplier).toFixed(2)),
      expectedTime: getExpectedTime(timeframe, index)
    }));
  } else {
    return targetMultipliers.map((multiplier, index) => ({
      price: Number((currentPrice - range * multiplier).toFixed(2)),
      expectedTime: getExpectedTime(timeframe, index)
    }));
  }
};

/**
 * تحديد مضاعفات الأهداف بناءً على نوع النمط
 */
const getTargetMultipliersForPattern = (patternName: string): number[] => {
  if (patternName.includes("Triangle") || patternName.includes("مثلث")) {
    return [0.4, 0.7, 1.0]; // أهداف متوسطة للمثلثات
  } else if (patternName.includes("Head and Shoulders") || patternName.includes("رأس وكتفين")) {
    return [0.5, 1.0, 1.5]; // أهداف أكبر لنمط الرأس والكتفين
  } else if (patternName.includes("Wedge") || patternName.includes("وتد")) {
    return [0.3, 0.6, 0.9]; // أهداف أصغر للوتد
  } else if (patternName.includes("Rectangle") || patternName.includes("مستطيل")) {
    return [0.35, 0.7, 1.05]; // أهداف متوسطة للمستطيل
  } else if (patternName.includes("Flag") || patternName.includes("راية")) {
    return [0.25, 0.5, 0.75]; // أهداف أصغر للراية
  } else {
    return [0.3, 0.8, 1.2]; // أهداف افتراضية
  }
};

/**
 * حساب نقطة الدخول المثالية
 */
const calculateOptimalEntryPoint = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number
): number => {
  if (direction === "صاعد") {
    // للاتجاه الصاعد، نقطة الدخول المثالية بين السعر الحالي والدعم
    const entryPoint = (currentPrice + support) / 2;
    // تقريب نقطة الدخول للسعر الحالي إذا كانت قريبة جدًا من الدعم
    return Math.max(entryPoint, currentPrice * 0.995);
  } else {
    // للاتجاه الهابط، نقطة الدخول المثالية بين السعر الحالي والمقاومة
    const entryPoint = (currentPrice + resistance) / 2;
    // تقريب نقطة الدخول للسعر الحالي إذا كانت قريبة جدًا من المقاومة
    return Math.min(entryPoint, currentPrice * 1.005);
  }
};

/**
 * حساب مستويات فيبوناتشي بناءً على النمط
 */
const calculatePatternBasedFibonacci = (
  support: number, 
  resistance: number,
  patternName: string
): { level: number; price: number }[] => {
  const range = resistance - support;
  
  // تعديل مستويات فيبوناتشي بناءً على نوع النمط
  let additionalLevel = 0;
  
  if (patternName.includes("Head and Shoulders") || patternName.includes("رأس وكتفين")) {
    additionalLevel = 1.272; // إضافة مستوى امتداد لنمط الرأس والكتفين
  } else if (patternName.includes("Cup and Handle") || patternName.includes("الكوب والمقبض")) {
    additionalLevel = 1.618; // إضافة مستوى امتداد ذهبي لنمط الكوب والمقبض
  }
  
  const levels = [
    { level: 0, price: support },
    { level: 0.236, price: support + range * 0.236 },
    { level: 0.382, price: support + range * 0.382 },
    { level: 0.5, price: support + range * 0.5 },
    { level: 0.618, price: support + range * 0.618 },
    { level: 0.786, price: support + range * 0.786 },
    { level: 1, price: resistance }
  ];
  
  // إضافة مستوى امتداد إضافي إذا كان مطلوبًا
  if (additionalLevel > 0) {
    levels.push({ 
      level: additionalLevel, 
      price: support + range * additionalLevel 
    });
  }
  
  return levels;
};

/**
 * حساب التقلب التاريخي
 */
const calculateHistoricalVolatility = (prices: number[]): number => {
  if (prices.length < 2) return 0.015; // قيمة افتراضية
  
  let sum = 0;
  for (let i = 1; i < prices.length; i++) {
    const change = Math.abs(prices[i] - prices[i-1]) / prices[i-1];
    sum += change;
  }
  
  return sum / (prices.length - 1);
};

/**
 * الحصول على مضاعف الإطار الزمني
 */
const getTimeframeMultiplier = (timeframe: string): number => {
  const lowerTimeframe = timeframe.toLowerCase();
  
  if (lowerTimeframe.includes("m") || lowerTimeframe.includes("دقيقة")) {
    const minutes = parseInt(lowerTimeframe) || 5;
    if (minutes <= 1) return 0.2;
    if (minutes <= 5) return 0.4;
    if (minutes <= 15) return 0.6;
    return 0.8;
  } else if (lowerTimeframe.includes("h") || lowerTimeframe.includes("ساعة")) {
    const hours = parseInt(lowerTimeframe) || 1;
    if (hours <= 1) return 1.0;
    if (hours <= 4) return 1.2;
    return 1.5;
  } else if (lowerTimeframe.includes("d") || lowerTimeframe.includes("يوم")) {
    return 2.0;
  } else if (lowerTimeframe.includes("w") || lowerTimeframe.includes("أسبوع")) {
    return 3.0;
  } else if (lowerTimeframe.includes("mo") || lowerTimeframe.includes("شهر")) {
    return 5.0;
  }
  
  return 1.0; // قيمة افتراضية
};

