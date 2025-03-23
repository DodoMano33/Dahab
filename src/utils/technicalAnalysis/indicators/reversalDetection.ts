
/**
 * وحدة اكتشاف نقاط انعكاس الاتجاه
 * تتضمن خوارزميات متخصصة للعثور على نقاط الانعكاس المحتملة في بيانات السعر
 */

/**
 * اكتشاف نقاط انعكاس الاتجاه المحتملة
 * @param prices - مصفوفة الأسعار التاريخية
 * @param threshold - عتبة الحساسية (افتراضي: 0.02 أو 2%)
 * @returns مصفوفة من الأسعار التي تمثل نقاط انعكاس محتملة
 */
export const detectTrendReversalPoints = (
  prices: number[],
  threshold: number = 0.02
): number[] => {
  if (prices.length < 10) {
    return [];
  }
  
  const reversalPoints: number[] = [];
  
  // البحث عن القمم والقيعان المحلية
  for (let i = 3; i < prices.length - 3; i++) {
    // قمة محلية محتملة
    if (prices[i] > prices[i-1] && prices[i] > prices[i+1] && 
        prices[i] > prices[i-2] && prices[i] > prices[i+2] && 
        prices[i] > prices[i-3] && prices[i] > prices[i+3]) {
      
      // حساب النسبة المئوية للانعكاس
      const priorMove = (prices[i] - prices[i-3]) / prices[i-3];
      const afterMove = (prices[i+3] - prices[i]) / prices[i];
      
      // تأكيد الانعكاس إذا كان هناك تغيير كبير في الاتجاه
      if (priorMove > threshold && afterMove < -threshold) {
        reversalPoints.push(prices[i]);
      }
    }
    
    // قاع محلي محتمل
    if (prices[i] < prices[i-1] && prices[i] < prices[i+1] && 
        prices[i] < prices[i-2] && prices[i] < prices[i+2] && 
        prices[i] < prices[i-3] && prices[i] < prices[i+3]) {
      
      // حساب النسبة المئوية للانعكاس
      const priorMove = (prices[i-3] - prices[i]) / prices[i-3];
      const afterMove = (prices[i] - prices[i+3]) / prices[i];
      
      // تأكيد الانعكاس إذا كان هناك تغيير كبير في الاتجاه
      if (priorMove > threshold && afterMove < -threshold) {
        reversalPoints.push(prices[i]);
      }
    }
  }
  
  return reversalPoints;
};

/**
 * التحقق من وجود نموذج "ثلاثة جنود بيض" (Three White Soldiers)
 * نموذج انعكاس صعودي
 * @param prices - مصفوفة الأسعار
 * @returns حالة وجود النموذج
 */
export const detectThreeWhiteSoldiers = (prices: number[]): boolean => {
  if (prices.length < 6) {
    return false;
  }
  
  // أخذ آخر 6 أسعار
  const recentPrices = prices.slice(-6);
  
  // التحقق من وجود 3 شموع صاعدة متتالية بعد اتجاه هبوطي
  const isDowntrendBefore = recentPrices[0] > recentPrices[2];
  const candle1Up = recentPrices[3] > recentPrices[2];
  const candle2Up = recentPrices[4] > recentPrices[3];
  const candle3Up = recentPrices[5] > recentPrices[4];
  
  // التحقق من أن كل شمعة تفتح ضمن جسم الشمعة السابقة وتغلق أعلى
  const progressiveHighs = recentPrices[5] > recentPrices[4] && recentPrices[4] > recentPrices[3];
  
  return isDowntrendBefore && candle1Up && candle2Up && candle3Up && progressiveHighs;
};

/**
 * التحقق من وجود نموذج "ثلاثة غربان سود" (Three Black Crows)
 * نموذج انعكاس هبوطي
 * @param prices - مصفوفة الأسعار
 * @returns حالة وجود النموذج
 */
export const detectThreeBlackCrows = (prices: number[]): boolean => {
  if (prices.length < 6) {
    return false;
  }
  
  // أخذ آخر 6 أسعار
  const recentPrices = prices.slice(-6);
  
  // التحقق من وجود 3 شموع هابطة متتالية بعد اتجاه صعودي
  const isUptrendBefore = recentPrices[0] < recentPrices[2];
  const candle1Down = recentPrices[3] < recentPrices[2];
  const candle2Down = recentPrices[4] < recentPrices[3];
  const candle3Down = recentPrices[5] < recentPrices[4];
  
  // التحقق من أن كل شمعة تفتح ضمن جسم الشمعة السابقة وتغلق أدنى
  const progressiveLows = recentPrices[5] < recentPrices[4] && recentPrices[4] < recentPrices[3];
  
  return isUptrendBefore && candle1Down && candle2Down && candle3Down && progressiveLows;
};
