
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
    // تحديث نطاق سعر الذهب المتوقع ليكون بين 2000-4000
    const EXPECTED_MIN_PRICE = 2000;
    const EXPECTED_MAX_PRICE = 4000;
    
    // محددات CSS محسنة للبحث عن عناصر السعر في TradingView
    const priceSelectors = [
      // محددات جديدة أكثر دقة
      '.tv-symbol-price-quote__value',
      '.tv-ticker-tape-price__value',
      '.chart-markup-table.pane-legend-line.main-serie .tv-symbol-price-quote__value',
      '.tv-symbol-header__first-line .tv-symbol-price-quote__value',
      '.apply-overflow-tooltip.apply-common-tooltip',
      '[data-name="legend-source-item"] .tv-symbol-price-quote__value',
      '.tv-ticker__item--last .tv-ticker__field--last-value',
      '.tradingview-widget-container strong',
      'span[data-field="last"]',
      '.price-value', 
      '[data-name="legend-series-item"] [data-name="legend-value-item"]',
      // محددات عامة للعناصر البارزة
      'h1', 'h2', 'h3', '.price', 'strong', 'b', '.value'
    ];

    console.log('بدء البحث عن السعر في عناصر الصفحة');
    
    // محاولة استخراج الأرقام من العناصر التي تحتوي على نصوص مثل "3,026.58"
    for (const selector of priceSelectors) {
      const elements = document.querySelectorAll(selector);
      console.log(`البحث باستخدام المحدد '${selector}'، تم العثور على ${elements.length} عنصر`);

      if (elements && elements.length > 0) {
        for (const element of elements) {
          const priceText = element.textContent;
          if (priceText) {
            console.log(`النص المستخرج: "${priceText}"`);
            
            // البحث عن أنماط سعر الذهب بطريقة محسنة
            // 1. البحث عن نمط مثل "3,026.58"
            const threeKPattern = /\b3[,.]?\d{3}([.,]\d{1,3})?\b/;
            const threeKMatch = priceText.match(threeKPattern);
            
            if (threeKMatch) {
              const cleanPrice = threeKMatch[0].replace(/,/g, '');
              const price = parseFloat(cleanPrice);
              
              if (!isNaN(price) && price > EXPECTED_MIN_PRICE && price < EXPECTED_MAX_PRICE) {
                console.log(`تم استخراج سعر الذهب: ${price} من نمط 3000+`);
                return price;
              }
            }
            
            // 2. تجربة أي أرقام في النص
            const cleanText = priceText.trim().replace(/[^\d.,]/g, '');
            if (cleanText.match(/\d+([.,]\d+)?/)) {
              const normalizedText = cleanText.replace(/,/g, '.');
              const price = parseFloat(normalizedText);
              
              if (!isNaN(price) && price > 0) {
                // التحقق من أن السعر في نطاق معقول للذهب
                if (price > EXPECTED_MIN_PRICE && price < EXPECTED_MAX_PRICE) {
                  console.log(`تم استخراج سعر الذهب: ${price} من المحدد ${selector}`);
                  return price;
                } else if (price > 3 && price < 5) {
                  // قد يكون بالآلاف (مثل 3.02 بدلاً من 3020)
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

    // البحث في الصفحة كاملة عن أرقام تبدأ بـ 3 (لتغطية نطاق 3000)
    const allText = document.body.innerText;
    const threeKPattern = /\b3[,.]?\d{3}([.,]\d{1,3})?\b/g;
    const threeKMatches = allText.match(threeKPattern);
    
    if (threeKMatches && threeKMatches.length > 0) {
      for (const match of threeKMatches) {
        const cleanMatch = match.replace(/,/g, '');
        const price = parseFloat(cleanMatch);
        
        if (!isNaN(price) && price > EXPECTED_MIN_PRICE && price < EXPECTED_MAX_PRICE) {
          console.log(`تم استخراج سعر من نص الصفحة (نمط 3000+): ${price}`);
          return price;
        }
      }
    }

    // محاولة بديلة - البحث عن iframe وقراءة محتواه
    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const iframeText = iframeDoc.body.innerText;
          const matches = iframeText.match(/\b3[,.]?\d{3}([.,]\d{1,3})?\b/g);
          
          if (matches && matches.length > 0) {
            for (const match of matches) {
              const price = parseFloat(match.replace(/,/g, ''));
              if (!isNaN(price) && price > EXPECTED_MIN_PRICE && price < EXPECTED_MAX_PRICE) {
                console.log(`تم استخراج سعر من iframe: ${price}`);
                return price;
              }
            }
          }
        }
      } catch (e) {
        console.warn("خطأ في الوصول إلى محتوى iframe:", e);
      }
    }

    // إضافة تأخير وإعادة محاولة استخراج السعر من أي محتوى ديناميكي
    return new Promise((resolve) => {
      setTimeout(async () => {
        // محاولة استخدام طريقة البديلة
        const price = await extractPriceFromTradingView();
        console.log("نتيجة المحاولة بعد التأخير:", price);
        resolve(price);
      }, 1000);
    });
  } catch (error) {
    console.error("فشل في استخراج السعر من الرسم البياني:", error);
    return null;
  }
};
