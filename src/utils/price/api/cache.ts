
import { CacheInfo } from "./types";

// ذاكرة التخزين المؤقت للأسعار
const priceCache: Record<string, CacheInfo> = {};
const CACHE_LIFETIME = 60 * 1000; // 1 دقيقة

/**
 * التحقق من الذاكرة المؤقتة والحصول على السعر المخزن إذا كان صالحًا
 */
export const getCachedPrice = (cacheKey: string): number | null => {
  const cachedData = priceCache[cacheKey];
  if (!cachedData) return null;
  
  const now = Date.now();
  if (now - cachedData.timestamp > CACHE_LIFETIME) return null;
  
  console.log(`استخدام السعر المخزن مؤقتًا للمفتاح ${cacheKey}: ${cachedData.price}`);
  return cachedData.price;
};

/**
 * تخزين السعر في الذاكرة المؤقتة
 */
export const setCachedPrice = (cacheKey: string, price: number): void => {
  priceCache[cacheKey] = {
    price,
    timestamp: Date.now()
  };
};
