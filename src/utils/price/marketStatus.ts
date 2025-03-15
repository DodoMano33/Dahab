
// خدمة مراقبة حالة السوق

import { MarketStatus } from './types';

/**
 * فئة إدارة حالة السوق (مفتوح/مغلق)
 */
export class MarketStatusService {
  private static instance: MarketStatusService;
  private lastCheckTime: number = 0;
  private status: MarketStatus = { isOpen: true, lastUpdated: 0 };
  private readonly CHECK_INTERVAL: number = 5 * 60 * 1000; // 5 دقائق
  
  private constructor() {
    // في بيئة التطوير، نفترض أن السوق مفتوح دائمًا
    this.status = { isOpen: true, lastUpdated: Date.now() };
  }
  
  /**
   * الحصول على نسخة واحدة من خدمة حالة السوق
   */
  public static getInstance(): MarketStatusService {
    if (!MarketStatusService.instance) {
      MarketStatusService.instance = new MarketStatusService();
    }
    return MarketStatusService.instance;
  }
  
  /**
   * التحقق من حالة السوق
   */
  public async checkMarketStatus(): Promise<boolean> {
    try {
      const now = Date.now();
      
      // التحقق من حالة السوق مرة كل 5 دقائق فقط
      if (now - this.lastCheckTime < this.CHECK_INTERVAL) {
        return this.status.isOpen;
      }
      
      this.lastCheckTime = now;
      
      // في بيئة التطوير، نفترض أن السوق مفتوح دائمًا
      this.status = { isOpen: true, lastUpdated: now };
      
      console.log('حالة السوق:', this.status.isOpen ? 'مفتوح' : 'مغلق');
      return this.status.isOpen;
    } catch (error) {
      console.error('خطأ في التحقق من حالة السوق:', error);
      // نضع حالة السوق كمفتوح في بيئة التطوير
      this.status = { isOpen: true, lastUpdated: Date.now() };
      return true;
    }
  }
  
  /**
   * الحصول على حالة السوق الحالية
   */
  public isMarketOpen(): boolean {
    return this.status.isOpen;
  }
  
  /**
   * الحصول على وقت آخر تحديث لحالة السوق
   */
  public getLastUpdateTime(): number {
    return this.status.lastUpdated;
  }
}

// تصدير نسخة واحدة من خدمة حالة السوق
export const marketStatusService = MarketStatusService.getInstance();
