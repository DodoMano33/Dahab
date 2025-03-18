
import React, { useEffect, useRef } from 'react';

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
  const intervalRef = useRef<number | null>(null);
  const lastExtractedPrice = useRef<number | null>(null);
  const widgetLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    if (container.current) {
      // تنظيف الحاوية
      container.current.innerHTML = '';
      
      // إنشاء حاوية الويدجيت
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'tradingview-widget-container';
      widgetContainer.style.width = '187.5px';
      widgetContainer.style.height = '95px';
      
      // إنشاء div الويدجيت
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';
      widgetDiv.style.width = '100%';
      widgetDiv.style.height = '100%';
      widgetContainer.appendChild(widgetDiv);
      
      // إنشاء سكريبت الويدجيت
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
      
      // تعيين التكوين مع تحديث لاستخدام سعر الذهب العالمي
      script.innerHTML = JSON.stringify({
        symbol: `FX_IDC:XAUUSD`, // استخدام مصدر بيانات أكثر دقة للذهب
        width: "100%",
        colorTheme: theme,
        isTransparent: false,
        locale: "en"
      });
      
      // معالج لتحميل الويدجيت
      script.onload = () => {
        console.log("تم تحميل سكريبت TradingView بنجاح");
        widgetLoadedRef.current = true;
        
        // تأخير أطول للتأكد من تحميل الويدجيت بالكامل
        setTimeout(() => {
          extractPriceFromWidget();
          
          // طلب التقاط صورة للويدجيت بعد تحميله
          window.dispatchEvent(new Event('request-capture-widget'));
        }, 2000);
      };
      
      // إضافة السكريبت إلى الحاوية
      widgetContainer.appendChild(script);
      
      // إضافة حاوية الويدجيت إلى الحاوية المرجعية
      container.current.appendChild(widgetContainer);
      
      // إعداد فاصل زمني لتحديث السعر
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        if (widgetLoadedRef.current) {
          extractPriceFromWidget();
        }
      }, 1000) as unknown as number;
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [symbol, theme]);
  
  // دالة محسنة لاستخراج السعر من الويدجيت البسيط
  const extractPriceFromWidget = () => {
    if (!container.current) return;
    
    // الويدجيت البسيط - يظهر السعر في عنصر strong
    const priceSelectors = [
      'strong', // الويدجيت البسيط يضع السعر في عنصر strong
      '.tv-ticker-tape-price__value', // احتياطي
      '.tv-symbol-price-quote__value', // احتياطي
      '[data-field="last"]', // احتياطي
      '.price-value'  // احتياطي
    ];
    
    // البحث عن عنصر السعر باستخدام المحددات
    for (const selector of priceSelectors) {
      const elements = container.current.querySelectorAll(selector);
      
      if (elements && elements.length > 0) {
        for (const element of elements) {
          const priceText = element.textContent;
          if (priceText) {
            console.log(`TradingViewWidget: النص المستخرج من '${selector}': "${priceText}"`);
            
            // تنظيف النص واستخراج الرقم - نتوقع صيغة مثل "3,030.519"
            // نزيل الفواصل ونحول النقاط إلى فواصل عشرية
            const cleanText = priceText.trim().replace(/[^\d.,]/g, '');
            
            if (cleanText.match(/\d+([.,]\d+)?/)) {
              const normalizedText = cleanText.replace(/,/g, '.');
              const price = parseFloat(normalizedText);
              
              if (!isNaN(price) && price > 0) {
                // التحقق من نطاق سعر الذهب - حاليًا بين 2000-4000
                if (price > 2000 && price < 4000) {
                  if (price !== lastExtractedPrice.current) {
                    console.log(`تم استخراج سعر ذهب جديد: ${price}`);
                    lastExtractedPrice.current = price;
                    
                    // إرسال حدث مخصص بالسعر المستخرج
                    window.dispatchEvent(
                      new CustomEvent('tradingview-price-update', {
                        detail: { price }
                      })
                    );
                  }
                  return;
                }
              }
            }
          }
        }
      }
    }
    
    // البحث عن نمط السعر في نص الويدجيت بالكامل
    const allText = container.current.textContent || '';
    const pricePattern = /\b[23],\d{3}\.\d{1,3}\b/g; // نمط مثل "3,030.51"
    const matches = allText.match(pricePattern);
    
    if (matches && matches.length > 0) {
      for (const match of matches) {
        const price = parseFloat(match.replace(/,/g, ''));
        if (!isNaN(price) && price > 2000 && price < 4000) {
          console.log(`تم استخراج سعر من نص كامل الويدجيت: ${price}`);
          
          if (price !== lastExtractedPrice.current) {
            lastExtractedPrice.current = price;
            
            window.dispatchEvent(
              new CustomEvent('tradingview-price-update', {
                detail: { price }
              })
            );
          }
          return;
        }
      }
    }
  };

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
