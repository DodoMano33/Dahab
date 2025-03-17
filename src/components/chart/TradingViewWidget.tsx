
import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  interval?: string;
  theme?: string;
  allowSymbolChange?: boolean;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol = 'XAUUSD',
  interval = '1D',
  theme = 'dark',
  allowSymbolChange = true,
}) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => createWidget();
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (window.TradingView) {
      createWidget();
    }
  }, [symbol, interval, theme, allowSymbolChange]);

  const createWidget = () => {
    if (container.current && window.TradingView) {
      container.current.innerHTML = '';
      const widgetOptions = {
        container_id: 'tradingview_chart',
        symbol: symbol,
        interval: interval,
        theme: theme,
        style: '1',
        locale: 'ar_AE',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: allowSymbolChange,
        save_image: true,
        height: 500,
        width: '100%',
        autosize: true,
      };

      const tvWidget = new window.TradingView.widget(widgetOptions);

      tvWidget.onChartReady(() => {
        console.log('TradingView chart ready');
        
        // إضافة مستمع لتغيير الرمز
        if (allowSymbolChange) {
          tvWidget.chart().onSymbolChanged().subscribe(null, (symbolInfo) => {
            const newSymbol = symbolInfo.name;
            console.log('Symbol changed to:', newSymbol);
            
            // إطلاق حدث تغيير الرمز
            window.dispatchEvent(
              new CustomEvent('tradingview-symbol-change', {
                detail: { symbol: newSymbol }
              })
            );
          });
        }

        // استخراج السعر وإرسال حدث
        const extractPriceInterval = setInterval(() => {
          try {
            let priceValue = null;
            
            // محاولة استخراج السعر من واجهة برمجة التطبيق
            try {
              const symbolInfo = tvWidget.chart().symbolExt();
              if (symbolInfo && symbolInfo.last) {
                priceValue = symbolInfo.last;
              }
            } catch (apiError) {
              console.warn('لم نتمكن من الحصول على السعر من API:', apiError);
            }
            
            // إذا فشلت محاولة API، نحاول استخراج السعر من العناصر المرئية
            if (!priceValue) {
              const priceElements = document.querySelectorAll('.pane-legend-line > .pane-legend-item-value');
              if (priceElements && priceElements.length > 0) {
                // السعر عادة في أول عنصر
                const priceText = priceElements[0].textContent;
                if (priceText) {
                  // تنظيف النص واستخراج الرقم
                  priceValue = parseFloat(priceText.replace(/[^\d.-]/g, ''));
                }
              }
            }

            if (priceValue !== null && !isNaN(priceValue)) {
              console.log('Current price from TradingView:', priceValue);
              window.dispatchEvent(
                new CustomEvent('tradingview-price-update', {
                  detail: { price: priceValue }
                })
              );
            }
          } catch (error) {
            console.error('Error extracting price from TradingView:', error);
          }
        }, 1000);

        // تنظيف interval عند إزالة المكون
        return () => clearInterval(extractPriceInterval);
      });
    }
  };

  return <div id="tradingview_chart" ref={container} style={{ height: 500, width: '100%' }}></div>;
};

export default TradingViewWidget;
