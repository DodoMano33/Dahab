
/**
 * وحدة التنبؤ بنقاط انعكاس الاتجاه
 * تحلل البيانات التاريخية للتنبؤ بنقاط انعكاس محتملة واكتشاف علامات تغير الاتجاه
 */

import { calculateVolatility } from "../indicators/volatility";
import { detectTrend, calculateTrendStrength, detectTrendReversal } from "../indicators/trendIndicators";

export interface ReversalData {
  isReversalLikely: boolean;
  reversalProbability: number; // 0-1
  currentTrend: "صاعد" | "هابط" | "محايد";
  trendStrength: number; // 0-100
  potentialReversalLevels: number[];
  warnings: string[];
}

/**
 * تحليل نقاط انعكاس الاتجاه المحتملة
 * @param historicalPrices - بيانات الأسعار التاريخية
 * @param currentPrice - السعر الحالي
 */
export function analyzeTrendReversalPoints(
  historicalPrices: number[],
  currentPrice: number
): ReversalData {
  if (historicalPrices.length < 20) {
    return {
      isReversalLikely: false,
      reversalProbability: 0,
      currentTrend: "محايد",
      trendStrength: 0,
      potentialReversalLevels: [],
      warnings: ["لا تتوفر بيانات كافية لتحليل نقاط الانعكاس"]
    };
  }
  
  // تحليل الاتجاه الحالي وقوته
  const currentTrend = detectTrend(historicalPrices);
  const trendStrength = calculateTrendStrength(historicalPrices);
  
  // تحليل احتمالية الانعكاس
  const reversal = detectTrendReversal(historicalPrices);
  
  // تحديد العوامل الإضافية
  const volatility = calculateVolatility(historicalPrices);
  const lastPrice = historicalPrices[historicalPrices.length - 1];
  
  // حساب مستويات الانعكاس المحتملة
  const potentialReversalLevels: number[] = [];
  if (currentTrend === "صاعد") {
    // للاتجاه الصاعد، مستويات الانعكاس المحتملة ستكون أقل من السعر الحالي
    potentialReversalLevels.push(
      currentPrice * (1 - volatility * 2),
      currentPrice * (1 - volatility * 3),
      currentPrice * (1 - volatility * 4)
    );
  } else if (currentTrend === "هابط") {
    // للاتجاه الهابط، مستويات الانعكاس المحتملة ستكون أعلى من السعر الحالي
    potentialReversalLevels.push(
      currentPrice * (1 + volatility * 2),
      currentPrice * (1 + volatility * 3),
      currentPrice * (1 + volatility * 4)
    );
  } else {
    // للاتجاه المحايد، مستويات في كلا الاتجاهين
    potentialReversalLevels.push(
      currentPrice * (1 - volatility * 2.5),
      currentPrice * (1 + volatility * 2.5)
    );
  }
  
  // تحديد التحذيرات
  const warnings: string[] = [];
  
  if (reversal.isReversal) {
    warnings.push(`تم اكتشاف علامات انعكاس محتملة (قوة الانعكاس: ${reversal.strength}%)`);
  }
  
  if (trendStrength < 40) {
    warnings.push(`قوة الاتجاه الحالي ضعيفة (${trendStrength}%)، مما يزيد من احتمالية الانعكاس`);
  }
  
  if (volatility > 0.03) {
    warnings.push(`التقلب مرتفع (${(volatility * 100).toFixed(2)}%)، مما قد يشير إلى تغير وشيك في الاتجاه`);
  }
  
  // حساب احتمالية الانعكاس
  let reversalProbability = 0;
  
  if (reversal.isReversal) {
    reversalProbability = reversal.strength / 100; // 0-1
  } else {
    // حتى بدون إشارة انعكاس صريحة، احتمالية قائمة
    reversalProbability = Math.max(0, (100 - trendStrength) / 200); // 0-0.5
  }
  
  // تعديل احتمالية الانعكاس بناءً على التقلب
  reversalProbability = Math.min(0.95, reversalProbability + volatility);
  
  return {
    isReversalLikely: reversal.isReversal || reversalProbability > 0.4,
    reversalProbability,
    currentTrend,
    trendStrength,
    potentialReversalLevels,
    warnings
  };
}

/**
 * اكتشاف أنماط انعكاس في البيانات التاريخية
 */
