
import { AnalysisData } from "@/types/analysis";
import { analyzeScalpingChart } from "@/components/chart/analysis/scalpingAnalysis";
import { analyzeSMCChart } from "@/components/chart/analysis/smcAnalysis";
import { analyzeICTChart } from "@/components/chart/analysis/ictAnalysis";
import { analyzeTurtleSoupChart } from "@/components/chart/analysis/turtleSoupAnalysis";
import { analyzeGannChart } from "@/components/chart/analysis/gannAnalysis";
import { analyzeWavesChart } from "@/components/chart/analysis/wavesAnalysis";
import { analyzePattern } from "@/utils/patternAnalysis";
import { analyzePriceAction } from "@/components/chart/analysis/priceActionAnalysis";
import { analyzeNeuralNetworkChart } from "@/components/chart/analysis/neuralNetworkAnalysis";
import { analyzeRNN } from "@/components/chart/analysis/rnnAnalysis";
import { analyzeTimeClustering } from "@/components/chart/analysis/timeClusteringAnalysis";
import { analyzeMultiVariance } from "@/components/chart/analysis/multiVarianceAnalysis";
import { analyzeCompositeCandlestick } from "@/components/chart/analysis/compositeCandlestickAnalysis";
import { analyzeBehavioral } from "@/components/chart/analysis/behavioralAnalysis";
import { analyzeFibonacciChart } from "@/components/chart/analysis/fibonacciAnalysis";
import { analyzeFibonacciAdvancedChart } from "@/components/chart/analysis/fibonacciAdvancedAnalysis";
import { analyzeDailyChart } from "@/components/chart/analysis/dailyAnalysis";
import { getStrategyName } from "./analysisTypeMap";
import { analyzeMLChart, analyzeMultiTimeframeML } from "@/components/chart/analysis/mlAnalysis";
import { fetchHistoricalPrices } from "@/utils/price/api/historyFetcher";
import { getMultiTimeframeTrendSyncScore } from "./predictors/multiTimeframePredictor";
import { analyzeWeightedPatterns } from "./predictors/patternAnalysisEnhanced";
import { analyzeTrendReversalPoints } from "./predictors/trendReversalPredictor";

/**
 * Execute a specific analysis based on the given type
 */
