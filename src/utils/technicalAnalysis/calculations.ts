
import { getTimeframeMultipliers, getStopLossMultiplier, getRangeMultiplier } from './timeframeMultipliers';
import { getTimeframeLabel } from './timeUtils';

export const calculateFibonacciLevels = (high: number, low: number) => {
  const difference = high - low;
  const levels = [0.236, 0.382, 0.618];
  
  return levels.map(level => ({
    level,
    price: Number((high - difference * level).toFixed(2))
  }));
};

export const calculateTargets = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number, 
  timeframe: string
) => {
  const range = Math.abs(resistance - support);
  const targets = [];
  const multipliers = getTimeframeMultipliers(timeframe);
  
  // تغيير حساب الأهداف ليعتمد بشكل صحيح على الاتجاه
  if (direction === "صاعد") {
    // للاتجاه الصاعد، نحسب أهدافًا بأسعار أعلى من السعر الحالي
    const baseDifference = Math.max(resistance - currentPrice, range * 0.2);
    targets.push(currentPrice + (baseDifference * multipliers[0]));
    targets.push(currentPrice + (baseDifference * multipliers[1]));
    targets.push(currentPrice + (baseDifference * multipliers[2]));
  } else {
    // للاتجاه الهابط، نحسب أهدافًا بأسعار أقل من السعر الحالي
    const baseDifference = Math.max(currentPrice - support, range * 0.2);
    targets.push(currentPrice - (baseDifference * multipliers[0]));
    targets.push(currentPrice - (baseDifference * multipliers[1]));
    targets.push(currentPrice - (baseDifference * multipliers[2]));
  }
  
  // تقريب القيم لتجنب الأرقام العشرية الطويلة
  return targets.map(target => Number(target.toFixed(2)));
};

export const calculateStopLoss = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number, 
  timeframe: string
) => {
  const range = Math.abs(resistance - support);
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  
  let stopLoss;
  
  if (direction === "صاعد") {
    // للاتجاه الصاعد، نضع وقف الخسارة أسفل مستوى الدعم
    stopLoss = Math.min(support, currentPrice - (range * stopLossMultiplier));
  } else {
    // للاتجاه الهابط، نضع وقف الخسارة أعلى مستوى المقاومة
    stopLoss = Math.max(resistance, currentPrice + (range * stopLossMultiplier));
  }
  
  return Number(stopLoss.toFixed(2));
};

