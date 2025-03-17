
import React, { useEffect, useRef } from 'react';

interface TradingViewContainerProps {
  onPriceUpdate?: (price: number) => void;
}

export const TradingViewContainer: React.FC<TradingViewContainerProps> = ({
  onPriceUpdate
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // تهيئة الويدجيت عند تحميل المكون
  useEffect(() => {
    if (!containerRef.current) return;
    
    console.log('إنشاء ويدجيت TradingView Single Quote للذهب');
    
    // تنظيف الحاوية من أي محتوى سابق
    containerRef.current.innerHTML = '';
    
    // إنشاء حاوية للويدجيت
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.width = '100%';
    widgetContainer.style.height = '100%';
    
    // إنشاء سكريبت لتحميل ويدجيت TradingView Single Quote
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
    script.async = true;
    
    // إعدادات الويدجيت - تغيير لتطابق الصورة
    script.innerHTML = JSON.stringify({
      "symbol": "CFI:XAUUSD",
      "width": "100%",
      "colorTheme": "dark",
      "isTransparent": false,
      "locale": "ar"
    });
    
    // إضافة السكريبت إلى الحاوية
    widgetContainer.appendChild(script);
    
    // إضافة الحاوية إلى العنصر الأصلي
    containerRef.current.appendChild(widgetContainer);
    
    // استمع إلى تحديثات السعر وابحث عنها دورياً
    const priceCheckInterval = setInterval(() => {
      try {
        // البحث عن عنصر السعر الرئيسي
        const priceElement = document.querySelector('.tv-symbol-price-quote__value');
        if (priceElement) {
          const priceText = priceElement.textContent?.trim();
          if (priceText) {
            // استخراج الرقم من النص (إزالة الفواصل والرموز غير الرقمية)
            const price = parseFloat(priceText.replace(/,/g, '').replace(/[^\d.]/g, ''));
            if (!isNaN(price) && price >= 1800 && price <= 3500) {
              console.log(`تم العثور على سعر في ويدجيت TradingView: ${price}`);
              onPriceUpdate?.(price);
            }
          }
        }
        
        // البحث عن السعر الكبير كما يظهر في الصورة المرفقة
        const allElements = document.querySelectorAll('*');
        for (const element of allElements) {
          const text = element.textContent?.trim();
          // البحث عن نمط يشبه سعر الذهب (مثل 2,991.490)
          if (text && /\b[1-3][\d,]{3,6}\.\d{1,3}\b/.test(text)) {
            const price = parseFloat(text.replace(/,/g, '').replace(/[^\d.]/g, ''));
            if (!isNaN(price) && price >= 1800 && price <= 3500) {
              console.log(`تم العثور على سعر ذهب محتمل: ${price}`);
              onPriceUpdate?.(price);
              break;
            }
          }
        }
      } catch (error) {
        console.error('خطأ في استخراج السعر:', error);
      }
    }, 1000);
    
    return () => {
      // إزالة الفاصل الزمني عند إزالة المكون
      clearInterval(priceCheckInterval);
      
      // تنظيف الحاوية
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [onPriceUpdate]);

  return (
    <div 
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
      className="tradingview-chart-container flex items-center justify-center"
    />
  );
};
