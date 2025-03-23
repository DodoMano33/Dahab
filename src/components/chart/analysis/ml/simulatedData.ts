
/**
 * وحدة توليد بيانات محاكاة للتحليل
 */

/**
 * دالة مساعدة لتوليد بيانات محاكاة إذا لم تتوفر بيانات حقيقية
 * @param currentPrice - السعر الحالي
 * @param numPoints - عدد نقاط البيانات المراد توليدها (الافتراضي: 200)
 * @param volatility - نسبة التقلب (الافتراضي: 0.01)
 * @returns مصفوفة من الأسعار المحاكاة
 */
export const generateSimulatedPrices = (
  currentPrice: number, 
  numPoints: number = 200, 
  volatility: number = 0.01
): number[] => {
  const simulatedPrices: number[] = [];
  
  // توليد أسعار تاريخية للمحاكاة
  for (let i = 0; i < numPoints; i++) {
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

/**
 * دالة لتوليد بيانات محاكاة مع اتجاه محدد
 * @param currentPrice - السعر الحالي
 * @param trend - الاتجاه المطلوب ("صاعد" أو "هابط" أو "محايد")
 * @param numPoints - عدد نقاط البيانات المراد توليدها
 * @param volatility - نسبة التقلب
 * @returns مصفوفة من الأسعار المحاكاة
 */
export const generateSimulatedPricesWithTrend = (
  currentPrice: number,
  trend: "صاعد" | "هابط" | "محايد" = "محايد",
  numPoints: number = 200,
  volatility: number = 0.01
): number[] => {
  const simulatedPrices: number[] = [];
  
  // تحديد اتجاه السعر الإجمالي
  let trendFactor = 0;
  if (trend === "صاعد") trendFactor = 0.001;
  else if (trend === "هابط") trendFactor = -0.001;
  
  // توليد أسعار تاريخية للمحاكاة مع مراعاة الاتجاه
  for (let i = 0; i < numPoints; i++) {
    if (i === 0) {
      simulatedPrices.push(currentPrice * (1 - volatility * 3));
    } else {
      const randomChange = (Math.random() - 0.5) * volatility * 2;
      const change = randomChange + trendFactor;
      simulatedPrices.push(simulatedPrices[i - 1] * (1 + change));
    }
  }
  
  // إضافة السعر الحالي في النهاية
  simulatedPrices.push(currentPrice);
  
  return simulatedPrices;
};

/**
 * دالة لتوليد بيانات محاكاة مع أنماط سعرية مختلفة
 * @param currentPrice - السعر الحالي
 * @param pattern - نمط السعر ("ترند صاعد"، "ترند هابط"، "تذبذب"، "قاع مزدوج"، "قمة مزدوجة")
 * @param numPoints - عدد نقاط البيانات المراد توليدها
 * @returns مصفوفة من الأسعار المحاكاة
 */
export const generateSimulatedPricesWithPattern = (
  currentPrice: number,
  pattern: "ترند صاعد" | "ترند هابط" | "تذبذب" | "قاع مزدوج" | "قمة مزدوجة" = "تذبذب",
  numPoints: number = 200
): number[] => {
  let simulatedPrices: number[] = [];
  
  switch (pattern) {
    case "ترند صاعد":
      simulatedPrices = generateSimulatedPricesWithTrend(currentPrice, "صاعد", numPoints, 0.01);
      break;
      
    case "ترند هابط":
      simulatedPrices = generateSimulatedPricesWithTrend(currentPrice, "هابط", numPoints, 0.01);
      break;
      
    case "تذبذب":
      // إنشاء نمط تذبذب في نطاق محدد
      simulatedPrices.push(currentPrice * 0.97);
      const range = currentPrice * 0.05;
      const center = currentPrice * 0.97;
      
      for (let i = 1; i < numPoints; i++) {
        const noiseLevel = 0.002;
        const noise = (Math.random() - 0.5) * noiseLevel * currentPrice;
        const amplitude = range / 2;
        const period = numPoints / 5;
        const priceWithCycle = center + amplitude * Math.sin((i / period) * Math.PI * 2) + noise;
        simulatedPrices.push(priceWithCycle);
      }
      simulatedPrices.push(currentPrice);
      break;
      
    case "قاع مزدوج":
      // إنشاء نمط قاع مزدوج
      simulatedPrices.push(currentPrice * 1.02);
      
      // المرحلة الأولى: هبوط إلى القاع الأول
      const firstLowPoint = numPoints * 0.25;
      const secondLowPoint = numPoints * 0.75;
      
      for (let i = 1; i < numPoints; i++) {
        const noise = (Math.random() - 0.5) * 0.003 * currentPrice;
        
        if (i < firstLowPoint) {
          // هبوط إلى القاع الأول
          const progress = i / firstLowPoint;
          simulatedPrices.push(currentPrice * (1.02 - 0.05 * progress) + noise);
        } 
        else if (i < firstLowPoint + (secondLowPoint - firstLowPoint) * 0.5) {
          // ارتفاع متوسط
          const progress = (i - firstLowPoint) / ((secondLowPoint - firstLowPoint) * 0.5);
          simulatedPrices.push(currentPrice * (0.97 + 0.02 * progress) + noise);
        } 
        else if (i < secondLowPoint) {
          // هبوط إلى القاع الثاني
          const progress = (i - (firstLowPoint + (secondLowPoint - firstLowPoint) * 0.5)) / ((secondLowPoint - firstLowPoint) * 0.5);
          simulatedPrices.push(currentPrice * (0.99 - 0.02 * progress) + noise);
        } 
        else {
          // ارتفاع نهائي
          const progress = (i - secondLowPoint) / (numPoints - secondLowPoint);
          simulatedPrices.push(currentPrice * (0.97 + 0.03 * progress) + noise);
        }
      }
      simulatedPrices.push(currentPrice);
      break;
      
    case "قمة مزدوجة":
      // إنشاء نمط قمة مزدوجة
      simulatedPrices.push(currentPrice * 0.98);
      
      // المرحلة الأولى: صعود إلى القمة الأولى
      const firstHighPoint = numPoints * 0.25;
      const secondHighPoint = numPoints * 0.75;
      
      for (let i = 1; i < numPoints; i++) {
        const noise = (Math.random() - 0.5) * 0.003 * currentPrice;
        
        if (i < firstHighPoint) {
          // صعود إلى القمة الأولى
          const progress = i / firstHighPoint;
          simulatedPrices.push(currentPrice * (0.98 + 0.05 * progress) + noise);
        } 
        else if (i < firstHighPoint + (secondHighPoint - firstHighPoint) * 0.5) {
          // هبوط متوسط
          const progress = (i - firstHighPoint) / ((secondHighPoint - firstHighPoint) * 0.5);
          simulatedPrices.push(currentPrice * (1.03 - 0.02 * progress) + noise);
        } 
        else if (i < secondHighPoint) {
          // صعود إلى القمة الثانية
          const progress = (i - (firstHighPoint + (secondHighPoint - firstHighPoint) * 0.5)) / ((secondHighPoint - firstHighPoint) * 0.5);
          simulatedPrices.push(currentPrice * (1.01 + 0.02 * progress) + noise);
        } 
        else {
          // هبوط نهائي
          const progress = (i - secondHighPoint) / (numPoints - secondHighPoint);
          simulatedPrices.push(currentPrice * (1.03 - 0.03 * progress) + noise);
        }
      }
      simulatedPrices.push(currentPrice);
      break;
      
    default:
      // نمط تذبذب افتراضي
      simulatedPrices = generateSimulatedPrices(currentPrice, numPoints, 0.01);
      break;
  }
  
  return simulatedPrices;
};
