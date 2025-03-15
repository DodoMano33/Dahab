
import React, { useEffect, useRef } from 'react';
import { useTradingViewMessages } from '@/hooks/useTradingViewMessages';
import { useAnalysisChecker } from '@/hooks/useAnalysisChecker';
import { CurrentPriceDisplay } from './CurrentPriceDisplay';
import { 
  startPriceCapture, 
  stopPriceCapture, 
  cleanupPriceCapture,
  requestImmediatePriceUpdate 
} from '@/utils/price/screenshotPriceExtractor';

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
  // تثبيت رمز العملة وإضافة مزود السعر بوضوح
  const forcedSymbol = "XAUUSD"; 
  const priceProvider = "CFI";

  const { currentPrice } = useTradingViewMessages({
    symbol: forcedSymbol,
    onSymbolChange,
    onPriceUpdate: (price) => {
      currentPriceRef.current = price;
      onPriceUpdate?.(price);
      
      // إرسال تحديث السعر إلى جميع مكونات التطبيق مع تحديد المزود
      window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
        detail: { 
          price, 
          symbol: 'CFI:XAUUSD',
          timestamp: Date.now(),
          provider: priceProvider
        }
      }));
    }
  });

  useAnalysisChecker({
    symbol: forcedSymbol,
    currentPriceRef
  });

  useEffect(() => {
    console.log('TradingViewWidget mounted with symbol:', forcedSymbol, 'provider:', priceProvider);
    
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = 'text/javascript';
    script.async = true;

    const config = {
      autosize: true,
      symbol: "CFI:XAUUSD", // تحديد مزود CFI بوضوح
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
    widgetDiv.id = 'tv_chart_container'; // إضافة معرف للعثور عليه لاحقًا
    // إضافة سمة data للمصدر
    widgetDiv.setAttribute('data-provider', 'CFI');

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

    // بدء التقاط السعر بعد تحميل الشارت
    const startCapture = setTimeout(() => {
      console.log('بدء التقاط السعر من الشارت CFI...');
      startPriceCapture();
    }, 5000);

    // طلب السعر المبدئي عدة مرات للتأكد من تحميله
    const requestInitialPrice = () => {
      try {
        // إرسال طلب السعر الحالي
        window.dispatchEvent(new Event('request-current-price'));
        
        // مباشرة عبر postMessage
        window.postMessage({ method: 'getCurrentPrice', symbol: 'CFI:XAUUSD', provider: 'CFI' }, '*');
        
        // طلب تحديث فوري من نظام استخراج السعر
        requestImmediatePriceUpdate();
        
        console.log('تم إرسال طلب الحصول على السعر الحالي من CFI بجميع الطرق المتاحة');
      } catch (e) {
        console.warn('فشل في طلب السعر المبدئي من TradingView', e);
      }
    };
    
    // جدولة عدة طلبات متتالية للتأكد من الحصول على السعر
    const initialPriceTimer = setTimeout(requestInitialPrice, 3000);
    const secondPriceTimer = setTimeout(requestInitialPrice, 5000);
    const thirdPriceTimer = setTimeout(requestInitialPrice, 8000);
    
    // إعداد مراقبة دورية للتأكد من استمرار تحديث السعر
    const priceUpdateChecker = setInterval(() => {
      // إذا لم يكن هناك سعر حالي، أطلب السعر
      if (currentPriceRef.current === null) {
        requestInitialPrice();
      }
    }, 10000);

    return () => {
      clearTimeout(startCapture);
      clearTimeout(initialPriceTimer);
      clearTimeout(secondPriceTimer);
      clearTimeout(thirdPriceTimer);
      clearInterval(priceUpdateChecker);
      
      // إيقاف وتنظيف الالتقاط
      cleanupPriceCapture();
      
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [forcedSymbol]);

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* الرسم البياني - في حاوية منفصلة */}
      <div className="w-full h-[520px] bg-white dark:bg-gray-800 rounded-t-lg shadow-lg overflow-hidden">
        <div 
          ref={container}
          style={{ height: "100%", width: "100%" }}
          data-provider="CFI" // تحديد المزود بوضوح
        />
      </div>
      
      {/* مستطيل معلومات السعر - منفصل تمامًا عن الشارت */}
      <div className="w-full">
        <CurrentPriceDisplay price={currentPrice} provider="CFI" />
      </div>
    </div>
  );
}

export default TradingViewWidget;
