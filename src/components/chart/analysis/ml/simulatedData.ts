
/**
 * وحدة توليد بيانات محاكاة للتحليل
 * تستخدم عندما لا تتوفر بيانات تاريخية حقيقية
 */

/**
 * توليد بيانات أسعار محاكاة
 * @param currentPrice - السعر الحالي للبناء حوله
 * @returns مصفوفة من الأسعار المحاكاة
 */
export function generateSimulatedPrices(currentPrice: number): number[] {
  console.log(`توليد بيانات محاكاة حول السعر الحالي: ${currentPrice}`);
  const prices: number[] = [];
  const volatility = 0.01; // نسبة التقلب
  
  // توليد 200 سعر تاريخي للمحاكاة
  for (let i = 0; i < 200; i++) {
    if (i === 0) {
      // بدء من سعر أقل من الحالي
      prices.push(currentPrice * (1 - volatility));
    } else {
      const change = (Math.random() - 0.5) * volatility * 2;
      prices.push(prices[i - 1] * (1 + change));
    }
  }
  
  // إضافة بعض الأنماط بدلاً من البيانات العشوائية البحتة
  addPricePatterns(prices, currentPrice);
  
  // التأكد من أن آخر سعر هو السعر الحالي
  prices.push(currentPrice);
  
  return prices;
}

/**
 * إضافة أنماط سعرية محددة لزيادة واقعية البيانات المحاكاة
 */
function addPricePatterns(prices: number[], currentPrice: number): void {
  const patternType = Math.floor(Math.random() * 4); // 4 أنواع من الأنماط
  const length = prices.length;
  
  switch (patternType) {
    case 0:
      // نمط ترند صاعد
      for (let i = length - 30; i < length; i++) {
        prices[i] = prices[Math.max(0, i - 1)] * (1 + 0.002 + (Math.random() - 0.3) * 0.01);
      }
      break;
      
    case 1:
      // نمط ترند هابط
      for (let i = length - 30; i < length; i++) {
        prices[i] = prices[Math.max(0, i - 1)] * (1 - 0.002 + (Math.random() - 0.7) * 0.01);
      }
      break;
      
    case 2:
      // نمط تذبذبي (قناة سعرية)
      let direction = 1;
      for (let i = length - 50; i < length; i++) {
        if (i % 10 === 0) direction *= -1;
        prices[i] = prices[Math.max(0, i - 1)] * (1 + direction * 0.003 + (Math.random() - 0.5) * 0.005);
      }
      break;
      
    case 3:
      // نمط مثلث متماثل (تضييق المدى)
      const midPoint = prices[length - 50];
      const amplitude = 0.03; // المدى الأولي
      
      for (let i = length - 50; i < length; i++) {
        const position = (i - (length - 50)) / 50; // 0 إلى 1
        const currentAmplitude = amplitude * (1 - position); // يتناقص مع الوقت
        const oscillation = Math.sin((i - length + 50) * 0.3) * currentAmplitude;
        prices[i] = midPoint * (1 + oscillation);
      }
      break;
  }
  
  // تعديل آخر الأسعار لتقترب من السعر الحالي
  const lastIndex = prices.length - 1;
  prices[lastIndex - 3] = currentPrice * 0.995;
  prices[lastIndex - 2] = currentPrice * 0.997;
  prices[lastIndex - 1] = currentPrice * 0.999;
}

/**
 * توليد بيانات محاكاة لعدة أطر زمنية مختلفة
 * @param currentPrice - السعر الحالي
 * @returns كائن يحتوي على بيانات محاكاة لكل إطار زمني
 */
export function generateMultiTimeframeSimulatedData(
  currentPrice: number
): { [timeframe: string]: number[] } {
  return {
    "1h": generateSimulatedPrices(currentPrice),
    "4h": generateSimulatedPrices(currentPrice).filter((_, i) => i % 4 === 0),
    "1d": generateSimulatedPrices(currentPrice).filter((_, i) => i % 24 === 0)
  };
}
