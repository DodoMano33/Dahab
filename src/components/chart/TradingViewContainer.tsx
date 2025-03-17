
import React, { useEffect, useRef } from 'react';

interface TradingViewContainerProps {
  onPriceUpdate?: (price: number) => void;
}

export const TradingViewContainer: React.FC<TradingViewContainerProps> = ({
  onPriceUpdate
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
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
    
    script.innerHTML = JSON.stringify({
      "symbol": "CFI:XAUUSD",
      "width": "100%",
      "colorTheme": "dark",
      "isTransparent": false,
      "locale": "ar"
    });
    
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);
    
    // استمع إلى تحديثات السعر فقط
    const priceCheckInterval = setInterval(() => {
      try {
        const priceElements = document.querySelectorAll('.tv-symbol-price-quote__value');
        
        if (priceElements.length > 0) {
          for (const element of priceElements) {
            const priceText = element.textContent?.trim();
            if (priceText) {
              const price = parseFloat(priceText.replace(/,/g, ''));
              
              if (!isNaN(price) && price > 0) {
                console.log(`تم العثور على سعر في ويدجيت TradingView: ${price}`);
                onPriceUpdate?.(price);
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error('خطأ في استخراج السعر:', error);
      }
    }, 500);
    
    return () => {
      clearInterval(priceCheckInterval);
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