export const executeSpecificAnalysis = async (
  type: string,
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData | null> => {
  console.log(`Executing specific analysis for type: ${type} (Display name: ${getStrategyName(type)})`);
  
  // Normalize the type for switching
  const normalizedType = type.toLowerCase().replace(/_/g, '').trim();
  console.log(`Normalized type for analysis: ${normalizedType}`);
  
  try {
    // جلب البيانات التاريخية للتحليل المتقدم
    let historicalPrices: number[] = [];
    let multiTimeframeHistoricalPrices: { [timeframe: string]: number[] } = {};
    
    try {
      console.log("جلب البيانات التاريخية للتحليل:", timeframe);
      historicalPrices = await fetchHistoricalPrices('XAUUSD', timeframe);
      console.log(`تم جلب ${historicalPrices.length} من نقاط البيانات التاريخية`);
      
      // جلب بيانات إضافية للأطر الزمنية المتعددة
      if (normalizedType === 'multitimeframe' || normalizedType === 'متعددالأطر' || normalizedType === 'mtf') {
        const timeframes = ['1h', '4h', '1d'];
        for (const tf of timeframes) {
          multiTimeframeHistoricalPrices[tf] = await fetchHistoricalPrices('XAUUSD', tf);
          console.log(`تم جلب ${multiTimeframeHistoricalPrices[tf].length} من نقاط البيانات التاريخية للإطار الزمني ${tf}`);
        }
      }
    } catch (error) {
      console.error("خطأ في جلب البيانات التاريخية:", error);
      // إنشاء بيانات تاريخية متنوعة إذا فشل الجلب
      historicalPrices = generateVariedPrices(currentPrice, normalizedType);
      console.log("تم إنشاء بيانات محاكاة للتحليل بسبب فشل جلب البيانات الحقيقية");
      
      if (normalizedType === 'multitimeframe' || normalizedType === 'متعددالأطر' || normalizedType === 'mtf') {
        const timeframes = ['1h', '4h', '1d'];
        for (const tf of timeframes) {
          multiTimeframeHistoricalPrices[tf] = generateVariedPrices(currentPrice, tf);
        }
      }
    }
    
    // إضافة طابع فريد لكل نوع تحليل لضمان اختلاف النتائج
    let analysisTypeVariance = getAnalysisVariance(normalizedType);
    
    // حساب توافق الاتجاهات بين الأطر الزمنية المختلفة
    const trendSyncData = await getMultiTimeframeTrendSyncScore(historicalPrices, timeframe);
    
    // تحليل نقاط انعكاس الاتجاه المحتملة
    const reversalData = analyzeTrendReversalPoints(historicalPrices, currentPrice);
    
    switch (normalizedType) {
      case "scalping":
      case "مضاربة":
      case "سكالبينج":
        console.log("Executing Scalping analysis");
        return await analyzeScalpingChart(chartImage, currentPrice, timeframe);
        
      case "smc":
      case "نظريةهيكلالسوق":
        console.log("Executing SMC analysis");
        return await analyzeSMCChart(chartImage, currentPrice, timeframe);
        
      case "ict":
      case "نظريةالسوق":
        console.log("Executing ICT analysis");
        return await analyzeICTChart(chartImage, currentPrice, timeframe);
        
      case "turtlesoup":
      case "turtle":
      case "الحساءالسلحفائي":
        console.log("Executing Turtle Soup analysis");
        return await analyzeTurtleSoupChart(chartImage, currentPrice, timeframe);
        
      case "gann":
      case "جان":
        console.log("Executing Gann analysis");
        return await analyzeGannChart(chartImage, currentPrice, timeframe);
        
      case "waves":
      case "تقلبات":
        console.log("Executing Waves analysis");
        return await analyzeWavesChart(chartImage, currentPrice, timeframe);
        
      case "patterns":
      case "pattern":
      case "نمطي":
        console.log("Executing Enhanced Pattern analysis");
        // استخدام محلل الأنماط المحسن لدقة أفضل
        return await analyzeWeightedPatterns(chartImage, currentPrice, timeframe, historicalPrices);
        
      case "priceaction":
      case "حركةالسعر":
        console.log("Executing Price Action analysis");
        return await analyzePriceAction(chartImage, currentPrice, timeframe);
        
      case "neuralnetworks":
      case "شبكاتعصبية":
        console.log("Executing Neural Networks analysis");
        return await analyzeNeuralNetworkChart(chartImage, currentPrice, timeframe);
        
      case "rnn":
      case "شبكاتعصبيةمتكررة":
        console.log("Executing RNN analysis");
        return await analyzeRNN(chartImage, currentPrice, timeframe);
        
      case "timeclustering":
      case "تصفيقزمني":
        console.log("Executing Time Clustering analysis");
        return await analyzeTimeClustering(chartImage, currentPrice, timeframe);
        
      case "multivariance":
      case "تباينمتعددالعوامل":
        console.log("Executing Multi Variance analysis");
        return await analyzeMultiVariance(chartImage, currentPrice, timeframe);
        
      case "compositecandlestick":
      case "شمعاتمركبة":
        console.log("Executing Composite Candlestick analysis");
        return await analyzeCompositeCandlestick(chartImage, currentPrice, timeframe);
        
      case "behavioral":
      case "تحليلسلوكي":
        console.log("Executing Behavioral analysis");
        return await analyzeBehavioral(chartImage, currentPrice, timeframe);
        
      case "fibonacciadvanced":
      case "تحليلفيبوناتشيمتقدم":
        console.log("Executing Fibonacci Advanced analysis");
        return await analyzeFibonacciAdvancedChart(chartImage, currentPrice, timeframe);
        
      case "fibonacci":
      case "فيبوناتشي":
        console.log("Executing Fibonacci analysis");
        return await analyzeFibonacciChart(chartImage, currentPrice, timeframe);
        
      case "ml":
      case "تعلمآلي":
      case "machinelearning":
        console.log("Executing Machine Learning analysis");
        return await analyzeMLChart(chartImage, currentPrice, timeframe, historicalPrices);
      
      case "multitimeframe":
      case "متعددالأطر":
      case "mtf":
        console.log("Executing Enhanced Multi-Timeframe ML analysis");
        
        // استخدام البيانات المجمعة للأطر الزمنية المتعددة
        return await analyzeMultiTimeframeML(
          chartImage, 
          currentPrice, 
          timeframe, 
          multiTimeframeHistoricalPrices.length > 0 ? multiTimeframeHistoricalPrices : undefined
        );
        
      case "daily":
      case "يومي":
        console.log("Executing Daily analysis");
        return await analyzeDailyChart(chartImage, currentPrice, timeframe);
        
      default:
        console.log(`Unknown analysis type "${type}", returning null`);
        return null;
    }
  } catch (error) {
    console.error(`Error executing analysis type "${type}":`, error);
    return null;
  }
};

/**
 * عوامل تغيير مخصصة لكل نوع تحليل لضمان اختلاف النتائج
 */
interface AnalysisVariance {
  directionBias: "صاعد" | "هابط" | "محايد";
  volatility: number;
  timeframe: number; // بالساعات
  confidence: number;
  patternIndex: number;
  priceRange: number;
  sentimentBias: number; // -1.0 to 1.0
  fibLevels: { level: number, price: number }[];
  reversalChance: number; // احتمالية انعكاس الاتجاه
}

/**
 * إنشاء عوامل تغيير فريدة لكل نوع تحليل
 */
function getAnalysisVariance(analysisType: string): AnalysisVariance {
  // استخدام نوع التحليل لإنشاء اختلافات محددة
  const hash = stringToHash(analysisType);
  
  // تحديد الاتجاه بناءً على معامل عشوائي محدد لنوع التحليل
  const directionSeed = hash % 3;
  const direction = directionSeed === 0 ? "صاعد" : (directionSeed === 1 ? "هابط" : "محايد");
  
  // تحديد عوامل أخرى متنوعة
  const volatility = 0.01 + (hash % 10) / 100; // 0.01 - 0.1
  const timeframe = 8 + (hash % 48); // 8 - 56 ساعات
  const confidence = 60 + (hash % 30); // 60 - 90
  const patternIndex = hash % 10; // 0 - 9 (للأنماط المختلفة)
  const priceRange = 15 + (hash % 50); // 15 - 65 نقطة سعر
  const sentimentBias = ((hash % 20) - 10) / 10; // -1.0 to 1.0
  const reversalChance = (hash % 100) / 100; // 0.0 - 0.99
  
  // إنشاء مستويات فيبوناتشي متنوعة
  const fibBase = hash % 200;
  const fibLevels = [
    { level: 0.236, price: 1000 + fibBase + fibBase * 0.236 },
    { level: 0.382, price: 1000 + fibBase + fibBase * 0.382 },
    { level: 0.5, price: 1000 + fibBase + fibBase * 0.5 },
    { level: 0.618, price: 1000 + fibBase + fibBase * 0.618 },
    { level: 0.786, price: 1000 + fibBase + fibBase * 0.786 },
  ];
  
  return {
    directionBias: direction,
    volatility,
    timeframe,
    confidence,
    patternIndex,
    priceRange,
    sentimentBias,
    fibLevels,
    reversalChance
  };
}

/**
 * تحويل نص إلى قيمة hash عددية
 */
function stringToHash(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash);
}

