import { toast } from "sonner";

const TRADING_VIEW_BASE_URL = "https://www.tradingview.com/chart/";

export const getTradingViewChartImage = async (symbol: string, timeframe: string): Promise<string> => {
  console.log("محاولة جلب صورة الشارت:", { symbol, timeframe });
  
  try {
    // التحقق من صحة المدخلات
    if (!symbol || !timeframe) {
      throw new Error("يجب تحديد الرمز والإطار الزمني");
    }

    // بناء رابط TradingView
    const chartUrl = `${TRADING_VIEW_BASE_URL}?symbol=${symbol.toUpperCase()}&interval=${timeframe}`;
    
    // في بيئة الإنتاج، هنا سنقوم باستدعاء API الخاص بنا للحصول على لقطة شاشة
    // يمكن استخدام خدمات مثل Puppeteer أو Selenium على الخادم
    const response = await fetch('/api/screenshot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: chartUrl,
        timeframe: timeframe,
        symbol: symbol
      })
    });

    if (!response.ok) {
      throw new Error(`فشل في تحميل الصورة: ${response.statusText}`);
    }

    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);
    
    console.log("تم جلب صورة الشارت بنجاح:", imageUrl);
    return imageUrl;
    
  } catch (error) {
    console.error("خطأ في جلب صورة الشارت:", error);
    toast.error("فشل في تحميل صورة الشارت");
    throw error;
  }
};