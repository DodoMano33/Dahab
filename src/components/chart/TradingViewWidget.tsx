
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
  
  // دالة محسنة لاستخراج السعر من الويدجيت
  const extractPriceFromWidget = () => {
    if (!container.current) return;
    
    // المحددات المحسنة للبحث عن عناصر السعر
    const priceSelectors = [
      '.tv-ticker-tape-price__value',
      '.chart-markup-table.pane-legend-line.main-serie .tv-symbol-price-quote__value',
      '.tv-symbol-header__first-line .tv-symbol-price-quote__value',
      '.tv-symbol-price-quote__value',
      '.apply-overflow-tooltip.apply-common-tooltip',
      '[data-name="legend-source-item"] .tv-symbol-price-quote__value',
      '.tv-ticker__item--last .tv-ticker__field--last-value',
      'strong'  // التحديثات الأخيرة في TradingView قد تستخدم هذا
    ];
    
    // البحث عن عناصر السعر باستخدام المحددات المختلفة
    for (const selector of priceSelectors) {
      const elements = container.current.querySelectorAll(selector);
      
      if (elements && elements.length > 0) {
        for (const element of elements) {
          const priceText = element.textContent;
          if (priceText) {
            console.log(`TradingViewWidget: النص المستخرج باستخدام المحدد '${selector}': "${priceText}"`);
            
            // تنظيف النص واستخراج الرقم
            const cleanText = priceText.trim().replace(/[^\d.,]/g, '');
            
            // التحقق من صحة التنسيق
            if (cleanText.match(/\d+([.,]\d+)?/)) {
              const normalizedText = cleanText.replace(/,/g, '.');
              const price = parseFloat(normalizedText);
              
              if (!isNaN(price) && price > 0) {
                // التحقق من أن السعر في نطاق معقول للذهب (500-5000)
                if (price > 500 && price < 5000) {
                  if (price !== lastExtractedPrice.current) {
                    console.log(`تم استخراج سعر جديد: ${price}`);
                    lastExtractedPrice.current = price;
                    
                    // إرسال حدث مخصص بالسعر المستخرج
                    window.dispatchEvent(
                      new CustomEvent('tradingview-price-update', {
                        detail: { price }
                      })
                    );
                  }
                  return;
                } else if (price > 0.5 && price < 5) {
                  // قد يكون السعر بالآلاف لكن بصيغة مختصرة
                  const adjustedPrice = price * 1000;
                  if (adjustedPrice !== lastExtractedPrice.current) {
                    console.log(`تم تعديل السعر من ${price} إلى ${adjustedPrice}`);
                    lastExtractedPrice.current = adjustedPrice;
                    
                    window.dispatchEvent(
                      new CustomEvent('tradingview-price-update', {
                        detail: { price: adjustedPrice }
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
    
    // البحث في كامل الحاوية عن أي نص قد يكون السعر
    if (lastExtractedPrice.current === null) {
      const allText = container.current.textContent || '';
      const priceMatches = allText.match(/\b(\d{1,4})[.,](\d{1,3})\b/g);
      
      if (priceMatches) {
        for (const match of priceMatches) {
          const price = parseFloat(match.replace(/,/g, '.'));
          if (!isNaN(price) && price > 1000 && price < 3000) {
            console.log(`تم استخراج سعر محتمل من نص الحاوية: ${price}`);
            lastExtractedPrice.current = price;
            
            window.dispatchEvent(
              new CustomEvent('tradingview-price-update', {
                detail: { price }
              })
            );
            break;
          }
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
