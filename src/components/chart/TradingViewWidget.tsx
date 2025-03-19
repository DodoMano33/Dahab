
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
  const widgetRef = useRef<any>(null);

  // دالة لالتقاط لقطة شاشة من الويدجيت
  const takeScreenshot = () => {
    if (widgetRef.current && widgetRef.current.chart && typeof widgetRef.current.chart().takeScreenshot === 'function') {
      console.log("جاري التقاط لقطة شاشة من ويدجيت TradingView...");
      
      widgetRef.current.chart().takeScreenshot().then((dataUrl: string) => {
        console.log("تم التقاط الشاشة بنجاح!");
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `tradingview-${symbol}-${new Date().toISOString().split('T')[0]}.png`;
        link.click();
      }).catch((error: any) => {
        console.error("فشل في التقاط لقطة الشاشة:", error);
      });
    } else {
      console.error("الويدجيت غير متاح أو لا يدعم وظيفة التقاط الشاشة");
    }
  };

  // المساعدة في الوصول إلى الويدجيت من خارج المكون
  useEffect(() => {
    // تعريف وظيفة عامة للوصول إلى الويدجيت
    (window as any).takeWidgetScreenshot = takeScreenshot;
    
    // تنظيف عند إزالة المكون
    return () => {
      delete (window as any).takeWidgetScreenshot;
    };
  }, []);

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
      
      // تحديد تكوين الويدجيت - تغيير إلى FX_IDC لتحسين دقة عرض سعر الذهب
      script.innerHTML = JSON.stringify({
        symbol: `FX_IDC:${symbol}`,
        width: "100%",
        colorTheme: theme,
        isTransparent: false,
        locale: "en"
      });
      
      // إضافة السكريبت إلى حاوية الويدجيت
      widgetContainer.appendChild(script);
      
      // إضافة حاوية الويدجيت إلى الحاوية المرجعية
      container.current.appendChild(widgetContainer);
      
      // محاولة الحصول على مرجع الويدجيت
      try {
        const checkWidgetInterval = setInterval(() => {
          if (window.TradingView && document.querySelector('.tradingview-widget-container')) {
            clearInterval(checkWidgetInterval);
            // تخزين مرجع الويدجيت إذا كان متاحًا
            const tvWidgets = document.querySelectorAll('.tradingview-widget-container');
            if (tvWidgets.length > 0) {
              widgetRef.current = (window as any).TradingView?.widget;
              console.log("تم العثور على ويدجيت TradingView", widgetRef.current);
            }
          }
        }, 500);
        
        // تنظيف الفاصل الزمني بعد 10 ثوانٍ للتأكد من عدم استمراره إلى ما لا نهاية
        setTimeout(() => {
          clearInterval(checkWidgetInterval);
        }, 10000);
      } catch (e) {
        console.error("خطأ في الوصول إلى ويدجيت TradingView:", e);
      }
      
      // تعيين الحالة كمهيأة
      setIsInitialized(true);
      
      // زيادة التأخير لإعطاء مزيد من الوقت لتحميل الويدجيت
      setTimeout(() => {
        console.log("بدء استخراج السعر من الويدجيت بعد التحميل");
        setupPriceExtraction();
      }, 3000);
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
