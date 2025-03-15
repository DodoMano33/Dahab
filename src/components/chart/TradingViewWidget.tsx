
import React, { useEffect, useRef } from 'react';
import { useTradingViewMessages } from '@/hooks/useTradingViewMessages';
import { useAnalysisChecker } from '@/hooks/useAnalysisChecker';
import { CurrentPriceDisplay } from './CurrentPriceDisplay';
import { useIsMobile } from '@/hooks/use-mobile';

interface TradingViewWidgetProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

function TradingViewWidget({ 
  symbol = "XAUUSD",
  onSymbolChange,
  onPriceUpdate 
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const currentPriceRef = useRef<number | null>(null);
  const forcedSymbol = "XAUUSD"; // تثبيت الرمز على XAUUSD
  const isMobile = useIsMobile();

  const { currentPrice } = useTradingViewMessages({
    symbol: forcedSymbol,
    onSymbolChange,
    onPriceUpdate
  });

  // تحديث السعر المرجعي
  useEffect(() => {
    if (currentPrice !== null) {
      currentPriceRef.current = currentPrice;
      console.log('Current price updated in TradingViewWidget:', currentPrice);
    }
  }, [currentPrice]);

  useAnalysisChecker({
    symbol: forcedSymbol,
    currentPriceRef
  });

  useEffect(() => {
    console.log('TradingViewWidget mounted with symbol:', forcedSymbol);
    
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = 'text/javascript';
    script.async = true;

    const config = {
      autosize: true,
      symbol: forcedSymbol,
      interval: "1",
      timezone: "Asia/Jerusalem",
      theme: "dark",
      style: "1",
      locale: "en",
      hide_legend: true,
      allow_symbol_change: false, // تعطيل تغيير الرمز
      save_image: false,
      calendar: false,
      hide_volume: true,
      support_host: "https://www.tradingview.com",
      enabled_features: ["chart_property_page_trading"],
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      custom_css_url: "",
      hide_top_toolbar: isMobile, // إخفاء شريط الأدوات العلوي في وضع الموبايل
      hide_side_toolbar: isMobile, // إخفاء شريط الأدوات الجانبي في وضع الموبايل
      toolbar_bg: "#000000", // خلفية داكنة للشريط
    };

    script.innerHTML = JSON.stringify(config);

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = 'calc(100% - 32px)';
    widgetDiv.style.width = '100%';

    const copyright = document.createElement('div');
    copyright.className = 'tradingview-widget-copyright';
    copyright.innerHTML = '<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a>';

    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(copyright);
    widgetContainer.appendChild(script);

    if (container.current) {
      container.current.innerHTML = '';
      container.current.appendChild(widgetContainer);
    }

    // طلب السعر الأولي
    const attemptInitialPriceRequest = () => {
      try {
        window.postMessage({ method: 'getCurrentPrice', symbol: forcedSymbol }, '*');
        console.log('Sent getCurrentPrice request to TradingView via window.postMessage');
      } catch (e) {
        console.warn('Failed to request initial price from TradingView', e);
      }
    };
    
    // جدولة عدة طلبات متتالية للتأكد من الحصول على السعر
    const initialPriceTimer = setTimeout(attemptInitialPriceRequest, 3000);
    const secondPriceTimer = setTimeout(attemptInitialPriceRequest, 5000);
    const thirdPriceTimer = setTimeout(attemptInitialPriceRequest, 8000);

    return () => {
      clearTimeout(initialPriceTimer);
      clearTimeout(secondPriceTimer);
      clearTimeout(thirdPriceTimer);
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [forcedSymbol, isMobile]);

  // ضبط ارتفاع الشارت حسب حجم الشاشة
  const chartHeight = isMobile ? '350px' : '600px';

  return (
    <div className="flex flex-col w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* عرض الشارت بحجم أصغر على الموبايل */}
      <div 
        ref={container}
        className="w-full border-b border-gray-700"
        style={{ height: chartHeight }}
      />
      
      {/* عرض معلومات السعر بشكل منفصل أسفل الشارت */}
      <CurrentPriceDisplay price={currentPrice} />
    </div>
  );
}

export default TradingViewWidget;
