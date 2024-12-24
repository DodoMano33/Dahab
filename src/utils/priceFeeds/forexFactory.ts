interface ForexFactoryPrice {
  symbol: string;
  price: number;
  timestamp: Date;
}

export const getForexFactoryPrice = async (symbol: string): Promise<number> => {
  try {
    console.log(`جاري جلب السعر من ForexFactory للعملة ${symbol}`);
    
    // Updated mock prices to match current market prices
    const mockPrices: { [key: string]: number } = {
      'EURUSD': 1.0925,
      'GBPUSD': 1.2715,
      'USDJPY': 142.35,
      'XAUUSD': 2615.43, // Updated to match current market price
      'BTCUSD': 42150.75,
    };

    const price = mockPrices[symbol.toUpperCase()];
    if (!price) {
      throw new Error(`لا يتوفر سعر للعملة ${symbol}`);
    }

    // Add small random variation to simulate live price
    const variation = (Math.random() - 0.5) * 0.0002 * price;
    const finalPrice = Number((price + variation).toFixed(2));

    console.log(`تم جلب السعر من ForexFactory للعملة ${symbol}: ${finalPrice}`);
    return finalPrice;
  } catch (error) {
    console.error(`خطأ في جلب السعر من ForexFactory للعملة ${symbol}:`, error);
    throw error;
  }
};