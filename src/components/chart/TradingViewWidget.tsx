
import React, { useEffect, useRef } from 'react';
import { useTradingViewMessages } from '@/hooks/useTradingViewMessages';
import { useAnalysisChecker } from '@/hooks/useAnalysisChecker';
import { CurrentPriceDisplay } from './CurrentPriceDisplay';

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
  const priceRequestIntervals = useRef<NodeJS.Timeout[]>([]);

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
      
      // نقوم بنشر حدث عام لتمكين جميع أجزاء التطبيق من معرفة السعر الحالي
      window.dispatchEvent(new CustomEvent('global-price-update', { 
        detail: { price: currentPrice, symbol: forcedSymbol }
      }));
    }
  }, [currentPrice, forcedSymbol]);

  useAnalysisChecker({
    symbol: forcedSymbol,
    currentPriceRef
  });

  // وظيفة جديدة تطلب السعر من TradingView
  const requestPriceFromTradingView = () => {
    try {
      // إرسال رسالة لطلب السعر الحالي
      window.postMessage({ method: 'getCurrentPrice', symbol: forcedSymbol }, '*');
      console.log('Sent getCurrentPrice request to TradingView via window.postMessage');
    } catch (e) {
      console.warn('Failed to request price from TradingView', e);
    }
  };

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
      custom_css_url: ""
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

    // إنشاء جدول زمني متعدد لطلب السعر بشكل متكرر
    // نبدأ بطلبات متقاربة ثم نقلل التكرار بمرور الوقت
    const scheduleInitialPriceRequests = () => {
      // مسح أي طلبات سابقة
      priceRequestIntervals.current.forEach(clearTimeout);
      priceRequestIntervals.current = [];
      
      // طلبات سريعة في البداية (كل ثانية لمدة 10 ثوانٍ)
      for (let i = 1; i <= 10; i++) {
        const timeoutId = setTimeout(requestPriceFromTradingView, i * 1000);
        priceRequestIntervals.current.push(timeoutId);
      }
      
      // طلبات متوسطة (كل 3 ثوانٍ لمدة 30 ثانية إضافية)
      for (let i = 1; i <= 10; i++) {
        const timeoutId = setTimeout(requestPriceFromTradingView, 10000 + i * 3000);
        priceRequestIntervals.current.push(timeoutId);
      }
      
      // طلبات أبطأ (كل 10 ثوانٍ لمدة دقيقة إضافية)
      for (let i = 1; i <= 6; i++) {
        const timeoutId = setTimeout(requestPriceFromTradingView, 40000 + i * 10000);
        priceRequestIntervals.current.push(timeoutId);
      }
    };
    
    // جدولة الطلبات الأولية
    scheduleInitialPriceRequests();
    
    // إعداد فاصل زمني لطلب السعر كل 20 ثانية بشكل مستمر
    const regularPriceInterval = setInterval(requestPriceFromTradingView, 20000);

    return () => {
      // تنظيف جميع الفواصل الزمنية عند إزالة المكون
      priceRequestIntervals.current.forEach(clearTimeout);
      clearInterval(regularPriceInterval);
      
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [forcedSymbol]);

  return (
    <div className="relative w-full h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div 
        ref={container}
        style={{ height: "100%", width: "100%" }}
      />
      <CurrentPriceDisplay price={currentPrice} />
    </div>
  );
}

export default TradingViewWidget;
