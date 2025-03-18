
/**
 * استخراج السعر من الرسم البياني
 */
import { extractPriceFromTradingView } from "@/utils/tradingViewUtils";

/**
 * استخراج السعر الحالي من الرسم البياني
 * @returns وعد يحتوي على السعر الحالي أو null في حالة الفشل
 */
export const extractPriceFromChart = async (): Promise<number | null> => {
  try {
    // تحسين محددات CSS للبحث عن عناصر السعر في TradingView مع تغطية جميع التنسيقات المحتملة
    const priceSelectors = [
      // محددات قوية لعنصر السعر الرئيسي في TradingView
      '.tv-ticker-tape-price__value',
      '.chart-markup-table.pane-legend-line.main-serie .tv-symbol-price-quote__value',
      '.tv-symbol-header__first-line .tv-symbol-price-quote__value',
      '.tv-symbol-price-quote__value',
      '.apply-overflow-tooltip.apply-common-tooltip',
      '[data-name="legend-source-item"] .tv-symbol-price-quote__value',
      '.tv-ticker__item--last .tv-ticker__field--last-value',
      '.tradingview-widget-container strong',
      // عام أكثر للقيم العددية المبرزة
      '.price-value', 
      '[data-name="legend-series-item"] [data-name="legend-value-item"]'
    ];

    // محاولة كل محدد للبحث عن عنصر السعر
    for (const selector of priceSelectors) {
      const elements = document.querySelectorAll(selector);
      console.log(`البحث باستخدام المحدد '${selector}'، تم العثور على ${elements.length} عنصر`);

      if (elements && elements.length > 0) {
        for (const element of elements) {
          const priceText = element.textContent;
          if (priceText) {
            // تنظيف أفضل للنص
            const cleanText = priceText.trim().replace(/[^\d.,]/g, '');
            console.log(`النص المستخرج: "${priceText}"، بعد التنظيف: "${cleanText}"`);
            
            // التحقق من صحة التنسيق - يجب أن يحتوي على أرقام وفاصلة/نقطة عشرية
            if (cleanText.match(/\d+([.,]\d+)?/)) {
              // معالجة التنسيق بشكل أفضل
              const normalizedText = cleanText.replace(/,/g, '.');
              const price = parseFloat(normalizedText);
              
              if (!isNaN(price) && price > 0) {
                // التحقق من أن السعر في نطاق معقول للذهب (500-5000)
                if (price > 500 && price < 5000) {
                  console.log(`تم استخراج سعر الذهب بنجاح: ${price} من المحدد ${selector}`);
                  return price;
                } else if (price > 0.5 && price < 5) {
                  // قد يكون بالآلاف (مثل 2.02 بدلاً من 2020)
                  const adjustedPrice = price * 1000;
                  console.log(`تم تعديل السعر من ${price} إلى ${adjustedPrice}`);
                  return adjustedPrice;
                } else {
                  console.log(`تم استخراج سعر لكنه خارج النطاق المتوقع: ${price}`);
                }
              }
            }
          }
        }
      }
    }

    // البحث عن السعر في iframe إذا كان موجودًا
    const iframes = document.querySelectorAll('iframe');
    if (iframes.length > 0) {
      for (const iframe of iframes) {
        try {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDocument) {
            for (const selector of priceSelectors) {
              const elements = iframeDocument.querySelectorAll(selector);
              if (elements && elements.length > 0) {
                for (const element of elements) {
                  const priceText = element.textContent;
                  if (priceText) {
                    const cleanText = priceText.trim().replace(/[^\d.,]/g, '');
                    if (cleanText.match(/\d+([.,]\d+)?/)) {
                      const normalizedText = cleanText.replace(/,/g, '.');
                      const price = parseFloat(normalizedText);
                      
                      if (!isNaN(price) && price > 0) {
                        if (price > 500 && price < 5000) {
                          console.log(`تم استخراج السعر من iframe: ${price}`);
                          return price;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (e) {
          console.log("خطأ في الوصول إلى محتوى iframe:", e);
        }
      }
    }

    // إضافة تأخير وإعادة محاولة استخراج السعر من أي محتوى ديناميكي قد يكون تم تحميله
    return new Promise((resolve) => {
      setTimeout(async () => {
        // محاولة استخدام طريقة البديلة
        const price = await extractPriceFromTradingView();
        console.log("نتيجة المحاولة بعد التأخير:", price);
        resolve(price);
      }, 1000); // تأخير لمدة ثانية واحدة
    });
  } catch (error) {
    console.error("فشل في استخراج السعر من الرسم البياني:", error);
    return null;
  }
};
