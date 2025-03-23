
import { AnalysisData } from "@/types/analysis";
import { detectTrend, calculateSupportResistance } from "@/utils/technicalAnalysis/indicators/PriceData";

export const analyzeBehavioral = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  historicalPrices: number[] = []
): Promise<AnalysisData> => {
  console.log("Analyzing chart with Behavioral Analysis for:", { timeframe, currentPrice });
  console.log(`باستخدام ${historicalPrices.length} نقطة بيانات تاريخية`);
  
  // استخدام البيانات التاريخية إذا كانت متوفرة
  const prices = historicalPrices.length > 0 ? 
    historicalPrices : 
    generateSimulatedPrices(currentPrice);
  
  // تحليل اتجاه السعر باستخدام البيانات الحقيقية
  const direction = detectTrend(prices);
  console.log("الاتجاه المكتشف من البيانات:", direction);
  
  // حساب الدعم والمقاومة من البيانات الحقيقية
  const { support, resistance } = calculateSupportResistance(prices);
  
  // احتساب نطاق سلوكي بناءً على التقلب الحقيقي
  const behavioralRange = calculateBehavioralRange(prices);
  console.log("النطاق السلوكي المحسوب:", behavioralRange);
  
  // احتساب مستويات وقف الخسارة بناءً على الاتجاه
  const stopLoss = direction === "صاعد" 
    ? Number((Math.min(support, currentPrice * (1 - behavioralRange))).toFixed(2))
    : Number((Math.max(resistance, currentPrice * (1 + behavioralRange))).toFixed(2));
  
  // حساب المستهدفات باستخدام نطاق سلوكي متغير
  const movePercent = direction === "صاعد" ? behavioralRange * 2 : behavioralRange * 2;
  const targets = [];
  
  if (direction === "صاعد") {
    // للاتجاه الصاعد، نحدد أهدافًا بأسعار تتزايد
    const target1Price = Number((currentPrice * (1 + movePercent * 0.5)).toFixed(2));
    const target2Price = Number((currentPrice * (1 + movePercent * 1.1)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 36 * 60 * 60 * 1000) // 36 ساعة
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 84 * 60 * 60 * 1000) // 84 ساعة
    });
  } else {
    // للاتجاه الهابط، نحدد أهدافًا بأسعار تتناقص
    const target1Price = Number((currentPrice * (1 - movePercent * 0.5)).toFixed(2));
    const target2Price = Number((currentPrice * (1 - movePercent * 1.1)).toFixed(2));
    
    targets.push({
      price: target1Price,
      expectedTime: new Date(Date.now() + 36 * 60 * 60 * 1000) // 36 ساعة
    });
    targets.push({
      price: target2Price,
      expectedTime: new Date(Date.now() + 84 * 60 * 60 * 1000) // 84 ساعة
    });
  }
  
  // تحديد النمط السلوكي بناءً على البيانات التاريخية
  const patternInfo = detectBehavioralPattern(prices, direction);
  
  // نقطة الدخول المثالية تختلف حسب الاتجاه
  const entryPrice = direction === "صاعد"
    ? Number((Math.max(currentPrice * (1 - behavioralRange * 0.2), support)).toFixed(2))
    : Number((Math.min(currentPrice * (1 + behavioralRange * 0.2), resistance)).toFixed(2));
  
  const result: AnalysisData = {
    pattern: patternInfo.pattern,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: {
      price: entryPrice,
      reason: patternInfo.reason
    },
    analysisType: "تحليل سلوكي",
    activation_type: "تلقائي"
  };
  
  console.log("نتائج التحليل السلوكي:", result);
  return result;
};

