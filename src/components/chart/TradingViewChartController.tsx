import { useEffect, useRef } from 'react';
import { Loader2 } from "lucide-react";

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
  const priceUpdateInterval = useRef<any>(null);

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
      if (!container.current) return;

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

        const chart = widget.chart();
        
        const updatePrice = () => {
          try {
            const symbolInfo = chart.symbolExt();
            if (symbolInfo?.last && !isNaN(symbolInfo.last)) {
              console.log("Price from symbolInfo:", symbolInfo.last);
              onPriceUpdate(symbolInfo.last);
              return;
            }

            const price = chart.crossHairPrice();
            if (price && !isNaN(price)) {
              console.log("Price from crosshair:", price);
              onPriceUpdate(price);
            }
          } catch (error) {
            console.error("Error getting price:", error);
          }
        };

        // تحديث السعر كل ثانية
        updatePrice();
        priceUpdateInterval.current = setInterval(updatePrice, 1000);

        // متابعة تغيير الرمز
        chart.onSymbolChanged().subscribe(null, (symbolInfo: any) => {
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