
export const getTimeframeStopLossMultiplier = (timeframe: string): number => {
  // نسب وقف الخسارة معدلة حسب استراتيجية SMC
  switch (timeframe) {
    case "1m":
      return 0.003; // 0.3%
    case "5m":
      return 0.005; // 0.5%
    case "30m":
      return 0.008; // 0.8%
    case "1h":
      return 0.013; // 1.3%
    case "4h":
      return 0.021; // 2.1%
    case "1d":
      return 0.034; // 3.4%
    default:
      return 0.013; // 1.3%
  }
};

export const getTimeframeTargetMultipliers = (timeframe: string): number[] => {
  // مضاعفات الأهداف معدلة حسب مناطق عدم التوازن في SMC
  switch (timeframe) {
    case "1m":
      return [0.005, 0.008, 0.013]; // 0.5%, 0.8%, 1.3%
    case "5m":
      return [0.008, 0.013, 0.021]; // 0.8%, 1.3%, 2.1%
    case "30m":
      return [0.013, 0.021, 0.034]; // 1.3%, 2.1%, 3.4%
    case "1h":
      return [0.021, 0.034, 0.055]; // 2.1%, 3.4%, 5.5%
    case "4h":
      return [0.034, 0.055, 0.089]; // 3.4%, 5.5%, 8.9%
    case "1d":
      return [0.055, 0.089, 0.144]; // 5.5%, 8.9%, 14.4%
    default:
      return [0.021, 0.034, 0.055]; // 2.1%, 3.4%, 5.5%
  }
};
