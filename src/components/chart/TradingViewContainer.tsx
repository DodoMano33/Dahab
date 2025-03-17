
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
        // نستخدم محدد أكثر دقة للعثور على عنصر السعر
        const priceElements = document.querySelectorAll('.tv-symbol-price-quote__value');
        
        if (priceElements.length > 0) {
          for (const element of priceElements) {
            const priceText = element.textContent?.trim();
            if (priceText) {
              // استخراج الأرقام من النص (2,999.350 -> 2999.35)
              const price = parseFloat(priceText.replace(/,/g, ''));
              
              if (!isNaN(price) && price > 0) {
                console.log(`تم العثور على سعر في ويدجيت TradingView: ${price}`);
                
                // تحديث السعر محلياً
                onPriceUpdate?.(price);
                
                // بث السعر لكامل التطبيق مع إجبار التحديث
                broadcastPrice(price, true, 'CFI:XAUUSD');
                break;
              }
            }
          }
        }
        
        // البحث بشكل أوسع عن أي أرقام تشبه سعر الذهب
        if (priceElements.length === 0) {
          const allPriceElements = document.querySelectorAll('.tv-symbol-price-quote__value, .tv-symbol-header__first-line');
          
          for (const element of allPriceElements) {
            const text = element.textContent?.trim();
            if (text && /\d+,\d+\.\d+|\d+\.\d+/.test(text)) {
              const price = parseFloat(text.replace(/,/g, ''));
              if (!isNaN(price) && price > 0) {
                console.log(`تم العثور على سعر محتمل: ${price}`);
                
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
    }, 500); // فاصل زمني أقصر للتحقق من السعر بشكل متكرر
    
    // إرسال طلب تحديث السعر الأولي بعد فترة قصيرة من تحميل الويدجيت
    const initialUpdateTimeout = setTimeout(() => {
      const priceElements = document.querySelectorAll('.tv-symbol-price-quote__value');
      if (priceElements.length > 0) {
        const firstPriceElement = priceElements[0];
        const priceText = firstPriceElement.textContent?.trim();
        if (priceText) {
          const price = parseFloat(priceText.replace(/,/g, ''));
          if (!isNaN(price) && price > 0) {
            console.log(`التحديث الأولي للسعر: ${price}`);
            onPriceUpdate?.(price);
            broadcastPrice(price, true, 'CFI:XAUUSD');
          }
        }
      }
    }, 1500);
    
    return () => {
      // إزالة الفاصل الزمني والمؤقت عند إزالة المكون
      clearInterval(priceCheckInterval);
      clearTimeout(initialUpdateTimeout);
      
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
