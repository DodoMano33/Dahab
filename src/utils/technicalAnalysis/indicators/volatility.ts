
// وظيفة حساب متوسط المدى الحقيقي (ATR)
export const calculateATR = (prices: number[], period: number = 14): number => {
  // في النسخة المبسطة، نستخدم نطاق الأسعار كبديل للـ ATR
  const ranges = [];
  for (let i = 1; i < prices.length; i++) {
    ranges.push(Math.abs(prices[i] - prices[i - 1]));
  }
  
  // حساب متوسط النطاقات
  const sum = ranges.slice(-period).reduce((a, b) => a + b, 0);
  return sum / Math.min(period, ranges.length);
};

// حساب تقلب الأسعار (Volatility)
export const calculateVolatility = (prices: number[], period: number = 14): number => {
  // حساب التغيرات اليومية كنسبة مئوية
  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    const change = Math.abs((prices[i] - prices[i - 1]) / prices[i - 1]);
    changes.push(change);
  }
  
  // حساب متوسط التغيرات للفترة المحددة
  const recentChanges = changes.slice(-period);
  const avg = recentChanges.reduce((a, b) => a + b, 0) / recentChanges.length;
  
  return avg;
};
