
/**
 * وحدة توليد بيانات محاكاة للتحليل
 */

/**
 * دالة مساعدة لتوليد بيانات محاكاة إذا لم تتوفر بيانات حقيقية
 * @param currentPrice - السعر الحالي
 * @returns مصفوفة من الأسعار المحاكاة
 */
export const generateSimulatedPrices = (currentPrice: number): number[] => {
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
