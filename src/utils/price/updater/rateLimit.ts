
export class RateLimitManager {
  private rateLimitHit: boolean = false;
  private lastRateLimitTime: number = 0;
  private readonly rateLimitResetTime: number;

  constructor(rateLimitResetTime: number = 24 * 60 * 60 * 1000) {
    this.rateLimitResetTime = rateLimitResetTime;
  }

  /**
   * التحقق مما إذا تم تجاوز حد معدل الاستخدام
   */
  isRateLimited(): boolean {
    if (!this.rateLimitHit) return false;
    
    const now = Date.now();
    const timeSinceLimit = now - this.lastRateLimitTime;
    
    if (timeSinceLimit >= this.rateLimitResetTime) {
      this.rateLimitHit = false;
      return false;
    }
    
    return true;
  }

  /**
   * تعيين حالة تجاوز حد معدل الاستخدام
   */
  setRateLimited(limited: boolean): void {
    this.rateLimitHit = limited;
    if (limited) {
      this.lastRateLimitTime = Date.now();
    }
  }

  /**
   * إعادة تعيين حالة تجاوز حد معدل الاستخدام
   */
  reset(): void {
    this.rateLimitHit = false;
    this.lastRateLimitTime = 0;
  }
}
