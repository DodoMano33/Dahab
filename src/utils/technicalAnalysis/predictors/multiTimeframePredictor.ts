
/**
 * وحدة تحليل الأطر الزمنية المتعددة المحسنة
 * تستخدم لتحسين دقة التنبؤات عن طريق تحليل توافق الاتجاهات بين أطر زمنية مختلفة
 */

import { detectTrend } from "../indicators/trendIndicators";
import { calculateVolatility } from "../indicators/volatility";
import { fetchHistoricalPrices } from "@/utils/price/api/historyFetcher";

/**
 * نموذج بيانات توافق الأطر الزمنية المتعددة
 */
export interface MultiTimeframeSyncData {
  // درجة التوافق بين الأطر الزمنية (0-1)
  syncScore: number;
  // الاتجاه السائد على معظم الأطر الزمنية
  dominantTrend: "صاعد" | "هابط" | "محايد";
  // قوة الثقة في التنبؤ 
  confidence: number;
  // الأطر الزمنية المتوافقة مع الاتجاه السائد
  alignedTimeframes: string[];
  // الأطر الزمنية غير المتوافقة مع الاتجاه السائد
  divergentTimeframes: string[];
  // نقاط الانعكاس المحتملة
  potentialReversalLevels: number[];
}

/**
 * حساب درجة توافق الاتجاهات عبر أطر زمنية متعددة
 * @param baseHistoricalPrices - بيانات الأسعار التاريخية للإطار الزمني الأساسي
 * @param baseTimeframe - الإطار الزمني الأساسي
 */
export async function getMultiTimeframeTrendSyncScore(
  baseHistoricalPrices: number[],
  baseTimeframe: string
): Promise<MultiTimeframeSyncData> {
  // قائمة الأطر الزمنية للتحليل
  const timeframes = ['5m', '15m', '1h', '4h', '1d'];
  
  // تحليلات الاتجاهات
  const trendAnalyses: { timeframe: string; trend: "صاعد" | "هابط" | "محايد"; weight: number }[] = [];
  
  // تحليل الإطار الزمني الأساسي
  const baseTrend = detectTrend(baseHistoricalPrices);
  trendAnalyses.push({ timeframe: baseTimeframe, trend: baseTrend, weight: 1.0 });
  
  // محاولة تحليل الأطر الزمنية الأخرى
  for (const tf of timeframes) {
    // تجاوز الإطار الزمني الأساسي لأنه تم تحليله بالفعل
    if (tf === baseTimeframe) continue;
    
    try {
      const prices = await fetchHistoricalPrices('XAUUSD', tf);
      if (prices.length >= 10) {
        const trend = detectTrend(prices);
        
        // إعطاء وزن أكبر للأطر الزمنية الأطول
        let weight = 0.5;
        if (tf === '1d') weight = 1.5;
        else if (tf === '4h') weight = 1.2;
        else if (tf === '1h') weight = 1.0;
        else if (tf === '15m') weight = 0.7;
        
        trendAnalyses.push({ timeframe: tf, trend, weight });
      }
    } catch (error) {
      console.warn(`فشل في تحليل الإطار الزمني ${tf}:`, error);
    }
  }
  
  // حساب الاتجاه السائد
  const trendScores = {
    "صاعد": 0,
    "هابط": 0,
    "محايد": 0
  };
  
  let totalWeight = 0;
  
  trendAnalyses.forEach(analysis => {
    trendScores[analysis.trend] += analysis.weight;
    totalWeight += analysis.weight;
  });
  
  // تحديد الاتجاه السائد
  let dominantTrend: "صاعد" | "هابط" | "محايد" = "محايد";
  if (trendScores["صاعد"] > trendScores["هابط"] && trendScores["صاعد"] > trendScores["محايد"]) {
    dominantTrend = "صاعد";
  } else if (trendScores["هابط"] > trendScores["صاعد"] && trendScores["هابط"] > trendScores["محايد"]) {
    dominantTrend = "هابط";
  }
  
  // حساب درجة التوافق
  const dominantScore = trendScores[dominantTrend];
  const syncScore = dominantScore / totalWeight;
  
  // تحديد الأطر الزمنية المتوافقة وغير المتوافقة
  const alignedTimeframes = trendAnalyses
    .filter(analysis => analysis.trend === dominantTrend)
    .map(analysis => analysis.timeframe);
    
  const divergentTimeframes = trendAnalyses
    .filter(analysis => analysis.trend !== dominantTrend)
    .map(analysis => analysis.timeframe);
  
  // حساب مستوى الثقة
  const confidence = Math.min(0.9, syncScore * (1 + (alignedTimeframes.length / trendAnalyses.length) * 0.5));
  
  // تقدير مستويات الانعكاس المحتملة
  const lastPrice = baseHistoricalPrices[baseHistoricalPrices.length - 1];
  const volatility = calculateVolatility(baseHistoricalPrices);
  
  const potentialReversalLevels = [
    dominantTrend === "صاعد" ? lastPrice * (1 - volatility * 2) : lastPrice * (1 + volatility * 2),
    dominantTrend === "صاعد" ? lastPrice * (1 - volatility * 3) : lastPrice * (1 + volatility * 3)
  ];
  
  return {
    syncScore,
    dominantTrend,
    confidence,
    alignedTimeframes,
    divergentTimeframes,
    potentialReversalLevels
  };
}

/**
 * تحليل استمرارية اتجاه السعر عبر أطر زمنية مختلفة
 * @param symbol - رمز الأداة المالية
 * @param currentPrice - السعر الحالي
 */
export async function analyzeMultiTimeframeMomentum(
  symbol: string,
  currentPrice: number
): Promise<{
  momentumScore: number; // -1 إلى 1 (سالب: هبوطي، موجب: صعودي)
  consistency: number; // 0 إلى 1
  timeframesWithSameTrend: number;
  totalTimeframes: number;
}> {
  const timeframes = ['5m', '15m', '30m', '1h', '4h', '1d'];
  let trendsUp = 0;
  let trendsDown = 0;
  let validTimeframes = 0;
  
  for (const timeframe of timeframes) {
    try {
      const prices = await fetchHistoricalPrices(symbol, timeframe);
      if (prices.length >= 10) {
        const trend = detectTrend(prices);
        if (trend === "صاعد") trendsUp++;
        else if (trend === "هابط") trendsDown++;
        validTimeframes++;
      }
    } catch (error) {
      console.warn(`فشل في تحليل الزخم للإطار الزمني ${timeframe}:`, error);
    }
  }
  
  if (validTimeframes === 0) return { momentumScore: 0, consistency: 0, timeframesWithSameTrend: 0, totalTimeframes: 0 };
  
  // حساب نتيجة الزخم (من -1 إلى 1)
  const momentumScore = (trendsUp - trendsDown) / validTimeframes;
  
  // حساب الاتساق
  const dominantTrendCount = Math.max(trendsUp, trendsDown);
  const consistency = dominantTrendCount / validTimeframes;
  
  return {
    momentumScore,
    consistency,
    timeframesWithSameTrend: dominantTrendCount,
    totalTimeframes: validTimeframes
  };
}
