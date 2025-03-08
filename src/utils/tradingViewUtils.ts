
export const getTradingViewChartImage = async (
  symbol: string,
  timeframe: string,
  currentPrice: number
): Promise<string> => {
  try {
    console.log("Generating TradingView chart for:", { symbol, timeframe, currentPrice });
    
    // For now, return a placeholder image URL since we can't actually get TradingView charts
    // This should be replaced with actual TradingView API integration
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" font-family="Arial" font-size="20" text-anchor="middle">
          Chart Preview for ${symbol} - ${timeframe} at ${currentPrice}
        </text>
      </svg>
    `)}`;
  } catch (error) {
    console.error("Error generating TradingView chart:", error);
    throw new Error("فشل في إنشاء صورة الشارت");
  }
};

// Helper function to extract clean symbol name from TradingView format
export const cleanSymbolName = (symbol: string): string => {
  // TradingView symbols often come in format like "EXCHANGE:SYMBOL"
  if (symbol.includes(':')) {
    const parts = symbol.split(':');
    return parts[1] || parts[0]; // Return the part after colon, or the whole string if splitting fails
  }
  return symbol;
};

// Helper function to validate price value
export const isValidPrice = (price: number): boolean => {
  return !isNaN(price) && isFinite(price) && price > 0;
};

// Helper to extract price from TradingView message
export const extractPriceFromMessage = (data: any): number | null => {
  if (!data || typeof data !== 'object') return null;
  
  if (typeof data.price === 'number') return data.price;
  if (typeof data.last_price === 'number') return data.last_price;
  if (typeof data.close === 'number') return data.close;
  if (data.symbolInfo && typeof data.symbolInfo.price === 'number') return data.symbolInfo.price;
  if (data.symbolInfo && typeof data.symbolInfo.last === 'number') return data.symbolInfo.last;
  
  return null;
};

// Helper to extract symbol from TradingView message
export const extractSymbolFromMessage = (data: any): string | null => {
  if (!data || typeof data !== 'object') return null;
  
  if (data.name === 'symbol-change' && data.symbol) return data.symbol;
  if (data.symbolInfo && data.symbolInfo.name) return data.symbolInfo.name;
  if (data.symbol && typeof data.symbol === 'string') return data.symbol;
  
  return null;
};
