// Based on Investopedia's scalping strategies
export const analyzeScalpingSetup = (
  currentPrice: number,
  prices: number[],
  volume?: number[]
) => {
  // 1-2 Minute Price Action Analysis
  const lastPrice = prices[prices.length - 1];
  const priceChange = ((lastPrice - currentPrice) / currentPrice) * 100;
  
  // Typical scalping targets are 5-10 pips
  const pip = currentPrice * 0.0001;
  const targets = [
    currentPrice + (pip * 5),  // Conservative target
    currentPrice + (pip * 10)  // Aggressive target
  ];

  // Scalping stop loss is typically 2-3 pips
  const stopLoss = currentPrice - (pip * 2);

  // Market conditions analysis
  const isHighVolume = volume ? volume[volume.length - 1] > average(volume) : true;
  const spread = pip * 2; // Simulated spread
  
  // Determine if conditions are favorable for scalping
  const isFavorable = spread < (pip * 1) && isHighVolume && Math.abs(priceChange) < 0.1;

  return {
    targets: targets.map((price, index) => ({
      price,
      expectedTime: addMinutes(new Date(), (index + 1) * 5) // Scalping targets within 5-10 minutes
    })),
    stopLoss,
    bestEntryPoint: {
      price: currentPrice,
      reason: isFavorable 
        ? "ظروف السوق مناسبة للسكالبينج: سيولة عالية وسبريد منخفض"
        : "ظروف السوق غير مثالية للسكالبينج، يفضل الانتظار"
    },
    pattern: isFavorable ? "نموذج سكالبينج مناسب" : "ظروف غير مثالية للسكالبينج",
    support: currentPrice - (pip * 5),
    resistance: currentPrice + (pip * 5)
  };
};

const average = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

const addMinutes = (date: Date, minutes: number) => {
  return new Date(date.getTime() + minutes * 60000);
};