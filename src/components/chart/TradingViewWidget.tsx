
import React, { useEffect, useRef, useState } from 'react';
import { useTradingViewPrice } from '@/hooks/useTradingViewPrice';

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
  const { setupPriceExtraction } = useTradingViewPrice(container);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (container.current && !isInitialized) {
      console.log("تهيئة ويدجيت TradingView");
      
      // تنظيف الحاوية أولاً
      container.current.innerHTML = '';
      
      // إنشاء حاوية الويدجيت
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'tradingview-widget-container';
      widgetContainer.style.width = '187.5px';
      widgetContainer.style.height = '95px';

      // إنشاء div للويدجيت نفسه
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';
      widgetDiv.style.width = '100%';
      widgetDiv.style.height = '100%';
      
      // إضافة div الويدجيت إلى الحاوية
      widgetContainer.appendChild(widgetDiv);
      
      // إنشاء سكريبت لويدجيت TradingView
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
      
      // تحديد تكوين الويدجيت
      script.innerHTML = JSON.stringify({
        symbol: `CFI:${symbol}`,
        width: "100%",
        colorTheme: theme,
        isTransparent: false,
        locale: "en"
      });
      
      // إضافة السكريبت إلى حاوية الويدجيت
      widgetContainer.appendChild(script);
      
      // إضافة حاوية الويدجيت إلى الحاوية المرجعية
      container.current.appendChild(widgetContainer);
      
      // تعيين الحالة كمهيأة
      setIsInitialized(true);
      
      // بعد 1 ثانية قم بإعداد استخراج السعر
      setTimeout(() => {
        setupPriceExtraction();
      }, 1000);
    }
  }, [symbol, theme, setupPriceExtraction, isInitialized]);

  // تنظيف عند إزالة المكون
  useEffect(() => {
    return () => {
      setIsInitialized(false);
    };
  }, []);

  return (
    <div 
      ref={container} 
      className="tradingview-widget-wrapper"
      style={{ 
        width: '187.5px',
        height: '95px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f9f9f9',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative'
      }}
    />
  );
};

export default TradingViewWidget;
