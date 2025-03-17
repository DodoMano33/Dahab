
import { useEffect, useRef } from 'react';

interface TradingViewChartControllerProps {
  symbol: string;
  onReady: () => void;
  onPriceUpdate: (price: number) => void;
  onSymbolChange: (symbol: string) => void;
}

declare global {
  interface Window {
    TradingView: {
      widget: new (config: any) => any;
    };
  }
}

export const TradingViewChartController = ({
  symbol,
  onReady,
  onPriceUpdate,
  onSymbolChange
}: TradingViewChartControllerProps) => {
  const container = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const priceUpdateInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadTradingViewScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.TradingView) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initWidget = () => {
      if (!container.current || !window.TradingView) return;
      
      const widget = new window.TradingView.widget({
        container_id: "tradingview_chart",
        width: "100%",
        height: 500,
        symbol: symbol,
        interval: "D",
        timezone: "Etc/UTC",
        theme: "light",
        style: "1",
        locale: "ar",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        save_image: true,
        studies: ["MAExp@tv-basicstudies"],
        autosize: true,
        hide_price_scale: true,          // إخفاء مقياس الأسعار
        hide_left_price_scale: true,     // إخفاء مقياس الأسعار على اليسار تحديدًا
        scale_padding: 0,                // إزالة أي مساحة للمقياس
        disabled_features: [
          "header_symbol_search",
          "header_compare",
          "left_toolbar",
          "show_left_price_scale",       // تعطيل عرض مقياس الأسعار على اليسار
          "left_price_scale",            // تعطيل مقياس الأسعار اليساري نفسه
          "scale_left",                  // تعطيل المقياس اليساري
          "scales_date_format"           // تعطيل تنسيق المقياس
        ]
      });

      widgetRef.current = widget;

      widget.onChartReady(() => {
        console.log("TradingView chart is ready");
        onReady();
        
        const updatePrice = () => {
          try {
            if (!widgetRef.current) return;
            
            const chart = widgetRef.current.chart();
            const currentPrice = chart.crosshairPrice();
            
            if (currentPrice && !isNaN(currentPrice)) {
              console.log("Price from chart:", currentPrice);
              onPriceUpdate(currentPrice);
            } else {
              // محاولة استخراج السعر من عناصر واجهة المستخدم المرئية
              const chartContainer = document.getElementById('tradingview_chart');
              if (chartContainer) {
                // محاولة استخراج السعر من عنصر القيمة ذو الخط الأكبر
                const mainPriceElement = chartContainer.querySelector('.tv-symbol-price-quote__value');
                if (mainPriceElement) {
                  const priceText = mainPriceElement.textContent || '';
                  const price = parseFloat(priceText.replace(',', ''));
                  if (!isNaN(price)) {
                    console.log("Price from main UI element:", price);
                    onPriceUpdate(price);
                    return;
                  }
                }
                
                // محاولة بديلة باستخدام العناصر الأخرى
                const alternativePriceElement = chartContainer.querySelector('.tv-ticker-item-last__last');
                if (alternativePriceElement) {
                  const priceText = alternativePriceElement.textContent || '';
                  const price = parseFloat(priceText.replace(',', ''));
                  if (!isNaN(price)) {
                    console.log("Price from alternative UI element:", price);
                    onPriceUpdate(price);
                  }
                }
              }
            }
          } catch (error) {
            console.error("Error getting price:", error);
          }
        };

        // Update price immediately
        updatePrice();

        // Set up periodic price updates
        if (priceUpdateInterval.current) {
          clearInterval(priceUpdateInterval.current);
        }
        priceUpdateInterval.current = setInterval(updatePrice, 1000);

        // Listen for symbol changes
        widget.chart().onSymbolChanged().subscribe(null, (symbolInfo: { name: string }) => {
          const newSymbol = symbolInfo.name;
          console.log("Symbol changed to:", newSymbol);
          onSymbolChange(newSymbol);
          updatePrice();
        });
      });
    };

    const initialize = async () => {
      try {
        await loadTradingViewScript();
        initWidget();
      } catch (error) {
        console.error("Error initializing TradingView:", error);
      }
    };

    initialize();

    // Cleanup
    return () => {
      if (priceUpdateInterval.current) {
        clearInterval(priceUpdateInterval.current);
      }
      if (widgetRef.current) {
        try {
          const element = document.getElementById('tradingview_chart');
          if (element) {
            element.innerHTML = '';
          }
        } catch (error) {
          console.error("Error cleaning up TradingView widget:", error);
        }
      }
    };
  }, [symbol, onReady, onPriceUpdate, onSymbolChange]);

  return (
    <div className="relative w-full h-[500px] bg-white rounded-lg shadow-lg">
      <div id="tradingview_chart" ref={container} className="w-full h-full" />
    </div>
  );
};
