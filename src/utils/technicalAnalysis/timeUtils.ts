
// وظيفة للحصول على وقت متوقع بناءً على الإطار الزمني
export const getExpectedTime = (timeframe: string, targetIndex: number = 0): Date => {
  const now = new Date();
  
  // اعتماداً على الإطار الزمني، نقوم بإضافة وقت مختلف
  switch (timeframe) {
    case '1m':
      return new Date(now.getTime() + (targetIndex + 1) * 1 * 60 * 1000);
    case '5m':
      return new Date(now.getTime() + (targetIndex + 1) * 5 * 60 * 1000);
    case '15m':
      return new Date(now.getTime() + (targetIndex + 1) * 15 * 60 * 1000);
    case '30m':
      return new Date(now.getTime() + (targetIndex + 1) * 30 * 60 * 1000);
    case '1h':
      return new Date(now.getTime() + (targetIndex + 1) * 60 * 60 * 1000);
    case '4h':
      return new Date(now.getTime() + (targetIndex + 1) * 4 * 60 * 60 * 1000);
    case '1d':
      return new Date(now.getTime() + (targetIndex + 1) * 24 * 60 * 60 * 1000);
    case '1w':
      return new Date(now.getTime() + (targetIndex + 1) * 7 * 24 * 60 * 60 * 1000);
    case '1M':
      // اضافة شهر (تقريبي - 30 يوم)
      return new Date(now.getTime() + (targetIndex + 1) * 30 * 24 * 60 * 60 * 1000);
    default:
      // الإطار الزمني الافتراضي هو 4 ساعات
      return new Date(now.getTime() + (targetIndex + 1) * 4 * 60 * 60 * 1000);
  }
};

// وظيفة للحصول على اسم الإطار الزمني بالعربية
export const getTimeframeLabel = (timeframe: string): string => {
  const timeframeMap: Record<string, string> = {
    '1m': 'دقيقة',
    '5m': '5 دقائق',
    '15m': '15 دقيقة',
    '30m': '30 دقيقة',
    '1h': 'ساعة',
    '4h': '4 ساعات',
    '1d': 'يوم',
    '1w': 'أسبوع',
    '1M': 'شهر'
  };
  
  return timeframeMap[timeframe] || timeframe;
};
