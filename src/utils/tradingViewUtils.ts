
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
    const chartElement = document.querySelector('.tradingview-widget-container');
    
    if (!chartElement) {
      console.error("لم يتم العثور على عنصر ويدجت TradingView");
      throw new Error("لم يتم العثور على عنصر الويدجت");
    }
    
    // استخدام html2canvas للتقاط صورة للعنصر
    // نستخدم import ديناميكي لتحميل المكتبة عند الحاجة
    const html2canvas = await import('html2canvas').then(module => module.default);
    
    const canvas = await html2canvas(chartElement as HTMLElement);
    const imageData = canvas.toDataURL('image/png');
    
    console.log("تم التقاط صورة الرسم البياني بنجاح");
    return imageData;
    
  } catch (error) {
    console.error("فشل في التقاط صورة الرسم البياني:", error);
    
    // إذا فشلت العملية، نعيد صورة فارغة 1×1 بيكسل
    // هذا يمنع تعطل التطبيق وإعطاء فرصة للتعافي
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = 300;
    fallbackCanvas.height = 150;
    
    // إضافة بيانات بسيطة للسعر كسطر نص
    const ctx = fallbackCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 300, 150);
      ctx.font = '20px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(`${symbol}: ${currentPrice}`, 150, 75);
    }
    
    return fallbackCanvas.toDataURL('image/png');
  }
};

/**
 * استخراج السعر الحالي من ويدجت TradingView
 * @returns وعد يحتوي على السعر الحالي أو null في حالة الفشل
 */
export const extractPriceFromTradingView = async (): Promise<number | null> => {
  try {
    console.log("تم العثور على ويدجيت TradingView:", document.querySelector('.tradingview-widget-container'));
    
    // المحددات المحسنة للبحث عن عناصر السعر
    const priceSelectors = [
      '.tv-ticker-tape-price__value',
      '.chart-markup-table.pane-legend-line.main-serie .tv-symbol-price-quote__value',
      '.tv-symbol-header__first-line .tv-symbol-price-quote__value',
      '.tv-symbol-price-quote__value',
      '.apply-overflow-tooltip.apply-common-tooltip',
      '[data-name="legend-source-item"] .tv-symbol-price-quote__value',
      '.tv-ticker__item--last .tv-ticker__field--last-value',
      '.tradingview-widget-container strong'
    ];

    // البحث عن جميع العناصر في الصفحة التي قد تحتوي على السعر
    for (const selector of priceSelectors) {
      const elements = document.querySelectorAll(selector);
      console.log(`البحث عن السعر باستخدام المحدد '${selector}'، عدد العناصر: ${elements.length}`);
      
      if (elements && elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          const priceText = elements[i].textContent;
          if (priceText) {
            // تنظيف أفضل للنص
            console.log(`النص المستخرج: "${priceText}"`);
            const cleanText = priceText.trim().replace(/[^\d.,]/g, '');
            
            if (cleanText.match(/\d+([.,]\d+)?/)) {
              const normalizedText = cleanText.replace(/,/g, '.');
              const price = parseFloat(normalizedText);
              
              if (!isNaN(price) && price > 0) {
                // التحقق من أن السعر في نطاق معقول للذهب (500-5000)
                if (price > 500 && price < 5000) {
                  console.log(`تم استخراج سعر الذهب: ${price} من المحدد ${selector}`);
                  return price;
                } else if (price > 0.5 && price < 5) {
                  // قد يكون بالآلاف (مثل 2.02 بدلاً من 2020)
                  const adjustedPrice = price * 1000;
                  console.log(`تم تعديل السعر من ${price} إلى ${adjustedPrice}`);
                  return adjustedPrice;
                }
              }
            }
          }
        }
      }
    }
    
    // محاولة البحث عن أي نص يحتوي على أرقام قد تكون السعر
    const allElements = document.querySelectorAll('*');
    const goldKeywords = ['gold', 'xau', 'ذهب', 'XAUUSD'];
    
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i] as HTMLElement;
      if (element.textContent) {
        const text = element.textContent.trim();
        
        // البحث عن نص يحتوي على كلمة ذهب وأرقام
        const containsGoldKeyword = goldKeywords.some(keyword => 
          text.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (containsGoldKeyword && /\d+([.,]\d+)?/.test(text)) {
          console.log(`وجدنا نصًا قد يحتوي على السعر: ${text}`);
          
          // استخراج الأرقام من النص
          const matches = text.match(/(\d{1,4})[.,](\d{1,3})/);
          if (matches) {
            const price = parseFloat(matches[1] + '.' + matches[2]);
            if (!isNaN(price) && price > 500 && price < 5000) {
              console.log(`تم استخراج سعر محتمل: ${price}`);
              return price;
            }
          }
        }
      }
    }
    
    // إذا وصلنا إلى هنا، لم نجد السعر
    console.warn("لم يتم العثور على عنصر السعر في ويدجت TradingView");
    
    // محاولة أخيرة - البحث عن أي رقم ضمن مدى أسعار الذهب المعقولة
    const allText = document.body.textContent || '';
    const priceMatches = allText.match(/\b(\d{1,4})[.,](\d{1,3})\b/g);
    
    if (priceMatches) {
      for (const match of priceMatches) {
        const price = parseFloat(match.replace(/,/g, '.'));
        if (!isNaN(price) && price > 1000 && price < 3000) {
          console.log(`تم استخراج سعر محتمل من نص الصفحة: ${price}`);
          return price;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("خطأ أثناء استخراج السعر من TradingView:", error);
    return null;
  }
};
