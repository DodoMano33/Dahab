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
  const priceUpdateInterval = useRef<any>(null);

  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;

    const initWidget = () => {
      if (!container.current) return;

      try {
        if (widgetRef.current) {
          widgetRef.current.remove();
          widgetRef.current = null;
        }

        const widget = new window.TradingView.widget({
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
          save_image: true,
          studies: ["MAExp@tv-basicstudies"],
          autosize: true,
          overrides: {
            "mainSeriesProperties.showPriceLine": true
          }
        });

        widgetRef.current = widget;

        widget.onChartReady(() => {
          console.log("Chart is ready");
          setIsLoading(false);

          const chart = widget.chart();
          
          // Handle symbol changes
          chart.onSymbolChanged().subscribe(null, (symbolInfo: any) => {
            console.log("Symbol changed to:", symbolInfo.name);
            onSymbolChange?.(symbolInfo.name);
            
            // Get initial price after symbol change
            const symbolData = chart.symbolExt();
            if (symbolData && symbolData.last_price) {
              console.log("Initial price after symbol change:", symbolData.last_price);
              onPriceUpdate?.(symbolData.last_price);
            }
          });

          // Setup price updates
          if (priceUpdateInterval.current) {
            clearInterval(priceUpdateInterval.current);
          }

          priceUpdateInterval.current = setInterval(() => {
            try {
              const symbolInfo = chart.symbolExt();
              if (symbolInfo && symbolInfo.last_price) {
                console.log("Current price update:", symbolInfo.last_price);
                onPriceUpdate?.(symbolInfo.last_price);
              }
            } catch (error) {
              console.error("Error updating price:", error);
            }
          }, 1000); // Update every second
        });

      } catch (error) {
        console.error("Error initializing TradingView widget:", error);
        setIsLoading(false);
      }
    };

    const loadTradingViewScript = async () => {
      try {
        if (window.TradingView) {
          initWidget();
          return;
        }

        scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = 'https://s3.tradingview.com/tv.js';
        scriptElement.async = true;
        
        scriptElement.onload = () => {
          console.log("TradingView script loaded successfully");
          initWidget();
        };
        
        scriptElement.onerror = (error) => {
          console.error("Error loading TradingView script:", error);
          setIsLoading(false);
        };
        
        document.head.appendChild(scriptElement);
      } catch (error) {
        console.error("Error in loadTradingViewScript:", error);
        setIsLoading(false);
      }
    };

    loadTradingViewScript();

    return () => {
      if (priceUpdateInterval.current) {
        clearInterval(priceUpdateInterval.current);
      }
      
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
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