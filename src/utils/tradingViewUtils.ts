
/**
 * Formats a symbol string for proper TradingView display
 * by adding the appropriate exchange prefix if needed
 */
export const formatSymbolForTradingView = (symbol: string): string => {
  if (!symbol) return "CAPITALCOM:GOLD"; // Default
  
  // If already contains exchange prefix, return as is
  if (symbol.includes(':')) return symbol;
  
  const upperSymbol = symbol.toUpperCase();
  
  // Common patterns for different types of symbols
  if (upperSymbol.includes('USD') && !upperSymbol.includes('USDT')) {
    // Forex pairs
    if (upperSymbol === 'XAUUSD' || upperSymbol === 'GOLD') {
      return `CAPITALCOM:GOLD`;
    } else if (upperSymbol === 'XAGUSD' || upperSymbol === 'SILVER') {
      return `CAPITALCOM:SILVER`;
    } else {
      return `FX:${upperSymbol}`;
    }
  } else if (
    upperSymbol.endsWith('USDT') || 
    upperSymbol.endsWith('BTC') || 
    upperSymbol.includes('BTC') || 
    upperSymbol.includes('ETH')
  ) {
    // Crypto pairs
    return `BINANCE:${upperSymbol}`;
  } else {
    // Stocks and others - default to NASDAQ
    return `NASDAQ:${upperSymbol}`;
  }
};

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
          Chart Preview for ${symbol} - ${timeframe}
        </text>
      </svg>
    `)}`;
  } catch (error) {
    console.error("Error generating TradingView chart:", error);
    throw new Error("فشل في إنشاء صورة الشارت");
  }
};
