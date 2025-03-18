


import React, { useEffect, useRef, useState } from 'react';
import { useTradingViewPrice } from '@/hooks/useTradingViewPrice';
import { TradingViewWidgetConfig } from './widget/TradingViewWidgetConfig';

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

  // تأكد من تنفيذ هذا الكود مرة واحدة فقط عند تركيب المكون
  useEffect(() => {
    if (container.current && !isInitialized) {
      console.log("تهيئة ويدجيت TradingView");
      
      // تهيئة المكون المساعد
      const { createWidgetContainer } = TradingViewWidgetConfig({
        symbol,
        theme,
        onLoad: () => {
          console.log("ويدجيت TradingView جاهز للاستخدام");
          setupPriceExtraction();
        }
      });
      
      // إنشاء حاوية الويدجيت
      const widgetContainer = createWidgetContainer();
      
      // تنظيف الحاوية أولاً
      container.current.innerHTML = '';
      
      // إضافة حاوية الويدجيت إلى الحاوية المرجعية
      container.current.appendChild(widgetContainer);
      setIsInitialized(true);
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
