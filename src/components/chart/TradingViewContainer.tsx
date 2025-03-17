
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
    
    // إعدادات الويدجيت
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
    
    // استمع إلى تحديثات السعر من الويدجيت
    const messageHandler = (event: MessageEvent) => {
      try {
        if (event.data && typeof event.data === 'object' && event.data.name === 'tv-widget-symbol-update' && event.data.symbolName === 'CFI:XAUUSD') {
          const price = event.data.price;
          if (price && !isNaN(price)) {
            console.log(`تم استلام تحديث سعر من Single Quote Widget: ${price}`);
            onPriceUpdate?.(price);
          }
        }
      } catch (error) {
        console.error('خطأ في معالجة رسالة تحديث السعر:', error);
      }
    };
    
    // إضافة مستمع الرسائل
    window.addEventListener('message', messageHandler);
    
    return () => {
      // إزالة مستمع الرسائل عند إزالة المكون
      window.removeEventListener('message', messageHandler);
      
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
