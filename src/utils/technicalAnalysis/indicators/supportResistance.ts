
import { BollingerBands } from "technicalindicators";

// وظيفة لحساب مستويات الدعم والمقاومة
export const calculateSupportResistance = (
  prices: number[],
  periods: number = 20
): { support: number, resistance: number } => {
  try {
    // استخدام Bollinger Bands لتقدير الدعم والمقاومة
    const bollingerResult = BollingerBands.calculate({
      period: periods,
      values: prices,
      stdDev: 2
    });
    
    const lastBollinger = bollingerResult[bollingerResult.length - 1];
    
    return {
      support: lastBollinger.lower,
      resistance: lastBollinger.upper
    };
  } catch (error) {
    console.error("خطأ في حساب الدعم والمقاومة:", error);
    // قيم افتراضية في حالة الخطأ
    const currentPrice = prices[prices.length - 1];
    return {
      support: currentPrice * 0.98,
      resistance: currentPrice * 1.02
    };
  }
};
