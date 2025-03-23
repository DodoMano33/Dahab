
/**
 * خدمات إدارة المخاطر وحسابات وقف الخسارة
 */
import { calculateVolatility } from './volatility';

/**
 * حساب وقف الخسارة المناسب بناءً على التقلب السعري
 * @param price - السعر الحالي
 * @param direction - اتجاه الصفقة (صاعد/هابط)
 * @param volatility - نسبة التقلب (اختياري)
 * @param historicalPrices - سلسلة الأسعار التاريخية (اختياري)
 * @returns سعر وقف الخسارة المناسب
 */
export const calculateStopLoss = (
  price: number,
  direction: 'صاعد' | 'هابط',
  support?: number,
  resistance?: number,
  timeframe?: string
): number => {
  // إذا كان لدينا مستويات دعم ومقاومة، نستخدمها لحساب وقف الخسارة
  if (support && resistance && direction === 'صاعد') {
    // في الاتجاه الصاعد، نضع وقف الخسارة أسفل مستوى الدعم بشكل طفيف
    return Number(support) * 0.995;
  } else if (support && resistance && direction === 'هابط') {
    // في الاتجاه الهابط، نضع وقف الخسارة فوق مستوى المقاومة بشكل طفيف
    return Number(resistance) * 1.005;
  }
  
  // ضبط نسبة وقف الخسارة بناءً على الإطار الزمني
  let stopLossPercentage = 0.02; // افتراضي 2%
  
  if (timeframe) {
    switch (timeframe.toLowerCase()) {
      case '1m':
      case '5m':
        stopLossPercentage = 0.005; // 0.5% للإطارات الزمنية القصيرة جدًا
        break;
      case '15m':
      case '30m':
        stopLossPercentage = 0.01; // 1% للإطارات الزمنية القصيرة
        break;
      case '1h':
      case '2h':
        stopLossPercentage = 0.015; // 1.5% للإطارات الزمنية المتوسطة
        break;
      case '4h':
      case 'daily':
      case '1d':
        stopLossPercentage = 0.025; // 2.5% للإطارات الزمنية الطويلة
        break;
      case 'weekly':
      case '1w':
        stopLossPercentage = 0.05; // 5% للإطارات الزمنية الأسبوعية
        break;
      default:
        stopLossPercentage = 0.02; // 2% افتراضي
    }
  }
  
  // حساب سعر وقف الخسارة
  if (direction === 'صاعد') {
    return price * (1 - stopLossPercentage);
  } else {
    return price * (1 + stopLossPercentage);
  }
};

/**
 * حساب خطة إدارة المخاطر الشاملة
 * @param price - السعر الحالي
 * @param targets - أهداف الربح
 * @param stopLoss - وقف الخسارة
 * @returns خطة إدارة المخاطر المتكاملة
 */
export const createRiskManagementPlan = (
  price: number,
  targets: number[],
  stopLoss: number
) => {
  const direction = price < stopLoss ? 'هابط' : 'صاعد';
  const riskAmount = Math.abs(price - stopLoss);
  
  const riskRewardRatios = targets.map(target => {
    const rewardAmount = Math.abs(target - price);
    return rewardAmount / riskAmount;
  });
  
  return {
    direction,
    riskAmount,
    riskRewardRatios,
    averageRiskRewardRatio: riskRewardRatios.reduce((sum, ratio) => sum + ratio, 0) / riskRewardRatios.length
  };
};
