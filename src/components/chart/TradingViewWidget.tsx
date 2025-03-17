
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
      
      // Create the widget container
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'tradingview-widget-container';
      widgetContainer.style.width = '100%';
      widgetContainer.style.height = '100%';
      
      // Create script element for the Single Quote Widget
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
      
      // Set the configuration
      script.innerHTML = JSON.stringify({
        symbol: `CFI:${symbol}`,
        width: "100%",
        colorTheme: theme,
        isTransparent: false,
        locale: "ar"
      });
      
      // Append the script to the widget container
      widgetContainer.appendChild(script);
      
      // Append the widget container to our container
      container.current.appendChild(widgetContainer);
      
      // تأخير قليل للسماح للويدجيت بالتحميل
      setTimeout(() => {
        try {
          extractPriceFromWidget();
        } catch (error) {
          console.error('خطأ في استخراج السعر المبدئي:', error);
        }
      }, 1000);
      
      // إعداد التحديث كل نصف ثانية لتحديثات السعر (أسرع من قبل)
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
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [symbol, theme]);
  
  // دالة لاستخراج السعر من الويدجيت
  const extractPriceFromWidget = () => {
    if (!container.current) return;
    
    // البحث عن عنصر السعر في ويدجيت Single Quote
    const priceElement = container.current.querySelector('.tv-ticker-tape-price__value');
    
    if (priceElement && priceElement.textContent) {
      const priceText = priceElement.textContent.trim();
      // تنظيف النص واستخراج الرقم
      const cleanText = priceText.replace(/[^\d.,]/g, '');
      // التعامل مع الفاصلة والنقطة في تنسيقات الأرقام المختلفة
      const normalizedText = cleanText.replace(/,/g, '.');
      const price = parseFloat(normalizedText);
      
      if (!isNaN(price) && price > 0 && price !== lastExtractedPrice.current) {
        console.log('تم استخراج السعر من الويدجيت:', price);
        lastExtractedPrice.current = price;
        // إرسال حدث مخصص بالسعر المستخرج
        window.dispatchEvent(
          new CustomEvent('tradingview-price-update', {
            detail: { price }
          })
        );
      }
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
