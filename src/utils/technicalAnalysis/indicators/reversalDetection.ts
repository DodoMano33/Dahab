
/**
 * وحدة اكتشاف نقاط الانعكاس في الاتجاه
 * تحتوي على خوارزميات للكشف عن نقاط الانعكاس المحتملة في الأسعار
 */

import { calculateSMA, calculateEMA, calculateRSI } from '../indicators';
import { calculateVolatility } from './volatility';

/**
 * اكتشاف نقاط الانعكاس المحتملة في الاتجاه
 * @param prices - مصفوفة الأسعار التاريخية
 * @param sensitivity - حساسية الكشف (بين 0 و 1، القيمة الافتراضية 0.5)
 * @returns مصفوفة من الأسعار التي تمثل نقاط انعكاس محتملة
 */
export function detectTrendReversalPoints(
  prices: number[],
  sensitivity: number = 0.5
): number[] {
  if (prices.length < 10) {
    return [];
  }

  const reversalPoints: number[] = [];
  const volatility = calculateVolatility(prices);
  
  // حساب مؤشرات فنية تساعد في تحديد نقاط الانعكاس
  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);
  const rsi = calculateRSI(prices);
  
  // الحد الأدنى للتغير الذي يعتبر انعكاسًا محتملاً (يتكيف مع التقلب)
  const minChangeThreshold = volatility * 2 * (1 + sensitivity);
  
  for (let i = 20; i < prices.length - 1; i++) {
    // البحث عن قمم وقيعان محتملة
    const isPotentialTop = 
      prices[i] > prices[i-1] && 
      prices[i] > prices[i+1] && 
      prices[i] > prices[i-2] && 
      prices[i] > prices[i-3];
      
    const isPotentialBottom = 
      prices[i] < prices[i-1] && 
      prices[i] < prices[i+1] && 
      prices[i] < prices[i-2] && 
      prices[i] < prices[i-3];
    
    // استخدام RSI للتأكيد (ذروة شراء أو ذروة بيع)
    const isRsiOverbought = rsi[i - 14] > 70; // تعديل الفهرس لمراعاة حساب RSI
    const isRsiOversold = rsi[i - 14] < 30;
    
    // استخدام تقاطع المتوسطات المتحركة كمؤشر إضافي
    const isSMACrossing = 
      (i >= 50 && // تأكد من وجود بيانات كافية لـ SMA-50
       ((sma20[i - 20] > sma50[i - 50] && sma20[i - 21] <= sma50[i - 51]) || // تقاطع صعودي
        (sma20[i - 20] < sma50[i - 50] && sma20[i - 21] >= sma50[i - 51]))); // تقاطع هبوطي
    
    // تغير السعر الكبير كمؤشر إضافي
    const priceChange = Math.abs(prices[i] - prices[i-5]) / prices[i-5];
    const isSignificantChange = priceChange > minChangeThreshold;
    
    // الجمع بين المؤشرات لتحديد نقاط الانعكاس المحتملة
    if ((isPotentialTop && isRsiOverbought) || 
        (isPotentialBottom && isRsiOversold) || 
        (isSMACrossing && isSignificantChange)) {
      reversalPoints.push(prices[i]);
    }
  }
  
  return reversalPoints;
}

/**
 * اكتشاف قمم وقيعان السعر
 * @param prices - مصفوفة الأسعار التاريخية
 * @param lookbackPeriod - فترة النظر للخلف لتحديد القمم والقيعان
 * @returns كائن يحتوي على مصفوفتين: القمم والقيعان
 */
export function detectPeaksAndTroughs(
  prices: number[],
  lookbackPeriod: number = 5
): { peaks: number[], troughs: number[] } {
  const peaks: number[] = [];
  const troughs: number[] = [];
  
  // نحتاج على الأقل 2*lookbackPeriod+1 نقطة بيانات
  if (prices.length < 2 * lookbackPeriod + 1) {
    return { peaks, troughs };
  }
  
  // البحث عن القمم والقيعان من خلال النظر إلى نقاط محددة قبل وبعد النقطة الحالية
  for (let i = lookbackPeriod; i < prices.length - lookbackPeriod; i++) {
    let isPeak = true;
    let isTrough = true;
    
    // التحقق مما إذا كانت النقطة الحالية هي قمة
    for (let j = i - lookbackPeriod; j < i; j++) {
      if (prices[j] >= prices[i]) {
        isPeak = false;
        break;
      }
    }
    
    for (let j = i + 1; j <= i + lookbackPeriod; j++) {
      if (prices[j] >= prices[i]) {
        isPeak = false;
        break;
      }
    }
    
    // التحقق مما إذا كانت النقطة الحالية هي قاع
    for (let j = i - lookbackPeriod; j < i; j++) {
      if (prices[j] <= prices[i]) {
        isTrough = false;
        break;
      }
    }
    
    for (let j = i + 1; j <= i + lookbackPeriod; j++) {
      if (prices[j] <= prices[i]) {
        isTrough = false;
        break;
      }
    }
    
    if (isPeak) {
      peaks.push(prices[i]);
    }
    
    if (isTrough) {
      troughs.push(prices[i]);
    }
  }
  
  return { peaks, troughs };
}

/**
 * تقييم قوة نقاط الانعكاس استنادًا إلى عدة مؤشرات
 * @param prices - مصفوفة الأسعار التاريخية
 * @param reversalPoints - نقاط الانعكاس المحتملة
 * @returns مصفوفة من نقاط الانعكاس مع تقييم قوتها
 */
export function evaluateReversalStrength(
  prices: number[],
  reversalPoints: number[]
): { price: number, strength: number }[] {
  return reversalPoints.map(point => {
    // البحث عن موقع نقطة الانعكاس في مصفوفة الأسعار
    const index = prices.findIndex(p => p === point);
    
    if (index === -1 || index < 14 || index >= prices.length - 1) {
      return { price: point, strength: 0.5 }; // قيمة افتراضية إذا تعذر تقييم القوة
    }
    
    // حساب RSI في نقطة الانعكاس
    const rsi = calculateRSI(prices.slice(0, index + 1));
    const rsiValue = rsi[rsi.length - 1];
    
    // حساب تقلب السعر قبل وبعد نقطة الانعكاس
    const beforeVolatility = calculateVolatility(prices.slice(Math.max(0, index - 10), index));
    const afterVolatility = calculateVolatility(prices.slice(index, Math.min(prices.length, index + 10)));
    
    // حساب التغير في السعر بعد نقطة الانعكاس
    const priceChangeAfter = 
      index < prices.length - 5 ? 
      Math.abs(prices[index + 5] - point) / point : 
      0;
    
    // تقييم القوة بناءً على مزيج من المؤشرات
    let strength = 0.5; // قيمة أساسية
    
    // إضافة قوة استنادًا إلى قيمة RSI (كلما كانت القيمة أكثر تطرفًا، زادت قوة الانعكاس)
    if (rsiValue > 80 || rsiValue < 20) {
      strength += 0.3;
    } else if (rsiValue > 70 || rsiValue < 30) {
      strength += 0.2;
    }
    
    // إضافة قوة استنادًا إلى التقلب (انخفاض التقلب بعد الانعكاس يشير إلى انعكاس قوي)
    if (afterVolatility < beforeVolatility * 0.7) {
      strength += 0.2;
    }
    
    // إضافة قوة استنادًا إلى التغير في السعر بعد الانعكاس
    if (priceChangeAfter > 0.02) {
      strength += 0.2;
    }
    
    // تحديد الحد الأقصى للقوة عند 1
    return { price: point, strength: Math.min(1, strength) };
  });
}