// دالة مساعدة لتوليد بيانات محاكاة متنوعة إذا لم تتوفر بيانات حقيقية
const generateSimulatedPrices = (currentPrice: number): number[] => {
  const prices: number[] = [];
  const volatility = 0.015; // نسبة التقلب
  const trend = Math.random() > 0.5 ? 1 : -1; // اتجاه عشوائي
  
  // توليد أسعار متنوعة تعكس إمكانية وجود اتجاه صاعد أو هابط
  for (let i = 0; i < 200; i++) {
    if (i === 0) {
      prices.push(currentPrice * (1 - volatility * trend));
    } else {
      let randomChange;
      
      // إضافة تقلبات متنوعة للحصول على بيانات واقعية
      if (i % 20 < 10) {
        // فترة تقلب منخفض
        randomChange = (Math.random() - 0.5) * volatility;
      } else {
        // فترة تقلب عالي
        randomChange = (Math.random() - 0.5) * volatility * 2;
      }
      
      // إضافة اتجاه عام للبيانات
      const trendEffect = (i / 200) * trend * volatility * 0.5;
      
      prices.push(prices[i - 1] * (1 + randomChange + trendEffect));
    }
  }
  
  // إضافة السعر الحالي في النهاية
  prices.push(currentPrice);
  
  return prices;
};

/**
 * حساب نطاق التقلب السلوكي من البيانات التاريخية
 */
const calculateBehavioralRange = (prices: number[]): number => {
  if (!prices || prices.length < 10) {
    return 0.02; // قيمة افتراضية
  }
  
  // حساب المتوسط
  const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
  
  // حساب الانحراف المعياري
  let variance = 0;
  for (const price of prices) {
    variance += Math.pow(price - mean, 2);
  }
  variance /= prices.length;
  const stdDev = Math.sqrt(variance);
  
  // حساب نسبة التقلب
  const volatilityRatio = stdDev / mean;
  
  // تعديل النطاق ليكون بين 1.5% و 5%
  return Math.max(0.015, Math.min(0.05, volatilityRatio * 10));
};

/**
 * تحديد النمط السلوكي بناءً على البيانات التاريخية
 */
const detectBehavioralPattern = (prices: number[], direction: "صاعد" | "هابط" | "محايد") => {
  if (!prices || prices.length < 30) {
    return {
      pattern: direction === "صاعد" ? "Bullish Sentiment Extreme" : "Bearish Sentiment Extreme",
      reason: direction === "صاعد" ? "نقطة دخول صاعدة بناءً على تشبع السوق" : "نقطة دخول هابطة بناءً على تشبع السوق"
    };
  }
  
  // تقسيم البيانات إلى فترات
  const recentPrices = prices.slice(-10);
  const midPrices = prices.slice(-30, -10);
  
  // حساب متوسطات الفترات
  const recentAvg = recentPrices.reduce((acc, price) => acc + price, 0) / recentPrices.length;
  const midAvg = midPrices.reduce((acc, price) => acc + price, 0) / midPrices.length;
  
  // حساب التقلب للفترة الأخيرة
  let recentVolatility = 0;
  for (let i = 1; i < recentPrices.length; i++) {
    recentVolatility += Math.abs(recentPrices[i] - recentPrices[i-1]) / recentPrices[i-1];
  }
  recentVolatility /= (recentPrices.length - 1);
  
  // تحديد النمط بناءً على مقارنة المتوسطات والاتجاه
  if (recentAvg > midAvg * 1.02 && direction === "صاعد") {
    return {
      pattern: "Fear & Greed Pattern (صاعد)",
      reason: "نقطة دخول بناءً على نمط الخوف والجشع الصاعد"
    };
  } else if (recentAvg < midAvg * 0.98 && direction === "هابط") {
    return {
      pattern: "Fear & Greed Pattern (هابط)",
      reason: "نقطة دخول بناءً على نمط الخوف والجشع الهابط"
    };
  } else if (Math.abs(recentAvg - midAvg) / midAvg < 0.01) {
    return {
      pattern: direction === "صاعد" ? "Behavioral Reversal (صاعد)" : "Behavioral Reversal (هابط)",
      reason: `نقطة دخول بناءً على نمط الانعكاس السلوكي (${direction})`
    };
  } else if (recentVolatility > 0.02) {
    return {
      pattern: "Volatility Expansion",
      reason: `نقطة دخول بناءً على توسع نطاق التقلب في اتجاه ${direction}`
    };
  } else {
    return {
      pattern: "Psychological Support/Resistance",
      reason: `نقطة دخول بناءً على دعم/مقاومة نفسية في اتجاه ${direction}`
    };
  }
};
