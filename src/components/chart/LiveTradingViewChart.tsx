
import React, { useEffect, useRef, useState } from 'react';

interface LiveTradingViewChartProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
}

export const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ 
  symbol = "XAUUSD",
  onSymbolChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget if any
    containerRef.current.innerHTML = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.width = '100%';
    widgetContainer.style.height = '100%';
    widgetContainer.id = 'trading-view-widget-container'; // إضافة معرف للعثور عليه بسهولة

    // Create script for Single Quote Widget
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
    
    // Widget configuration
    script.innerHTML = JSON.stringify({
      symbol: "CFI:XAUUSD",
      width: "100%",
      colorTheme: "light",
      isTransparent: false,
      locale: "ar"
    });

    // Append elements
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    // بدلاً من استخراج السعر هنا، سنترك ذلك لمكون ScreenshotPriceExtractor
    // الذي سيقوم بالتقاط صورة للويدجت واستخراج السعر منها

    // نشر حدث عند تغيير الرمز إذا تم توفير معالج
    if (onSymbolChange) {
      onSymbolChange(symbol);
    }

    // لا حاجة للتنظيف الخاص لأن المكون الجديد سيتعامل مع ذلك
  }, [symbol, onSymbolChange]);

  // استلام تحديث السعر من مكون ScreenshotPriceExtractor
  const handlePriceUpdate = (price: number) => {
    if (price > 0 && price !== currentPrice) {
      setCurrentPrice(price);
    }
  };

  // تسجيل المستمع للأحداث المخصصة للسعر
  useEffect(() => {
    const handleCustomPriceEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        handlePriceUpdate(event.detail.price);
      }
    };

    window.addEventListener('price-update' as any, handleCustomPriceEvent as EventListener);
    
    return () => {
      window.removeEventListener('price-update' as any, handleCustomPriceEvent as EventListener);
    };
  }, []);

  return (
    <div className="w-full mb-6">
      <div className="p-1 bg-gray-800 rounded-lg h-64 flex flex-col">
        <div ref={containerRef} className="w-full h-full">
          {/* TradingView Widget will be inserted here */}
        </div>
        {currentPrice && (
          <div className="text-center p-2 bg-white rounded-b-lg">
            <p className="text-lg font-bold text-green-600">
              سعر الذهب الحالي: {currentPrice.toFixed(2)} دولار
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