export function detectReversalPatterns(
  historicalPrices: number[]
): {
  patternName: string;
  probability: number;
  expectedLevel: number;
}[] {
  if (historicalPrices.length < 30) {
    return [];
  }
  
  const patterns: { patternName: string; probability: number; expectedLevel: number }[] = [];
  const currentPrice = historicalPrices[historicalPrices.length - 1];
  
  // البحث عن نمط القمة المزدوجة
  const doubleTopsResult = findDoubleTops(historicalPrices);
  if (doubleTopsResult.found) {
    patterns.push({
      patternName: "القمة المزدوجة",
      probability: doubleTopsResult.probability,
      expectedLevel: doubleTopsResult.targetLevel
    });
  }
  
  // البحث عن نمط القاع المزدوج
  const doubleBottomsResult = findDoubleBottoms(historicalPrices);
  if (doubleBottomsResult.found) {
    patterns.push({
      patternName: "القاع المزدوج",
      probability: doubleBottomsResult.probability,
      expectedLevel: doubleBottomsResult.targetLevel
    });
  }
  
  // البحث عن نمط RSI تباعد
  const rsiDivergenceResult = findRSIDivergence(historicalPrices);
  if (rsiDivergenceResult.found) {
    patterns.push({
      patternName: rsiDivergenceResult.type,
      probability: rsiDivergenceResult.probability,
      expectedLevel: rsiDivergenceResult.targetLevel
    });
  }
  
  return patterns;
}

/**
 * البحث عن نمط القمة المزدوجة (نمط انعكاس هبوطي)
 */
function findDoubleTops(prices: number[]): { 
  found: boolean; 
  probability: number; 
  targetLevel: number 
} {
  // محاكاة اكتشاف القمة المزدوجة
  // في التطبيق الفعلي، يجب تنفيذ خوارزمية أكثر تعقيدًا للكشف عن القمم
  
  const result = {
    found: false,
    probability: 0,
    targetLevel: 0
  };
  
  // منطق مبسط للتوضيح
  const recentPrices = prices.slice(-20);
  const max1 = Math.max(...recentPrices.slice(0, 10));
  const max2 = Math.max(...recentPrices.slice(10));
  
  const lastPrice = prices[prices.length - 1];
  
  if (Math.abs(max1 - max2) / max1 < 0.03 && max1 > lastPrice && max2 > lastPrice) {
    result.found = true;
    result.probability = 0.7;
    result.targetLevel = lastPrice * (1 - 0.02);
  }
  
  return result;
}

/**
 * البحث عن نمط القاع المزدوج (نمط انعكاس صعودي)
 */
function findDoubleBottoms(prices: number[]): { 
  found: boolean; 
  probability: number; 
  targetLevel: number 
} {
  // محاكاة اكتشاف القاع المزدوج
  const result = {
    found: false,
    probability: 0,
    targetLevel: 0
  };
  
  const recentPrices = prices.slice(-20);
  const min1 = Math.min(...recentPrices.slice(0, 10));
  const min2 = Math.min(...recentPrices.slice(10));
  
  const lastPrice = prices[prices.length - 1];
  
  if (Math.abs(min1 - min2) / min1 < 0.03 && min1 < lastPrice && min2 < lastPrice) {
    result.found = true;
    result.probability = 0.75;
    result.targetLevel = lastPrice * (1 + 0.02);
  }
  
  return result;
}

/**
 * البحث عن تباعد مؤشر RSI (علامة انعكاس قوية)
 */
function findRSIDivergence(prices: number[]): { 
  found: boolean; 
  type: string; 
  probability: number; 
  targetLevel: number 
} {
  // محاكاة اكتشاف تباعد RSI
  const result = {
    found: false,
    type: "",
    probability: 0,
    targetLevel: 0
  };
  
  // في تطبيق فعلي، يجب حساب RSI الفعلي والبحث عن التباعد
  
  // محاكاة بسيطة للتوضيح
  const isPriceUp = prices[prices.length - 1] > prices[prices.length - 10];
  const randomValue = Math.random();
  
  // في 20% من الحالات، نفترض وجود تباعد
  if (randomValue < 0.2) {
    result.found = true;
    
    if (isPriceUp) {
      // تباعد سلبي - نمط هبوطي
      result.type = "تباعد RSI سلبي";
      result.probability = 0.8;
      result.targetLevel = prices[prices.length - 1] * 0.98;
    } else {
      // تباعد إيجابي - نمط صعودي
      result.type = "تباعد RSI إيجابي";
      result.probability = 0.85;
      result.targetLevel = prices[prices.length - 1] * 1.02;
    }
  }
  
  return result;
}
