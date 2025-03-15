
import React, { useEffect, useRef } from 'react';
import { useTradingViewMessages } from '@/hooks/useTradingViewMessages';
import { useAnalysisChecker } from '@/hooks/useAnalysisChecker';
import { CurrentPriceDisplay } from './CurrentPriceDisplay';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePriceReader } from '@/hooks/usePriceReader';
import { screenPriceReader } from '@/utils/price/screenReader';
import { toast } from 'sonner';

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
  const { price: screenPrice } = usePriceReader(500); // تحديث أسرع (500ms)

  const { currentPrice } = useTradingViewMessages({
    symbol: forcedSymbol,
    onSymbolChange,
    onPriceUpdate
  });

  // تحديث السعر المرجعي باستخدام السعر من قارئ الشاشة أو من TradingView
  useEffect(() => {
    const finalPrice = screenPrice !== null ? screenPrice : currentPrice;
    if (finalPrice !== null) {
      currentPriceRef.current = finalPrice;
      console.log('Current price updated in TradingViewWidget:', finalPrice);
      
      // إعلام باقي المكونات بالسعر الجديد
      if (onPriceUpdate) {
        onPriceUpdate(finalPrice);
      }
    }
  }, [screenPrice, currentPrice, onPriceUpdate]);

  useAnalysisChecker({
    symbol: forcedSymbol,
    currentPriceRef
  });

  // إضافة مستمع للأحداث لطلب السعر من TradingView
  useEffect(() => {
    const handleRequestTradingViewPrice = () => {
      try {
        const iframe = container.current?.querySelector('iframe');
        if (iframe) {
          // إرسال رسالة إلى إطار TradingView لطلب السعر الحالي
          iframe.contentWindow?.postMessage({ command: 'get-current-price' }, '*');
        } else {
          console.warn('No TradingView iframe found when requesting price');
        }
      } catch (error) {
        console.error('Error requesting price from TradingView:', error);
      }
    };
    
    window.addEventListener('request-tradingview-price', handleRequestTradingViewPrice);
    
    // إعداد مستمع للرسائل من إطار TradingView
    const handleTVMessage = (event: MessageEvent) => {
      try {
        if (event.data && event.data.type === 'current-price-response') {
          const price = event.data.price;
          if (typeof price === 'number' && !isNaN(price)) {
            console.log('Received direct price from TradingView:', price);
            
            // نشر حدث بالسعر المباشر من TradingView
            window.dispatchEvent(new CustomEvent('tradingview-direct-price', {
              detail: { price }
            }));
          }
        }
      } catch (error) {
        console.error('Error processing TradingView message:', error);
      }
    };
    
    window.addEventListener('message', handleTVMessage);
    
    // بدء قراءة السعر من الشاشة كل نصف ثانية
    screenPriceReader.start(500);
    
    // إعداد طلب متكرر للسعر من TradingView
    const priceRequestInterval = setInterval(() => {
      handleRequestTradingViewPrice();
    }, 500);
    
    return () => {
      window.removeEventListener('request-tradingview-price', handleRequestTradingViewPrice);
      window.removeEventListener('message', handleTVMessage);
      clearInterval(priceRequestInterval);
      // إيقاف قراءة السعر عند إلغاء المكون
      screenPriceReader.stop();
    };
  }, []);

  useEffect(() => {
    console.log('TradingViewWidget mounted with symbol:', forcedSymbol);
    
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = 'text/javascript';
    script.async = true;

    // إضافة كود جافاسكريبت للوصول إلى السعر المباشر
    const injectScript = document.createElement('script');
    injectScript.innerHTML = `
      // مستمع لطلبات السعر الحالي من التطبيق الرئيسي
      window.addEventListener('message', function(event) {
        if (event.data && event.data.command === 'get-current-price') {
          try {
            // محاولة الوصول إلى كائن TradingView
            if (window.TradingView && window.TradingView.activeChart) {
              const price = window.TradingView.activeChart().crosshairPrice();
              // إرسال السعر للتطبيق الرئيسي
              window.parent.postMessage({
                type: 'current-price-response',
                price: price
              }, '*');
            } else {
              console.log('TradingView chart not accessible yet');
            }
          } catch(e) {
            console.error('Error getting TradingView price:', e);
          }
        }
      });
      
      // محاولة إعداد مراقب للسعر
      try {
        setInterval(function() {
          if (window.TradingView && window.TradingView.activeChart) {
            const price = window.TradingView.activeChart().crosshairPrice();
            if (price) {
              window.parent.postMessage({
                type: 'current-price-response',
                price: price
              }, '*');
            }
          }
        }, 500);
      } catch(e) {
        console.error('Error setting up price monitor:', e);
      }
    `;

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
    
    // إضافة معرف فريد للعنصر الذي سيتم استخدامه للتقاط الشاشة
    widgetDiv.id = 'tradingview-price-display';

    const copyright = document.createElement('div');
    copyright.className = 'tradingview-widget-copyright';
    copyright.innerHTML = '<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a>';

    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(copyright);
    widgetContainer.appendChild(script);
    widgetContainer.appendChild(injectScript); // إضافة السكريبت المخصص

    if (container.current) {
      container.current.innerHTML = '';
      container.current.appendChild(widgetContainer);
    }

    // إظهار إشعار عند تحميل الشارت
    toast.success("تم تحميل شارت TradingView", {
      duration: 3000,
      position: "bottom-center"
    });

    return () => {
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
      <CurrentPriceDisplay price={currentPriceRef.current} />
    </div>
  );
}

export default TradingViewWidget;
