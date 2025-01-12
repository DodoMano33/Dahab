import { useEffect, useRef } from 'react';

interface TradingViewChartControllerProps {
  symbol: string;
  onReady: () => void;
  onPriceUpdate: (price: number) => void;
  onSymbolChange: (symbol: string) => void;
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
      });

      widgetRef.current = widget;

      widget.onChartReady(() => {
        console.log("TradingView chart is ready");
        onReady();
        
        // الحصول على الـ chart API من الـ widget
        const chart = widget.chart();
        
        const updatePrice = () => {
          try {
            // محاولة الحصول على السعر من معلومات الرمز
            const symbolInfo = widget.symbolInterval();
            if (symbolInfo?.last && !isNaN(symbolInfo.last)) {
              console.log("Price from symbolInfo:", symbolInfo.last);
              onPriceUpdate(symbolInfo.last);
              return;
            }

            // محاولة الحصول على السعر من موضع المؤشر
            const price = chart.price();
            if (price && !isNaN(price)) {
              console.log("Price from chart:", price);
              onPriceUpdate(price);
            }
          } catch (error) {
            console.error("Error getting price:", error);
          }
        };

        // تحديث السعر مباشرة
        updatePrice();

        // إعداد التحديث الدوري للسعر
        if (priceUpdateInterval.current) {
          clearInterval(priceUpdateInterval.current);
        }
        priceUpdateInterval.current = setInterval(updatePrice, 1000);

        // الاستماع لتغييرات الرمز
        widget.onSymbolChange().subscribe(null, (symbolInfo: { name: string }) => {
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

    // التنظيف عند إزالة المكون
    return () => {
      if (priceUpdateInterval.current) {
        clearInterval(priceUpdateInterval.current);
      }
      if (widgetRef.current) {
        widgetRef.current.remove();
      }
    };
  }, [symbol, onReady, onPriceUpdate, onSymbolChange]);

  return (
    <div className="relative w-full h-[500px] bg-white rounded-lg shadow-lg">
      <div id="tradingview_chart" ref={container} className="w-full h-full" />
    </div>
  );
};