export const calculateSupportResistance = (
  prices: number[], 
  currentPrice: number, 
  direction: string, 
  timeframe: string
) => {
  // التأكد من وجود قيم سعرية كافية للتحليل
  if (!prices || prices.length < 2) {
    // في حالة عدم وجود بيانات كافية، نستخدم قيم افتراضية حول السعر الحالي
    const variation = 0.02; // تغيير بنسبة 2%
    return {
      support: Number((currentPrice * (1 - variation)).toFixed(2)),
      resistance: Number((currentPrice * (1 + variation)).toFixed(2))
    };
  }

  // ترتيب الأسعار تصاعدياً
  const sortedPrices = [...prices].sort((a, b) => a - b);
  
  // تحديد نطاق البحث عن الدعم والمقاومة
  const rangeMultiplier = getRangeMultiplier(timeframe);
  
  // البحث عن مستويات دعم/مقاومة واضحة (مناطق تكرر فيها السعر)
  const pricesMap = new Map<number, number>();
  for (const price of prices) {
    // تقريب الأسعار لتحديد المستويات
    const roundedPrice = Math.round(price * 20) / 20;
    pricesMap.set(roundedPrice, (pricesMap.get(roundedPrice) || 0) + 1);
  }
  
  // تحويل الخريطة إلى مصفوفة وترتيبها حسب التكرار
  const pricePoints = [...pricesMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  let support, resistance;
  
  if (direction === "صاعد") {
    // في الاتجاه الصاعد، نبحث عن دعم أقل من السعر الحالي ومقاومة أعلى منه
    const supportCandidates = pricePoints.filter(p => p < currentPrice);
    const resistanceCandidates = pricePoints.filter(p => p > currentPrice);
    
    support = supportCandidates.length ? supportCandidates[0] : sortedPrices[0];
    resistance = resistanceCandidates.length ? resistanceCandidates[0] : sortedPrices[sortedPrices.length - 1];
  } else {
    // في الاتجاه الهابط، نعتبر المستويات التي كانت دعمًا أصبحت مقاومة والعكس
    const supportCandidates = pricePoints.filter(p => p < currentPrice);
    const resistanceCandidates = pricePoints.filter(p => p > currentPrice);
    
    support = supportCandidates.length ? Math.max(...supportCandidates.slice(0, 2)) : sortedPrices[0];
    resistance = resistanceCandidates.length ? Math.min(...resistanceCandidates.slice(0, 2)) : sortedPrices[sortedPrices.length - 1];
  }
  
  // تأكد من أن الدعم والمقاومة منطقيان بالنسبة للسعر الحالي
  if (Math.abs(support - currentPrice) / currentPrice < 0.005) {
    support = Number((currentPrice * 0.99).toFixed(2));
  }
  
  if (Math.abs(resistance - currentPrice) / currentPrice < 0.005) {
    resistance = Number((currentPrice * 1.01).toFixed(2));
  }

  return { support: Number(support.toFixed(2)), resistance: Number(resistance.toFixed(2)) };
};

export const calculateBestEntryPoint = (
  currentPrice: number,
  direction: string,
  support: number,
  resistance: number,
  fibLevels: { level: number; price: number }[],
  timeframe: string
): { price: number; reason: string } => {
  let entryPrice, reason;
  
  if (direction === "صاعد") {
    // للاتجاه الصاعد، أفضل نقطة دخول قريبة من مستوى الدعم أو مستوى فيبوناتشي 0.382
    const fibEntry = fibLevels.find(fib => fib.level === 0.382);
    const potentialEntries = [];
    
    // إضافة مستوى الدعم + 1-2% كنقطة دخول محتملة
    potentialEntries.push({
      price: Number((support * 1.01).toFixed(2)),
      reason: `نقطة دخول بالقرب من مستوى الدعم ${support.toFixed(2)}`
    });
    
    // إضافة مستوى فيبوناتشي إذا وجد
    if (fibEntry) {
      potentialEntries.push({
        price: fibEntry.price,
        reason: `نقطة دخول عند مستوى فيبوناتشي ${fibEntry.level}`
      });
    }
    
    // إضافة نقطة الدخول الحالية إذا كانت في اتجاه صاعد وقريبة من الدعم
    if (currentPrice < (support + resistance) / 2) {
      potentialEntries.push({
        price: currentPrice,
        reason: `الدخول بالسعر الحالي مناسب للاتجاه الصاعد`
      });
    }
    
    // اختيار أفضل نقطة دخول (الأقرب للدعم في الاتجاه الصاعد)
    potentialEntries.sort((a, b) => a.price - b.price);
    const entry = potentialEntries[0];
    
    return {
      price: entry.price,
      reason: `${entry.reason} على الإطار الزمني ${getTimeframeLabel(timeframe)}`
    };
  } else {
    // للاتجاه الهابط، أفضل نقطة دخول قريبة من مستوى المقاومة أو مستوى فيبوناتشي 0.618
    const fibEntry = fibLevels.find(fib => fib.level === 0.618);
    const potentialEntries = [];
    
    // إضافة مستوى المقاومة - 1-2% كنقطة دخول محتملة
    potentialEntries.push({
      price: Number((resistance * 0.99).toFixed(2)),
      reason: `نقطة دخول بالقرب من مستوى المقاومة ${resistance.toFixed(2)}`
    });
    
    // إضافة مستوى فيبوناتشي إذا وجد
    if (fibEntry) {
      potentialEntries.push({
        price: fibEntry.price,
        reason: `نقطة دخول عند مستوى فيبوناتشي ${fibEntry.level}`
      });
    }
    
    // إضافة نقطة الدخول الحالية إذا كانت في اتجاه هابط وقريبة من المقاومة
    if (currentPrice > (support + resistance) / 2) {
      potentialEntries.push({
        price: currentPrice,
        reason: `الدخول بالسعر الحالي مناسب للاتجاه الهابط`
      });
    }
    
    // اختيار أفضل نقطة دخول (الأقرب للمقاومة في الاتجاه الهابط)
    potentialEntries.sort((a, b) => b.price - a.price);
    const entry = potentialEntries[0];
    
    return {
      price: entry.price,
      reason: `${entry.reason} على الإطار الزمني ${getTimeframeLabel(timeframe)}`
    };
  }
};

export const detectTrend = (prices: number[]): "صاعد" | "هابط" => {
  if (!prices || prices.length < 2) {
    // قيمة افتراضية في حالة عدم وجود بيانات كافية
    return Math.random() > 0.5 ? "صاعد" : "هابط";
  }
  
  // تقسيم البيانات إلى النصف الأول والنصف الثاني
  const midPoint = Math.floor(prices.length / 2);
  const firstHalf = prices.slice(0, midPoint);
  const secondHalf = prices.slice(midPoint);
  
  // حساب متوسط كل نصف
  const firstAvg = firstHalf.reduce((sum, price) => sum + price, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, price) => sum + price, 0) / secondHalf.length;
  
  // تحديد الاتجاه بناءً على مقارنة المتوسطات
  const lastPrice = prices[prices.length - 1];
  const firstPrice = prices[0];
  
  // استخدام كل من متوسط النصفين ومقارنة أول وآخر سعر لتحديد الاتجاه بدقة أكبر
  if (secondAvg > firstAvg && lastPrice > firstPrice) {
    return "صاعد";
  } else if (secondAvg < firstAvg && lastPrice < firstPrice) {
    return "هابط";
  } else if (lastPrice > firstPrice) {
    return "صاعد";
  } else {
    return "هابط";
  }
};