/**
 * إنشاء أسعار متنوعة ومختلفة لكل نوع تحليل
 */
function generateVariedPrices(currentPrice: number, seed: string): number[] {
  const prices: number[] = [];
  const hash = stringToHash(seed);
  
  // استخدام قيمة seed لتحديد الاتجاه والتقلب
  const trendDirection = hash % 2 === 0 ? 1 : -1; // 1 صاعد، -1 هابط
  const volatility = 0.005 + (hash % 10) / 1000; // 0.005 - 0.015
  
  let lastPrice = currentPrice * 0.98;
  
  // إنشاء 100 قيمة سعر متنوعة
  for (let i = 0; i < 100; i++) {
    prices.push(lastPrice);
    
    // تغيير عشوائي مع ميل للاتجاه المحدد
    const randomChange = (Math.random() - 0.5) * volatility * 2;
    const trendChange = (i / 1000) * volatility * trendDirection;
    
    lastPrice = lastPrice * (1 + randomChange + trendChange);
    
    // إضافة بعض نقاط الدعم والمقاومة
    if (i > 0 && i % 15 === 0) {
      // كل 15 نقطة إضافة مستوى ثابت لمحاكاة الدعم/المقاومة
      const level = lastPrice * (1 + (trendDirection * 0.002));
      for (let j = 0; j < 3; j++) {
        prices.push(level * (1 + (Math.random() - 0.5) * 0.001));
      }
    }
  }
  
  // التأكد من أن آخر سعر قريب من السعر الحالي
  prices.push(currentPrice * 0.995);
  prices.push(currentPrice * 0.997);
  prices.push(currentPrice * 0.999);
  prices.push(currentPrice);
  
  return prices;
}

/**
 * Execute multiple analyses in parallel
 */
export const executeMultipleAnalyses = async (
  types: string[],
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData[]> => {
  console.log("Executing multiple analyses for types:", types);
  console.log("Analysis display names:", types.map(t => getStrategyName(t)));
  
  const promises = types.map(type => 
    executeSpecificAnalysis(type, chartImage, currentPrice, timeframe)
  );
  
  try {
    const results = await Promise.all(promises);
    // تصفية النتائج للحصول على التحليلات الناجحة فقط
    return results.filter(result => result !== null) as AnalysisData[];
  } catch (error) {
    console.error("Error in multiple analyses execution:", error);
    return [];
  }
};
