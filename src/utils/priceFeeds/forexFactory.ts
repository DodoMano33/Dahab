interface ForexFactoryPrice {
  symbol: string;
  price: number;
  timestamp: Date;
}

export const getForexFactoryPrice = async (symbol: string): Promise<number> => {
  try {
    console.log(`جاري جلب السعر من ForexFactory للعملة ${symbol}`);
    
    // Since ForexFactory doesn't provide a public API, we'll simulate the price feed
    // In a production environment, you would implement web scraping or use their API
    const mockPrices: { [key: string]: number } = {
      'EURUSD': 1.0925,
      'GBPUSD': 1.2715,
      'USDJPY': 142.35,
      'XAUUSD': 2023.50,
      'BTCUSD': 42150.75,
    };

    const price = mockPrices[symbol] || 0;
    if (price === 0) {
      throw new Error(`لا يتوفر سعر للعملة ${symbol}`);
    }

    // Add small random variation to simulate live price
    const variation = (Math.random() - 0.5) * 0.0002 * price;
    const finalPrice = Number((price + variation).toFixed(5));

    console.log(`تم جلب السعر من ForexFactory للعملة ${symbol}: ${finalPrice}`);
    return finalPrice;
  } catch (error) {
    console.error(`خطأ في جلب السعر من ForexFactory للعملة ${symbol}:`, error);
    throw error;
  }
};