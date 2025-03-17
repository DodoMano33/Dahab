
import React, { useEffect, useRef } from 'react';
import { broadcastPrice } from '@/utils/price/capture/priceBroadcaster';

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
        // البحث عن عنصر السعر الرئيسي بشكل أكثر دقة
        const priceElement = document.querySelector('.tv-symbol-price-quote__value');
        
        if (priceElement) {
          const priceText = priceElement.textContent?.trim();
          if (priceText) {
            // استخراج الأرقام من النص (2,999.350 -> 2999.35)
            const price = parseFloat(priceText.replace(/,/g, ''));
            
            if (!isNaN(price) && price >= 1800 && price <= 3500) {
              console.log(`تم العثور على سعر دقيق في ويدجيت TradingView: ${price}`);
              
              // تحديث السعر محلياً
              onPriceUpdate?.(price);
              
              // بث السعر لكامل التطبيق مع التأكيد على ضمان وصوله لجميع المكونات
              broadcastPrice(price, true, 'CFI:XAUUSD');
            }
          }
        }
        
        // البحث بشكل أوسع عن أرقام تطابق نمط سعر الذهب في الصفحة (كاحتياط)
        if (!priceElement) {
          const allElements = document.querySelectorAll('div, span');
          for (const element of allElements) {
            const text = element.textContent?.trim();
            // نمط البحث محسن للكشف عن أرقام مثل 2,999.350
            if (text && /\d{1,3}(,\d{3})*\.\d{1,3}/.test(text)) {
              const price = parseFloat(text.replace(/,/g, ''));
              if (!isNaN(price) && price >= 1800 && price <= 3500) {
                console.log(`تم العثور على سعر ذهب محتمل: ${price}`);
                
                // تحديث السعر محلياً
                onPriceUpdate?.(price);
                
                // بث السعر لكامل التطبيق
                broadcastPrice(price, true, 'CFI:XAUUSD');
                break;
              }
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
