
// API URL and Key
const API_URL = 'https://api.metalpriceapi.com/v1';
const API_KEY = '42ed2fe2e7d1d8f688ddeb027219c766';

// Cache to avoid rate limits
const priceCache: Record<string, { price: number, timestamp: number }> = {};
const CACHE_TTL = 60 * 1000; // 1 minute cache

/**
 * Map symbol to Metal Price API format
 */
function mapSymbolToMetalPriceFormat(symbol: string): { base: string, target: string } {
  // Clean up the symbol
  const cleanSymbol = symbol.replace('CAPITALCOM:', '').toUpperCase();
  
  // Special mappings
  if (cleanSymbol === 'XAUUSD' || cleanSymbol === 'GOLD') {
    return { base: 'USD', target: 'XAU' };
  }
  if (cleanSymbol === 'XAGUSD' || cleanSymbol === 'SILVER') {
    return { base: 'USD', target: 'XAG' };
  }
  
  // For forex pairs (like EURUSD)
  if (cleanSymbol.length === 6 && /[A-Z]{6}/.test(cleanSymbol)) {
    return { 
      base: 'USD',
      target: cleanSymbol.substring(0, 3)
    };
  }
  
  // Default case
  return { base: 'USD', target: cleanSymbol };
}

/**
 * Fetch price from Metal Price API
 */
export async function fetchPriceFromMetalPriceApi(symbol: string): Promise<number | null> {
  try {
    // Check cache first
    const cacheKey = symbol.toUpperCase();
    const cachedData = priceCache[cacheKey];
    
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_TTL) {
      console.log(`Using cached price for ${symbol}: ${cachedData.price}`);
      return cachedData.price;
    }
    
    // Map the symbol to the format required by the API
    const { base, target } = mapSymbolToMetalPriceFormat(symbol);
    console.log(`Fetching price for ${symbol} as ${base}/${target} from Metal Price API`);
    
    // Build request URL
    const url = `${API_URL}/latest?api_key=${API_KEY}&base=${base}&currencies=${target}`;
    
    // Fetch data from API
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`API error: ${data.error || 'Unknown error'}`);
    }
    
    // Extract rate from response and calculate proper price
    const rate = data.rates[target];
    if (rate === undefined) {
      throw new Error(`No rate found for ${target}`);
    }
    
    // For XAU/USD and similar, we need to invert the rate (API returns USD/XAU)
    const price = 1 / rate;
    
    // Cache the result
    priceCache[cacheKey] = { price, timestamp: Date.now() };
    
    console.log(`Fetched price for ${symbol}: ${price}`);
    return price;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}
