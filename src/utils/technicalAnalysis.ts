import { addDays, addHours, addMinutes } from "date-fns";

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
  const range = resistance - support;
  const targets = [];
  
  // تعديل الأهداف بناءً على الإطار الزمني
  const multipliers = getTimeframeMultipliers(timeframe);
  
  if (direction === "صاعد") {
    targets.push(currentPrice + (range * multipliers[0]));
    targets.push(currentPrice + (range * multipliers[1]));
    targets.push(currentPrice + (range * multipliers[2]));
  } else {
    targets.push(currentPrice - (range * multipliers[0]));
    targets.push(currentPrice - (range * multipliers[1]));
    targets.push(currentPrice - (range * multipliers[2]));
  }
  
  return targets;
};

export const calculateStopLoss = (
  currentPrice: number, 
  direction: string, 
  support: number, 
  resistance: number, 
  timeframe: string
) => {
  const range = resistance - support;
  const stopLossMultiplier = getStopLossMultiplier(timeframe);
  
  return direction === "صاعد" ? 
    currentPrice - (range * stopLossMultiplier) : 
    currentPrice + (range * stopLossMultiplier);
};

export const calculateSupportResistance = (
  prices: number[], 
  currentPrice: number, 
  direction: string, 
  timeframe: string
) => {
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const priceIndex = sortedPrices.findIndex(p => p >= currentPrice);
  
  // تعديل نطاق البحث عن مستويات الدعم والمقاومة بناءً على الإطار الزمني
  const rangeMultiplier = getRangeMultiplier(timeframe);
  const range = Math.floor(sortedPrices.length * rangeMultiplier);
  
  const nearestLower = sortedPrices.slice(Math.max(0, priceIndex - range), priceIndex);
  const nearestHigher = sortedPrices.slice(priceIndex, Math.min(priceIndex + range, sortedPrices.length));
  
  const support = Math.min(...nearestLower);
  const resistance = Math.max(...nearestHigher);

  return { support, resistance };
};

export const detectTrend = (prices: number[]): "صاعد" | "هابط" => {
  const isUptrend = prices[prices.length - 1] > prices[0];
  return isUptrend ? "صاعد" : "هابط";
};

export const calculateBestEntryPoint = (
  currentPrice: number,
  direction: string,
  support: number,
  resistance: number,
  fibLevels: { level: number; price: number }[],
  timeframe: string
): { price: number; reason: string } => {
  const range = resistance - support;
  const entryMultiplier = getEntryMultiplier(timeframe);
  
  if (direction === "صاعد") {
    const entryPrice = currentPrice - (range * entryMultiplier);
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: `نقطة دخول محسوبة على الإطار الزمني ${getTimeframeLabel(timeframe)} مع اتجاه صاعد`
    };
  } else {
    const entryPrice = currentPrice + (range * entryMultiplier);
    return {
      price: Number(entryPrice.toFixed(2)),
      reason: `نقطة دخول محسوبة على الإطار الزمني ${getTimeframeLabel(timeframe)} مع اتجاه هابط`
    };
  }
};

export const getExpectedTime = (timeframe: string, targetIndex: number) => {
  const now = new Date();
  
  switch (timeframe) {
    case "1m":
      return addMinutes(now, (targetIndex + 1) * 1);
    case "5m":
      return addMinutes(now, (targetIndex + 1) * 5);
    case "30m":
      return addMinutes(now, (targetIndex + 1) * 30);
    case "1h":
      return addHours(now, targetIndex + 1);
    case "4h":
      return addHours(now, (targetIndex + 1) * 4);
    case "1d":
      return addDays(now, targetIndex + 1);
    default:
      return addHours(now, (targetIndex + 1) * 4);
  }
};

const getTimeframeMultipliers = (timeframe: string): number[] => {
  switch (timeframe) {
    case "1m":
      return [0.1, 0.2, 0.3];  // أهداف قصيرة جداً للإطار الزمني 1 دقيقة
    case "5m":
      return [0.15, 0.3, 0.45];  // أهداف قصيرة للإطار الزمني 5 دقائق
    case "30m":
      return [0.2, 0.4, 0.6];  // أهداف متوسطة للإطار الزمني 30 دقيقة
    case "1h":
      return [0.3, 0.6, 0.9];  // أهداف متوسطة للإطار الزمني ساعة
    case "4h":
      return [0.5, 1.0, 1.5];  // أهداف أكبر للإطار الزمني 4 ساعات
    case "1d":
      return [0.8, 1.6, 2.4];  // أهداف كبيرة للإطار الزمني اليومي
    default:
      return [0.5, 1.0, 1.5];
  }
};

const getStopLossMultiplier = (timeframe: string): number => {
  switch (timeframe) {
    case "1m":
      return 0.05;  // وقف خسارة قريب جداً
    case "5m":
      return 0.08;
    case "30m":
      return 0.1;
    case "1h":
      return 0.15;
    case "4h":
      return 0.2;
    case "1d":
      return 0.25;  // وقف خسارة أبعد للإطار الزمني اليومي
    default:
      return 0.2;
  }
};

const getRangeMultiplier = (timeframe: string): number => {
  switch (timeframe) {
    case "1m":
      return 0.1;  // نطاق ضيق للغاية
    case "5m":
      return 0.15;
    case "30m":
      return 0.2;
    case "1h":
      return 0.25;
    case "4h":
      return 0.3;
    case "1d":
      return 0.4;  // نطاق أوسع
    default:
      return 0.3;
  }
};

const getEntryMultiplier = (timeframe: string): number => {
  switch (timeframe) {
    case "1m":
      return 0.02;  // دخول قريب جداً
    case "5m":
      return 0.03;
    case "30m":
      return 0.05;
    case "1h":
      return 0.08;
    case "4h":
      return 0.1;
    case "1d":
      return 0.15;  // دخول أبعد
    default:
      return 0.1;
  }
};

const getTimeframeLabel = (timeframe: string): string => {
  switch (timeframe) {
    case "1m":
      return "دقيقة واحدة";
    case "5m":
      return "5 دقائق";
    case "30m":
      return "30 دقيقة";
    case "1h":
      return "ساعة واحدة";
    case "4h":
      return "4 ساعات";
    case "1d":
      return "يومي";
    default:
      return timeframe;
  }
};