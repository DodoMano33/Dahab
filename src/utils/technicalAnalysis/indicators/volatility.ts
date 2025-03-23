
import { BollingerBands, ATR } from "technicalindicators";
import { PriceData } from "./types";
import { prepareDataForIndicators } from "./dataPrep";

/**
 * حساب نسبة التقلب باستخدام Bollinger Bands
 * @param prices بيانات الأسعار
 * @param period فترة الحساب
 * @returns قيمة التقلب (نسبة مئوية)
 */
export const calculateVolatility = (
  prices: number[] | PriceData[],
  period: number = 20
): number => {
  try {
    // التحقق من نوع البيانات
    if (prices.length === 0) {
      return 0;
    }

    let closePrices: number[];
    
    // إذا كانت البيانات من نوع PriceData
    if (typeof prices[0] === 'object' && 'close' in prices[0]) {
      const data = prepareDataForIndicators(prices as PriceData[]);
      closePrices = data.close;
    } else {
      closePrices = prices as number[];
    }
    
    // استخدام مؤشر Bollinger Bands لحساب التقلب
    const bollingerResult = BollingerBands.calculate({
      period,
      values: closePrices,
      stdDev: 2
    });
    
    if (bollingerResult.length === 0) {
      return 0;
    }
    
    // آخر قيمة من نتائج البولينجر
    const lastBollinger = bollingerResult[bollingerResult.length - 1];
    
    // حساب التقلب كنسبة من المسافة بين الحد العلوي والسفلي إلى المتوسط
    const currentPrice = closePrices[closePrices.length - 1];
    const volatility = (lastBollinger.upper - lastBollinger.lower) / currentPrice;
    
    return parseFloat((volatility * 100).toFixed(2)); // إرجاع القيمة كنسبة مئوية
  } catch (error) {
    console.error("خطأ في حساب التقلب:", error);
    return 0;
  }
};

/**
 * حساب مؤشر المدى الحقيقي المتوسط (ATR)
 * @param data بيانات الأسعار
 * @param period فترة الحساب
 * @returns قيمة مؤشر ATR
 */
export const calculateATR = (
  data: PriceData[],
  period: number = 14
): number => {
  try {
    if (data.length < period + 1) {
      return 0;
    }
    
    const input = {
      high: data.map(d => d.high),
      low: data.map(d => d.low),
      close: data.map(d => d.close),
      period
    };
    
    const atrResult = ATR.calculate(input);
    
    if (atrResult.length === 0) {
      return 0;
    }
    
    return atrResult[atrResult.length - 1];
  } catch (error) {
    console.error("خطأ في حساب مؤشر ATR:", error);
    return 0;
  }
};
