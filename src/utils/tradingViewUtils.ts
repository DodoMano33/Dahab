
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
  if (!symbol) return '';
  
  // Convert to uppercase for consistency
  let cleanedSymbol = symbol.toUpperCase();
  
  // TradingView symbols often come in format like "EXCHANGE:SYMBOL"
  if (cleanedSymbol.includes(':')) {
    const parts = cleanedSymbol.split(':');
    cleanedSymbol = parts[1] || parts[0]; // Return the part after colon, or the whole string if splitting fails
  }
  
  // If it's gold, normalize to XAUUSD for consistency
  if (cleanedSymbol === 'GOLD') {
    return 'XAUUSD';
  }
  
  return cleanedSymbol;
};

// Helper function to validate price value
export const isValidPrice = (price: number): boolean => {
  return !isNaN(price) && isFinite(price) && price > 0;
};

// Helper to extract price from TradingView message - enhanced to handle more formats
export const extractPriceFromMessage = (data: any): number | null => {
  if (!data) return null;
  
  try {
    // Handle common message formats
    if (typeof data === 'object') {
      // Direct price fields
      if (typeof data.price === 'number') return data.price;
      if (typeof data.last_price === 'number') return data.last_price;
      if (typeof data.close === 'number') return data.close;
      if (typeof data.last === 'number') return data.last;
      
      // Nested price fields
      if (data.symbolInfo) {
        if (typeof data.symbolInfo.price === 'number') return data.symbolInfo.price;
        if (typeof data.symbolInfo.last === 'number') return data.symbolInfo.last;
        if (typeof data.symbolInfo.close === 'number') return data.symbolInfo.close;
      }
      
      // Handle crosshair price data
      if (data.name === 'crosshair' && data.price) {
        return parseFloat(data.price);
      }
      
      // Special handling for "study-event" messages
      if (data.name === 'study-event' && data.data && data.data.value) {
        const value = parseFloat(data.data.value);
        if (!isNaN(value)) return value;
      }
      
      // Special handling for "price" field that might be a string
      if (data.price && typeof data.price === 'string') {
        const price = parseFloat(data.price);
        if (!isNaN(price)) return price;
      }

      // Handle "ohlc" format
      if (data.ohlc && typeof data.ohlc.close === 'number') {
        return data.ohlc.close;
      }
      
      // Try to extract from "content" if it exists
      if (data.content && typeof data.content === 'object') {
        return extractPriceFromMessage(data.content);
      }
    }
    
    // Handle string that could be parsed as number
    if (typeof data === 'string') {
      const parsed = parseFloat(data);
      if (!isNaN(parsed)) return parsed;
    }
    
    // Handle direct number
    if (typeof data === 'number' && !isNaN(data)) {
      return data;
    }
  } catch (error) {
    console.error('Error extracting price from message:', error);
  }
  
  return null;
};

// Helper to extract symbol from TradingView message - enhanced to handle more formats
export const extractSymbolFromMessage = (data: any): string | null => {
  if (!data) return null;
  
  try {
    if (typeof data === 'object') {
      // Direct symbol field
      if (data.name === 'symbol-change' && data.symbol) {
        return data.symbol;
      }
      
      // Symbol field directly in the object
      if (data.symbol && typeof data.symbol === 'string') {
        return data.symbol;
      }
      
      // Nested in symbolInfo
      if (data.symbolInfo) {
        if (data.symbolInfo.name) return data.symbolInfo.name;
        if (data.symbolInfo.symbol) return data.symbolInfo.symbol;
      }
      
      // Check for ticker field
      if (data.ticker && typeof data.ticker === 'string') {
        return data.ticker;
      }
      
      // Handle "search-symbol" message type
      if (data.name === 'search-symbol' && data.searchedSymbol) {
        return data.searchedSymbol;
      }

      // Try to extract from "content" if it exists
      if (data.content && typeof data.content === 'object') {
        return extractSymbolFromMessage(data.content);
      }
    }
  } catch (error) {
    console.error('Error extracting symbol from message:', error);
  }
  
  return null;
};
