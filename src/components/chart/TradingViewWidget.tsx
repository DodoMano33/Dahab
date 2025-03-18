
import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (container.current) {
      // تنظيف الحاوية
      container.current.innerHTML = '';
      
      // تهيئة المكون المساعد
      const widgetConfig = TradingViewWidgetConfig({
        symbol,
        theme,
        onLoad: setupPriceExtraction
      });
      
      // إنشاء حاوية الويدجيت
      const widgetContainer = widgetConfig.createWidgetContainer();
      
      // إضافة حاوية الويدجيت إلى الحاوية المرجعية
      container.current.appendChild(widgetContainer);
    }
  }, [symbol, theme, setupPriceExtraction]);

  return (
    <div 
      ref={container} 
      style={{ 
        width: '187.5px',
        height: '95px',
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
