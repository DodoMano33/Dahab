export const getTimeframeMultipliers = (timeframe: string): number[] => {
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

export const getStopLossMultiplier = (timeframe: string): number => {
  switch (timeframe) {
    case "1m":
      return 0.05;
    case "5m":
      return 0.08;
    case "30m":
      return 0.1;
    case "1h":
      return 0.15;
    case "4h":
      return 0.2;
    case "1d":
      return 0.25;
    default:
      return 0.2;
  }
};

export const getRangeMultiplier = (timeframe: string): number => {
  switch (timeframe) {
    case "1m":
      return 0.1;
    case "5m":
      return 0.15;
    case "30m":
      return 0.2;
    case "1h":
      return 0.25;
    case "4h":
      return 0.3;
    case "1d":
      return 0.4;
    default:
      return 0.3;
  }
};

export const getEntryMultiplier = (timeframe: string): number => {
  switch (timeframe) {
    case "1m":
      return 0.02;
    case "5m":
      return 0.03;
    case "30m":
      return 0.05;
    case "1h":
      return 0.08;
    case "4h":
      return 0.1;
    case "1d":
      return 0.15;
    default:
      return 0.1;
  }
};