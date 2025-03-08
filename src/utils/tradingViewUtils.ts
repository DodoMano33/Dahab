
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
    return symbol.split(':')[1];
  }
  return symbol;
};

// Helper function to validate price value
export const isValidPrice = (price: number): boolean => {
  return !isNaN(price) && isFinite(price) && price > 0;
};
