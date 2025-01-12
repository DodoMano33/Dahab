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
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    let priceInterval: NodeJS.Timeout;

    const initWidget = () => {
      if (!container.current) return;

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (typeof window.TradingView !== 'undefined') {
          widgetRef.current = new window.TradingView.widget({
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
            container_id: "tradingview_chart",
            studies: [
              { id: "MAExp@tv-basicstudies", inputs: { length: 200 } }
            ],
            autosize: true,
            overrides: {
              "mainSeriesProperties.showPriceLine": true
            }
          });

          window.tvWidget = widgetRef.current;

          // Listen for iframe load event
          if (widgetRef.current.iframe) {
            widgetRef.current.iframe.addEventListener('load', () => {
              console.log("TradingView chart iframe loaded");
              setIsLoading(false);

              // Wait for chart to be ready
              const initChartData = () => {
                try {
                  if (widgetRef.current && widgetRef.current.chart && typeof widgetRef.current.chart === 'function') {
                    const chart = widgetRef.current.chart();
                    
                    // Listen for symbol changes
                    chart.onSymbolChanged().subscribe(null, (symbolInfo: any) => {
                      console.log("Symbol changed to:", symbolInfo.name);
                      onSymbolChange?.(symbolInfo.name);
                    });

                    // Set up price update interval
                    const updatePrice = () => {
                      if (chart.getLastBar) {
                        const lastBar = chart.getLastBar();
                        if (lastBar) {
                          const lastPrice = lastBar.close;
                          console.log("Current price:", lastPrice);
                          onPriceUpdate?.(lastPrice);
                        }
                      }
                    };

                    // Update price every 5 seconds
                    priceInterval = setInterval(updatePrice, 5000);
                    updatePrice(); // Initial price update
                  } else {
                    // If chart is not ready yet, try again in 100ms
                    setTimeout(initChartData, 100);
                  }
                } catch (error) {
                  console.error("Error initializing chart data:", error);
                }
              };

              initChartData();
            });
          }
        }
      };
      
      container.current.appendChild(script);
    };

    initWidget();

    return () => {
      if (priceInterval) {
        clearInterval(priceInterval);
      }
      
      // Safely cleanup widget
      if (widgetRef.current) {
        try {
          // Remove from window object first
          if (window.tvWidget === widgetRef.current) {
            delete window.tvWidget;
          }
          
          // Only call remove if the widget exists and has a remove method
          if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
            widgetRef.current.remove();
          }
          
          widgetRef.current = null;
        } catch (error) {
          console.error("Error cleaning up TradingView widget:", error);
        }
      }
      
      // Clean up container
      if (container.current) {
        while (container.current.firstChild) {
          container.current.removeChild(container.current.firstChild);
        }
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