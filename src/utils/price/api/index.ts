
import { getSymbolType } from "./helpers";
import { 
  fetchCryptoPrice, 
  fetchForexPrice, 
  fetchPreciousMetalPrice, 
  getCachedPrice, 
  setCachedPrice,
  fetchPriceFromMetalPriceApi
} from "./fetchers";
import { checkRateLimit, setRateLimited } from "./rateLimit";

/**
 * واجهة موحدة لجلب السعر حسب نوع الرمز
 */
export const fetchPrice = async (symbol: string): Promise<number | null> => {
  if (!symbol) {
    console.error("تم تمرير رمز فارغ إلى fetchPrice");
    return null;
  }
  
  try {
    const symbolType = getSymbolType(symbol);
    
    switch (symbolType) {
      case 'precious_metal':
        return await fetchPreciousMetalPrice(symbol);
      case 'forex':
        return await fetchForexPrice(symbol);
      case 'crypto':
        return await fetchCryptoPrice(symbol);
      default:
        // محاولة فوركس كافتراضي
        const forexPrice = await fetchForexPrice(symbol);
        if (forexPrice !== null) return forexPrice;
        
        // محاولة عملة رقمية كخطة بديلة
        return await fetchCryptoPrice(symbol);
    }
  } catch (error) {
    console.error(`خطأ في fetchPrice للرمز ${symbol}:`, error);
    return null;
  }
};

// تصدير الدوال الأساسية
export {
  fetchCryptoPrice,
  fetchForexPrice,
  fetchPreciousMetalPrice,
  fetchPriceFromMetalPriceApi,
  getSymbolType,
  getCachedPrice,
  setCachedPrice,
  checkRateLimit,
  setRateLimited
};

// تصدير أنواع البيانات
export * from "./types";
