
import { CachedPrice } from '../types';

export class PriceCache {
  private cache: Record<string, CachedPrice> = {};
  private readonly cacheLifetime: number;

  constructor(cacheLifetime: number = 60 * 1000) {
    this.cacheLifetime = cacheLifetime;
  }

  /**
   * الحصول على السعر المخزن مؤقتًا
   */
  get(symbol: string): number | null {
    const cachedData = this.cache[symbol];
    if (!cachedData) return null;
    
    const now = Date.now();
    if (now - cachedData.timestamp > this.cacheLifetime) return null;
    
    console.log(`استخدام السعر المخزن مؤقتًا للرمز ${symbol}: ${cachedData.price}`);
    return cachedData.price;
  }
  
  /**
   * تخزين السعر في الذاكرة المؤقتة
   */
  set(symbol: string, price: number): void {
    this.cache[symbol] = {
      price,
      timestamp: Date.now()
    };
  }
  
  /**
   * التحقق من وجود قيمة صالحة في الذاكرة المؤقتة
   */
  isValid(symbol: string): boolean {
    const cached = this.cache[symbol];
    if (!cached) return false;
    
    return (Date.now() - cached.timestamp) <= this.cacheLifetime;
  }
  
  /**
   * مسح الذاكرة المؤقتة للرمز المحدد
   */
  invalidate(symbol: string): void {
    if (this.cache[symbol]) {
      delete this.cache[symbol];
    }
  }
  
  /**
   * مسح كامل الذاكرة المؤقتة
   */
  clear(): void {
    this.cache = {};
  }
}
