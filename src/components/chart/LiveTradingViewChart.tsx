import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    TradingView: any;
    tvWidget: any;
  }
}

interface LiveTradingViewChartProps {
  symbol: string;
  timeframe?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

export const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ 
  symbol = "XAUUSD",
  timeframe = "D",
  onSymbolChange,
  onPriceUpdate
}) => {
  const container = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let widget: any = null;
    let scriptElement: HTMLScriptElement | null = null;

    const initWidget = () => {
      if (!container.current) return;

      try {
        widget = new window.TradingView.widget({
          container_id: "tradingview_chart",
          width: "100%",
          height: 500,
          symbol: symbol,
          interval: timeframe,
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "ar",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          studies: [
            { id: "MAExp@tv-basicstudies", inputs: { length: 200 } }
          ],
          autosize: true,
          overrides: {
            "mainSeriesProperties.showPriceLine": true
          }
        });

        window.tvWidget = widget;

        widget.onChartReady(() => {
          console.log("Chart is ready");
          setIsLoading(false);

          const chart = widget.chart();
          
          // Listen for symbol changes
          chart.onSymbolChanged().subscribe(null, (symbolInfo: any) => {
            console.log("Symbol changed to:", symbolInfo.name);
            onSymbolChange?.(symbolInfo.name);
          });

          // Set up price update interval
          const updatePrice = () => {
            const lastBar = chart.getLastBar();
            if (lastBar) {
              const lastPrice = lastBar.close;
              console.log("Current price:", lastPrice);
              onPriceUpdate?.(lastPrice);
            }
          };

          const priceInterval = setInterval(updatePrice, 5000);
          updatePrice(); // Initial price update

          // Cleanup interval on chart ready
          return () => clearInterval(priceInterval);
        });

      } catch (error) {
        console.error("Error initializing TradingView widget:", error);
        setIsLoading(false);
      }
    };

    const loadTradingViewScript = () => {
      if (window.TradingView) {
        initWidget();
        return;
      }

      scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.src = 'https://s3.tradingview.com/tv.js';
      scriptElement.async = true;
      scriptElement.onload = () => {
        console.log("TradingView script loaded");
        initWidget();
      };
      scriptElement.onerror = (error) => {
        console.error("Error loading TradingView script:", error);
        setIsLoading(false);
      };
      document.head.appendChild(scriptElement);
    };

    loadTradingViewScript();

    // Cleanup function
    return () => {
      if (widget) {
        try {
          if (window.tvWidget === widget) {
            delete window.tvWidget;
          }
          widget.remove();
        } catch (error) {
          console.error("Error cleaning up widget:", error);
        }
      }

      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, [symbol, timeframe, onSymbolChange, onPriceUpdate]);

  return (
    <div className="relative w-full h-[500px] bg-white rounded-lg shadow-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">جاري تحميل الشارت...</p>
          </div>
        </div>
      )}
      <div id="tradingview_chart" ref={container} className="w-full h-full" />
    </div>
  );
};