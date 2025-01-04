export const getTimeframeStopLossMultiplier = (timeframe: string): number => {
  switch (timeframe) {
    case "1m":
      return 0.001; // 0.1%
    case "5m":
      return 0.002; // 0.2%
    case "30m":
      return 0.003; // 0.3%
    case "1h":
      return 0.005; // 0.5%
    case "4h":
      return 0.008; // 0.8%
    case "1d":
      return 0.01;  // 1%
    default:
      return 0.005; // 0.5%
  }
};

export const getTimeframeTargetMultipliers = (timeframe: string): number[] => {
  switch (timeframe) {
    case "1m":
      return [0.002, 0.003, 0.005]; // 0.2%, 0.3%, 0.5%
    case "5m":
      return [0.003, 0.005, 0.008]; // 0.3%, 0.5%, 0.8%
    case "30m":
      return [0.005, 0.008, 0.013]; // 0.5%, 0.8%, 1.3%
    case "1h":
      return [0.008, 0.013, 0.021]; // 0.8%, 1.3%, 2.1%
    case "4h":
      return [0.013, 0.021, 0.034]; // 1.3%, 2.1%, 3.4%
    case "1d":
      return [0.021, 0.034, 0.055]; // 2.1%, 3.4%, 5.5%
    default:
      return [0.008, 0.013, 0.021]; // 0.8%, 1.3%, 2.1%
  }
};