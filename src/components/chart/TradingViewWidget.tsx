
import React, { useEffect, useRef, useState } from 'react';
import { useTradingViewPrice } from '@/hooks/useTradingViewPrice';
import { toast } from 'sonner';

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
  const [loadAttempts, setLoadAttempts] = useState(0);

  useEffect(() => {
    if (container.current && !isInitialized) {
      console.log("تهيئة ويدجيت TradingView");
      
      try {
        // تنظيف الحاوية أولاً
        container.current.innerHTML = '';
        
        // إنشاء حاوية الويدجيت
        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'tradingview-widget-container';
        widgetContainer.style.width = '100%';
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
        
        // تحديد تكوين الويدجيت - تغيير إلى FX_IDC لتحسين دقة عرض سعر الذهب
        script.innerHTML = JSON.stringify({
          symbol: `FX_IDC:${symbol}`,
          width: "100%",
          colorTheme: theme,
          isTransparent: false,
          locale: "en"
        });
        
        // مستمع لأحداث التحميل
        script.onload = () => {
          console.log("تم تحميل سكريبت TradingView بنجاح");
          setIsInitialized(true);
          
          // زيادة التأخير لإعطاء مزيد من الوقت لتحميل الويدجيت
          setTimeout(() => {
            console.log("بدء استخراج السعر من الويدجيت بعد التحميل");
            setupPriceExtraction();
          }, 3000);
        };
        
        script.onerror = (error) => {
          console.error("خطأ في تحميل سكريبت TradingView:", error);
          
          // محاولة إعادة التحميل
          if (loadAttempts < 3) {
            setLoadAttempts(prev => prev + 1);
            setTimeout(() => {
              setIsInitialized(false); // إعادة تهيئة
            }, 1000);
          } else {
            toast.error("فشل تحميل ويدجيت TradingView");
          }
        };
        
        // إضافة السكريبت إلى حاوية الويدجيت
        widgetContainer.appendChild(script);
        
        // إضافة حاوية الويدجيت إلى الحاوية المرجعية
        container.current.appendChild(widgetContainer);
      } catch (error) {
        console.error("خطأ أثناء تهيئة ويدجيت TradingView:", error);
      }
    }
  }, [symbol, theme, setupPriceExtraction, isInitialized, loadAttempts]);

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
        width: '100%',
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
