
import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: string;
  allowSymbolChange?: boolean;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol = 'XAUUSD',
  theme = 'light',
}) => {
  const container = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const lastExtractedPrice = useRef<number | null>(null);

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = '';
      
      // إنشاء حاوية العنصر
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'tradingview-widget-container';
      widgetContainer.style.width = '100%';
      widgetContainer.style.height = '100%';
      
      // إنشاء عنصر النص البرمجي للويدجت
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
      
      // ضبط الإعدادات
      script.innerHTML = JSON.stringify({
        symbol: `CFI:${symbol}`,
        width: "100%",
        colorTheme: theme,
        isTransparent: false,
        locale: "ar"
      });
      
      // إضافة العناصر للصفحة
      widgetContainer.appendChild(script);
      container.current.appendChild(widgetContainer);
      
      // تأخير قليل للسماح للويدجت بالتحميل
      const initialTimeout = setTimeout(() => {
        try {
          extractPriceFromWidget();
          console.log("تم محاولة استخراج السعر المبدئي");
        } catch (error) {
          console.error('خطأ في استخراج السعر المبدئي:', error);
        }
      }, 2000); // زيادة المهلة إلى 2 ثانية للتأكد من تحميل الويدجت
      
      // إعداد التحديث كل نصف ثانية لتحديثات السعر
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        try {
          extractPriceFromWidget();
        } catch (error) {
          console.error('خطأ في استخراج السعر في الفاصل الزمني:', error);
        }
      }, 500) as unknown as number; // تحديث كل نصف ثانية للحصول على أكثر دقة
      
      return () => {
        clearTimeout(initialTimeout);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [symbol, theme]);
  
  // دالة محسنة لاستخراج السعر من الويدجت
  const extractPriceFromWidget = () => {
    if (!container.current) return;
    
    // محاولة 1: البحث عن عنصر السعر في ويدجت Single Quote
    const priceElement = container.current.querySelector('.tv-ticker-tape-price__value');
    
    if (priceElement && priceElement.textContent) {
      const priceText = priceElement.textContent.trim();
      // تنظيف النص واستخراج الرقم
      const cleanText = priceText.replace(/[^\d.,]/g, '');
      // التعامل مع الفاصلة والنقطة في تنسيقات الأرقام المختلفة
      const normalizedText = cleanText.replace(/,/g, '.');
      const price = parseFloat(normalizedText);
      
      if (!isNaN(price) && price > 0 && price !== lastExtractedPrice.current) {
        console.log('تم استخراج السعر من الويدجت:', price);
        lastExtractedPrice.current = price;
        // إرسال حدث مخصص بالسعر المستخرج
        window.dispatchEvent(
          new CustomEvent('tradingview-price-update', {
            detail: { price }
          })
        );
      }
      return;
    }
    
    // محاولة 2: البحث عن عناصر بقيمة رقمية في أي مكان داخل الويدجت
    const allElements = container.current.querySelectorAll('div, span, p, td');
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      if (element.textContent && /^\s*[\d,]+\.\d+\s*$/.test(element.textContent)) {
        const priceText = element.textContent.trim();
        const cleanText = priceText.replace(/[^\d.,]/g, '');
        const normalizedText = cleanText.replace(/,/g, '.');
        const price = parseFloat(normalizedText);
        
        if (!isNaN(price) && price > 0 && price !== lastExtractedPrice.current) {
          console.log('تم استخراج السعر من عنصر ويدجت عام:', price);
          lastExtractedPrice.current = price;
          window.dispatchEvent(
            new CustomEvent('tradingview-price-update', {
              detail: { price }
            })
          );
          return;
        }
      }
    }
    
    // إذا وصلنا إلى هنا، فلم نجد عنصر سعر صالح
    if (!lastExtractedPrice.current) {
      // استخدام سعر افتراضي فقط إذا لم نجد أي سعر بعد
      console.log('لم نتمكن من استخراج سعر، استخدام قيمة افتراضية (2000)');
      lastExtractedPrice.current = 2000; // قيمة افتراضية للذهب
      window.dispatchEvent(
        new CustomEvent('tradingview-price-update', {
          detail: { price: 2000 }
        })
      );
    }
  };

  return (
    <div 
      ref={container} 
      style={{ 
        width: '100%', 
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f9f9f9',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  );
};

export default TradingViewWidget;
