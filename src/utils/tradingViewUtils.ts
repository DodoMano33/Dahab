import { priceUpdater } from './price/priceUpdater';

export const getTradingViewChartImage = async (
  symbol: string,
  timeframe: string,
  providedPrice?: number
): Promise<string> => {
  console.log("محاولة جلب صورة الشارت:", { symbol, timeframe });
  
  try {
    // محاولة جلب السعر مع استخدام السعر المقدم من المستخدم كاحتياطي
    const price = await priceUpdater.fetchPrice(symbol, providedPrice);
    console.log("تم جلب السعر:", price);

    // في هذه المرحلة نقوم بإرجاع صورة وهمية للتجربة
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  } catch (error) {
    console.error("خطأ في جلب السعر:", error);
    
    // إذا كان هناك سعر مقدم من المستخدم، نستمر في التحليل باستخدامه
    if (providedPrice !== undefined) {
      console.log("استخدام السعر المقدم من المستخدم للتحليل:", providedPrice);
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    }
    
    throw error;
  }
};