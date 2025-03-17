
/**
 * وظائف مساعدة للتعامل مع مخططات TradingView
 */

/**
 * التقاط صورة من مخطط TradingView
 * @param symbol الرمز المالي
 * @param timeframe الإطار الزمني
 * @param currentPrice السعر الحالي
 * @returns وعد يحتوي على صورة بتنسيق base64
 */
export const getTradingViewChartImage = async (
  symbol: string,
  timeframe: string,
  currentPrice: number
): Promise<string> => {
  console.log("جاري التقاط صورة للرسم البياني:", { symbol, timeframe, currentPrice });
  
  try {
    // محاولة الحصول على عنصر مخطط TradingView
    const chartElement = document.getElementById('tradingview_chart');
    
    if (!chartElement) {
      console.error("لم يتم العثور على عنصر مخطط TradingView");
      throw new Error("لم يتم العثور على عنصر المخطط");
    }
    
    // استخدام html2canvas للتقاط صورة للعنصر
    // نستخدم import ديناميكي لتحميل المكتبة عند الحاجة
    const html2canvas = await import('html2canvas').then(module => module.default);
    
    const canvas = await html2canvas(chartElement);
    const imageData = canvas.toDataURL('image/png');
    
    console.log("تم التقاط صورة الرسم البياني بنجاح");
    return imageData;
    
  } catch (error) {
    console.error("فشل في التقاط صورة الرسم البياني:", error);
    
    // إذا فشلت العملية، نعيد صورة فارغة 1×1 بيكسل
    // هذا يمنع تعطل التطبيق وإعطاء فرصة للتعافي
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = 1;
    fallbackCanvas.height = 1;
    
    // إضافة بيانات بسيطة للسعر كسطر نص
    const ctx = fallbackCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 1, 1);
      ctx.font = '10px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(`${symbol}: ${currentPrice}`, 5, 15);
    }
    
    return fallbackCanvas.toDataURL('image/png');
  }
};

/**
 * استخراج السعر الحالي من مخطط TradingView
 * @returns وعد يحتوي على السعر الحالي أو null في حالة الفشل
 */
export const extractPriceFromTradingView = async (): Promise<number | null> => {
  try {
    // محاولة الوصول إلى كائن TradingView العالمي
    if (window.TradingView && window.TradingView.widget) {
      const chart = document.querySelector('[id^="tradingview_"]');
      if (!chart) {
        console.error("لم يتم العثور على عنصر مخطط TradingView");
        return null;
      }
      
      // البحث عن عنصر السعر داخل المخطط
      const priceElements = chart.querySelectorAll('.pane-legend-line > .pane-legend-item-value');
      
      if (priceElements && priceElements.length > 0) {
        // السعر عادة في أول عنصر
        const priceText = priceElements[0].textContent;
        if (priceText) {
          // تنظيف النص واستخراج الرقم
          const price = parseFloat(priceText.replace(/[^\d.-]/g, ''));
          if (!isNaN(price)) {
            console.log("تم استخراج السعر من TradingView:", price);
            return price;
          }
        }
      }
      
      console.warn("لم يتم العثور على عنصر السعر في مخطط TradingView");
    } else {
      console.warn("لم يتم تحميل كائن TradingView بعد");
    }
    
    return null;
  } catch (error) {
    console.error("خطأ أثناء استخراج السعر من TradingView:", error);
    return null;
  }
};
