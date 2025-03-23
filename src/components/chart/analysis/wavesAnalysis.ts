

import { AnalysisData } from "@/types/analysis";
import { getTimeframeMultipliers, getStopLossMultiplier } from "@/utils/technicalAnalysis/timeframeMultipliers";
import { getExpectedTime } from "@/utils/technicalAnalysis";
import { detectTrend, calculateSupportResistance, calculateVolatility } from "@/utils/technicalAnalysis/indicators/PriceData";

// تحليل الموجات الفعلي
export const analyzeWavesChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  duration: number = 36,
  historicalPrices: number[] = []
): Promise<AnalysisData> => {
  console.log("بدء تحليل Waves للرمز:", timeframe);
  console.log("مدة التحليل المحددة:", duration, "ساعات");
  console.log(`باستخدام ${historicalPrices.length} نقطة بيانات تاريخية`);

  // استخدام البيانات التاريخية إذا كانت متوفرة
  const prices = historicalPrices.length > 0 ? 
    historicalPrices : 
    generateSimulatedPrices(currentPrice);

  // تعديل النطاق بناءً على الإطار الزمني
  const multipliers = getTimeframeMultipliers(timeframe);
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  
  // استخدام البيانات لتحديد الاتجاه
  const direction = detectTrend(prices);
  
  // حساب الدعم والمقاومة
  const { support, resistance } = calculateSupportResistance(prices);
  
  // تحديد أعلى وأدنى سعر للفترة السابقة
  const highPrice = Math.max(...prices.slice(-50));
  const lowPrice = Math.min(...prices.slice(-50));
  
  // حساب وقف الخسارة
  const stopLoss = direction === "صاعد" 
    ? currentPrice * (1 - stopLossMultiplier) 
    : currentPrice * (1 + stopLossMultiplier);
  
  // حساب الأهداف
  const targetMultipliers = [1.5, 2.5, 3.5];
  const targets = targetMultipliers.map((mult, index) => {
    const targetPrice = direction === "صاعد" 
      ? currentPrice * (1 + stopLossMultiplier * mult) 
      : currentPrice * (1 - stopLossMultiplier * mult);
    
    return {
      price: targetPrice,
      expectedTime: getExpectedTime(timeframe, index)
    };
  });
  
  // تحديد نقطة الدخول المثالية
  const bestEntry = {
    price: direction === "صاعد" 
      ? currentPrice * 0.99 
      : currentPrice * 1.01,
    reason: `نقطة دخول مثالية للاتجاه ${direction} على الإطار الزمني ${timeframe}`
  };

  const analysisResult: AnalysisData = {
    pattern: `نموذج موجي ${direction} على الإطار الزمني ${timeframe}`,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    analysisType: "تقلبات",
    analysis_duration_hours: duration
  };

  console.log("نتائج تحليل Waves:", analysisResult);
  return analysisResult;
};

// دالة مساعدة لتوليد بيانات محاكاة إذا لم تتوفر بيانات حقيقية
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

