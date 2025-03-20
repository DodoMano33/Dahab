
import { SubscriptionService } from './subscriptions';

export class PollingService {
  private polling: boolean = false;
  private intervalId?: NodeJS.Timeout;
  private readonly pollingInterval: number;
  
  constructor(
    private subscriptions: SubscriptionService,
    private fetchPriceForSymbol: (symbol: string) => Promise<number | null>,
    pollingInterval: number = 300000
  ) {
    this.pollingInterval = pollingInterval;
  }

  /**
   * بدء التحديث الدوري للأسعار
   */
  start(): void {
    if (this.polling) return;
    
    console.log("بدء التحديث الدوري للأسعار من Metal Price API");
    this.polling = true;
    
    this.intervalId = setInterval(async () => {
      const symbols = this.subscriptions.getSubscribedSymbols();
      for (const symbol of symbols) {
        try {
          const price = await this.fetchPriceForSymbol(symbol);
          if (price !== null) {
            this.subscriptions.notifySubscribers(symbol, price);
          } else {
            this.subscriptions.notifyError(
              symbol, 
              new Error(`لم يتم العثور على سعر للرمز ${symbol}`)
            );
          }
        } catch (error) {
          console.error(`خطأ في تحديث السعر للرمز ${symbol}:`, error);
          this.subscriptions.notifyError(symbol, error as Error);
        }
      }
    }, this.pollingInterval);
  }
  
  /**
   * إيقاف التحديث الدوري للأسعار
   */
  stop(): void {
    if (!this.polling) return;
    
    console.log("إيقاف التحديث الدوري للأسعار");
    this.polling = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
  
  /**
   * التحقق مما إذا كان التحديث الدوري قيد التشغيل
   */
  isPolling(): boolean {
    return this.polling;
  }
}
