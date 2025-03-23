import { AnalysisData } from "@/types/analysis";
import { getTimeframeMultipliers } from "@/utils/technicalAnalysis/timeframeMultipliers";
import { getExpectedTime } from "@/utils/technicalAnalysis";
import { 
  detectTrend, 
  calculateSupportResistance, 
  calculateFibonacciLevels 
} from "@/utils/technicalAnalysis";
import {
  calculateSMCStopLoss,
  calculateSMCTargets,
  calculateSMCEntryPoint,
  detectSMCPattern
} from "./smc/smcCalculations";

export const analyzeSMCChart = async (
  chartImage: string,
  currentPrice: number,
  timeframe: string,
  duration: number = 36,
  historicalPrices: number[] = []
): Promise<AnalysisData> => {
  console.log("بدء تحليل SMC للرمز:", timeframe, "بسعر حالي:", currentPrice);
  console.log(`باستخدام ${historicalPrices.length} نقطة بيانات تاريخية`);
  
  // استخدام البيانات التاريخية الحقيقية إذا كانت متوفرة، وإلا استخدام بيانات محاكاة
  const prices = historicalPrices.length > 0 ? 
    historicalPrices : 
    generateSimulatedPrices(currentPrice);
  
  // استخدام المؤشرات لتحليل البيانات
  const direction = detectTrend(prices);
  
  // حساب الدعم والمقاومة
  const { support, resistance } = calculateSupportResistance(prices);
  
  // استخدام حسابات SMC المخصصة
  const stopLoss = calculateSMCStopLoss(
    currentPrice, 
    direction, 
    support, 
    resistance, 
    timeframe
  );
  
  // حساب مستويات فيبوناتشي
  const highPrice = Math.max(...prices.slice(-50));
  const lowPrice = Math.min(...prices.slice(-50));
  const fibLevels = calculateFibonacciLevels(
    highPrice, 
    lowPrice, 
    direction
  );
  
  // حساب الأهداف المبنية على السعر باستخدام حسابات SMC
  const smcTargetPrices = calculateSMCTargets(
    currentPrice, 
    direction, 
    support, 
    resistance, 
    timeframe
  );
  
  // تحويل الأسعار إلى أهداف مع أوقات متوقعة
  const targets = smcTargetPrices.map((price, index) => ({
    price,
    expectedTime: getExpectedTime(timeframe, index)
  }));
  
  // تحديد نقطة الدخول المثالية باستخدام حسابات SMC
  const bestEntry = calculateSMCEntryPoint(
    currentPrice, 
    direction, 
    support, 
    resistance, 
    timeframe
  );
  
  // تحديد نمط السوق استنادًا إلى استراتيجية SMC
  const patternDescription = detectSMCPattern(
    direction,
    timeframe
  );
  
  // إذا كان الاتجاه محايد، نحدد اتجاه عشوائي
  const finalDirection = direction === "محايد" ? (Math.random() > 0.5 ? "صاعد" : "هابط") : direction;
  
  const analysisResult: AnalysisData = {
    pattern: patternDescription,
    direction: finalDirection,
    currentPrice,
    support,
    resistance,
    stopLoss,
    targets,
    bestEntryPoint: bestEntry,
    analysisType: "نظرية هيكل السوق",
    analysis_duration_hours: duration
  };
  
  console.log("نتائج تحليل SMC:", analysisResult);
  return analysisResult;
};

// دالة مساعدة لتوليد بيانات محاكاة إذا لم تتوفر بيانات حقيقية
const generateSimulatedPrices = (currentPrice: number): number[] => {
  const simulatedPrices: number[] = [];
  const volatility = 0.015; // نسبة التقلب
  
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
