
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

// Enhanced function to extract price from TradingView message
export const extractPriceFromMessage = (data: any): number | null => {
  if (!data) return null;
  
  try {
    console.log('Attempting to extract price from:', typeof data === 'object' ? JSON.stringify(data) : data);
    
    // Handle common message formats
    if (typeof data === 'object') {
      // Direct price fields
      if (typeof data.price === 'number' && isValidPrice(data.price)) return data.price;
      if (typeof data.last_price === 'number' && isValidPrice(data.last_price)) return data.last_price;
      if (typeof data.close === 'number' && isValidPrice(data.close)) return data.close;
      if (typeof data.last === 'number' && isValidPrice(data.last)) return data.last;
      if (typeof data.value === 'number' && isValidPrice(data.value)) return data.value;
      
      // Check for "lp" field which is often used for last price
      if (typeof data.lp === 'number' && isValidPrice(data.lp)) return data.lp;
      
      // Nested price fields
      if (data.symbolInfo) {
        if (typeof data.symbolInfo.price === 'number' && isValidPrice(data.symbolInfo.price)) return data.symbolInfo.price;
        if (typeof data.symbolInfo.last === 'number' && isValidPrice(data.symbolInfo.last)) return data.symbolInfo.last;
        if (typeof data.symbolInfo.close === 'number' && isValidPrice(data.symbolInfo.close)) return data.symbolInfo.close;
        if (typeof data.symbolInfo.lp === 'number' && isValidPrice(data.symbolInfo.lp)) return data.symbolInfo.lp;
      }
      
      // Try to extract from "d" property which is often used in TradingView messages
      if (data.d) {
        if (typeof data.d.price === 'number' && isValidPrice(data.d.price)) return data.d.price;
        if (typeof data.d.last === 'number' && isValidPrice(data.d.last)) return data.d.last;
        if (typeof data.d.close === 'number' && isValidPrice(data.d.close)) return data.d.close;
        if (typeof data.d.lp === 'number' && isValidPrice(data.d.lp)) return data.d.lp;
      }
      
      // Handle crosshair price data
      if (data.name === 'crosshair') {
        if (typeof data.price === 'number' && isValidPrice(data.price)) return data.price;
        if (data.price && typeof data.price === 'string') {
          const price = parseFloat(data.price);
          if (isValidPrice(price)) return price;
        }
      }
      
      // Special handling for "study-event" messages
      if (data.name === 'study-event' && data.data) {
        if (typeof data.data.value === 'number' && isValidPrice(data.data.value)) return data.data.value;
        if (data.data.value && typeof data.data.value === 'string') {
          const value = parseFloat(data.data.value);
          if (isValidPrice(value)) return value;
        }
      }
      
      // Special handling for "price" field that might be a string
      if (data.price && typeof data.price === 'string') {
        const price = parseFloat(data.price);
        if (isValidPrice(price)) return price;
      }

      // Handle "ohlc" format
      if (data.ohlc && typeof data.ohlc.close === 'number' && isValidPrice(data.ohlc.close)) {
        return data.ohlc.close;
      }
      
      // Try to extract from "content" if it exists
      if (data.content && typeof data.content === 'object') {
        const contentPrice = extractPriceFromMessage(data.content);
        if (contentPrice !== null) return contentPrice;
      }
      
      // Check for quotes format
      if (data.quotes && Array.isArray(data.quotes) && data.quotes.length > 0) {
        const quote = data.quotes[0];
        if (typeof quote.price === 'number' && isValidPrice(quote.price)) return quote.price;
        if (typeof quote.lp === 'number' && isValidPrice(quote.lp)) return quote.lp;
        if (typeof quote.last === 'number' && isValidPrice(quote.last)) return quote.last;
      }
      
      // Try to find price in any property that's a number
      for (const key in data) {
        if (
          typeof data[key] === 'number' && 
          isValidPrice(data[key]) && 
          (key.includes('price') || key.includes('value') || key === 'lp' || key === 'last')
        ) {
          return data[key];
        }
      }
    }
    
    // Handle string that could be parsed as number
    if (typeof data === 'string') {
      // Remove any non-numeric characters except dots
      const numericStr = data.replace(/[^\d.]/g, '');
      const parsed = parseFloat(numericStr);
      if (isValidPrice(parsed)) return parsed;
    }
    
    // Handle direct number
    if (typeof data === 'number' && isValidPrice(data)) {
      return data;
    }
  } catch (error) {
    console.error('Error extracting price from message:', error);
  }
  
  return null;
};

// Enhanced function to extract symbol from TradingView message
export const extractSymbolFromMessage = (data: any): string | null => {
  if (!data) return null;
  
  try {
    console.log('Attempting to extract symbol from:', typeof data === 'object' ? JSON.stringify(data) : data);
    
    if (typeof data === 'object') {
      // Check for direct symbol change events
      if (data.name === 'symbol-change' && data.symbol) {
        return data.symbol;
      }
      
      // Check for specific symbol change events in TradingView messages
      if ((data.type === 'symbol_changed' || data.type === 'symbol-changed') && data.data) {
        return data.data.symbol || data.data.name;
      }
      
      // Symbol field directly in the object
      if (data.symbol && typeof data.symbol === 'string') {
        return data.symbol;
      }
      
      // Check for symbol in "m" field which is often used in TradingView messages
      if (data.m === 'symbol_resolved' && data.p) {
        return data.p[0] || data.p.symbol || data.p.name;
      }
      
      // Nested in symbolInfo
      if (data.symbolInfo) {
        if (data.symbolInfo.name) return data.symbolInfo.name;
        if (data.symbolInfo.symbol) return data.symbolInfo.symbol;
        if (data.symbolInfo.ticker) return data.symbolInfo.ticker;
      }
      
      // Check for ticker field
      if (data.ticker && typeof data.ticker === 'string') {
        return data.ticker;
      }
      
      // Handle "search-symbol" message type
      if (data.name === 'search-symbol' && data.searchedSymbol) {
        return data.searchedSymbol;
      }
      
      // Check in "d" property
      if (data.d) {
        if (data.d.symbol) return data.d.symbol;
        if (data.d.name) return data.d.name;
        if (data.d.ticker) return data.d.ticker;
      }

      // Try to extract from "content" if it exists
      if (data.content && typeof data.content === 'object') {
        const contentSymbol = extractSymbolFromMessage(data.content);
        if (contentSymbol) return contentSymbol;
      }
      
      // Try stock specific formats
      if (data.stock) {
        if (data.stock.symbol) return data.stock.symbol;
        if (data.stock.ticker) return data.stock.ticker;
        if (data.stock.name) return data.stock.name;
      }
      
      // Try standard "name" field if it looks like a symbol (all caps, likely to be a ticker)
      if (data.name && typeof data.name === 'string' && /^[A-Z0-9.:]+$/.test(data.name)) {
        return data.name;
      }
      
      // Try to find symbol in any property that's a string and might be a symbol
      for (const key in data) {
        if (
          typeof data[key] === 'string' && 
          (key.includes('symbol') || key.includes('ticker') || key === 'instrumentName') &&
          /^[A-Za-z0-9.:]+$/.test(data[key])
        ) {
          return data[key];
        }
      }
    }
    
    // If data itself is a string that looks like a symbol
    if (typeof data === 'string' && /^[A-Za-z0-9.:]+$/.test(data)) {
      return data;
    }
  } catch (error) {
    console.error('Error extracting symbol from message:', error);
  }
  
  return null;
};
