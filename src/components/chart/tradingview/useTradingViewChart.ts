
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { createTradingViewConfig, createPriceExtractionScript } from './TradingViewConfig';
import { screenPriceReader } from '@/utils/price/screenReader';

export const useTradingViewChart = (
  symbol: string = "XAUUSD",
  isMobile: boolean = false,
) => {
  const container = useRef<HTMLDivElement>(null);
  
  // إعداد طلبات السعر من TradingView
  const requestTradingViewPrice = () => {
    try {
      const iframe = container.current?.querySelector('iframe');
      if (iframe) {
        // إرسال رسالة إلى إطار TradingView لطلب السعر الحالي
        iframe.contentWindow?.postMessage({ command: 'get-current-price' }, '*');
      }
    } catch (error) {
      console.error('Error requesting price from TradingView:', error);
    }
  };

  // تحميل مكتبة TradingView وإعداد الحدث
  useEffect(() => {
    console.log('TradingViewWidget mounted with symbol:', symbol);
    
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = 'text/javascript';
    script.async = true;

    // إضافة كود جافاسكريبت للوصول إلى السعر المباشر
    const injectScript = document.createElement('script');
    injectScript.innerHTML = createPriceExtractionScript();

    const config = createTradingViewConfig(symbol, isMobile);
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
  }, [symbol, isMobile]);

  // ضبط معالج استقبال الرسائل من TradingView
  useEffect(() => {
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
    
    return () => {
      window.removeEventListener('message', handleTVMessage);
    };
  }, []);

  // إعداد طلبات دورية للسعر من TradingView
  useEffect(() => {
    const handleRequestTradingViewPrice = () => {
      requestTradingViewPrice();
    };
    
    window.addEventListener('request-tradingview-price', handleRequestTradingViewPrice);
    
    // بدء قراءة السعر من الشاشة كل نصف ثانية
    screenPriceReader.start(500);
    
    // إعداد طلب متكرر للسعر من TradingView
    const priceRequestInterval = setInterval(() => {
      handleRequestTradingViewPrice();
    }, 500);
    
    return () => {
      window.removeEventListener('request-tradingview-price', handleRequestTradingViewPrice);
      clearInterval(priceRequestInterval);
      // إيقاف قراءة السعر عند إلغاء المكون
      screenPriceReader.stop();
    };
  }, []);

  return {
    container,
    requestTradingViewPrice
  };
};
