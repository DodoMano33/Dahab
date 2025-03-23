
import { AnalysisData } from "@/types/analysis";
import { getTimeframeMultipliers } from "@/utils/technicalAnalysis/timeframeMultipliers";
import { getExpectedTime } from "@/utils/technicalAnalysis";
import { 
  detectTrend, 
  calculateSupportResistance 
} from "@/utils/technicalAnalysis/indicators/PriceData";
import { calculateFibonacciLevels } from "@/utils/technicalAnalysis/calculations";
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
  
  // استخدام البيانات التاريخية إذا كانت متوفرة، وإلا استخدام بيانات محاكاة
  const prices = historicalPrices.length > 0 ? 
    historicalPrices : 
    generateSimulatedPrices(currentPrice);
  
  // تحليل اتجاه السعر باستخدام البيانات الحقيقية
  const direction = detectTrend(prices);
  console.log("الاتجاه المكتشف من البيانات:", direction);
  
  // حساب الدعم والمقاومة من البيانات الحقيقية
  const { support, resistance } = calculateSupportResistance(prices);
  
  // استخدام حسابات SMC المخصصة لاحتساب وقف الخسارة
  const stopLoss = calculateSMCStopLoss(
    currentPrice, 
    direction, 
    support, 
    resistance, 
    timeframe
  );
  
  // حساب مستويات فيبوناتشي - نتأكد من استخدام دالة قيم فيبوناتشي من calculations
  const fibLevels = calculateFibonacciLevels(resistance, support);
  
  // حساب المستهدفات
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

// دالة مساعدة لتوليد بيانات محاكاة أكثر واقعية إذا لم تتوفر بيانات حقيقية
const generateSimulatedPrices = (currentPrice: number): number[] => {
  const simulatedPrices: number[] = [];
  const volatility = 0.015; // نسبة التقلب
  let trend = Math.random() > 0.5 ? 1 : -1; // اتجاه عشوائي
  let momentum = 0; // الزخم
  
  // توليد 200 سعر تاريخي للمحاكاة
  for (let i = 0; i < 200; i++) {
    if (i === 0) {
      simulatedPrices.push(currentPrice * (1 - volatility * trend));
    } else {
      // إضافة عامل الزخم للحصول على حركة أكثر واقعية
      momentum = momentum * 0.9 + (Math.random() - 0.5) * volatility * 2;
      
      // تغيير الاتجاه أحيانًا
      if (Math.random() < 0.05) {
        trend = -trend;
      }
      
      // حساب السعر الجديد
      const change = momentum + trend * volatility * 0.2;
      simulatedPrices.push(simulatedPrices[i - 1] * (1 + change));
    }
    
    // إضافة بعض القيم المتكررة لإنشاء مستويات دعم/مقاومة
    if (i > 50 && i % 20 === 0) {
      const supportLevel = simulatedPrices[i - 1] * (1 - volatility * 0.5);
      for (let j = 0; j < 5; j++) {
        simulatedPrices.push(supportLevel * (1 + (Math.random() - 0.5) * 0.001));
      }
      i += 5;
    }
  }
  
  // إضافة السعر الحالي في النهاية
  simulatedPrices.push(currentPrice);
  
  return simulatedPrices;
};
