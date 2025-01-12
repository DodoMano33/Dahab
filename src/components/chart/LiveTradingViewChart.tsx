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
        
        // تحديث السعر الأولي
        const updatePrice = () => {
          try {
            const symbolInfo = chart.symbolExt();
            const lastPrice = symbolInfo?.last;
            if (lastPrice && !isNaN(lastPrice)) {
              console.log("Current price from chart:", lastPrice);
              onPriceUpdate?.(lastPrice);
            } else {
              const crosshairPrice = chart.crossHairPrice();
              if (crosshairPrice && !isNaN(crosshairPrice)) {
                console.log("Current price from crosshair:", crosshairPrice);
                onPriceUpdate?.(crosshairPrice);
              }
            }
          } catch (error) {
            console.error("Error getting price from chart:", error);
          }
        };

        // تحديث السعر كل ثانية
        if (priceUpdateInterval.current) {
          clearInterval(priceUpdateInterval.current);
        }
        updatePrice(); // تحديث فوري
        priceUpdateInterval.current = setInterval(updatePrice, 1000);
        
        // متابعة تغيير الرمز
        chart.onSymbolChanged().subscribe(null, (symbolInfo: any) => {
          console.log("Symbol changed to:", symbolInfo.name);
          onSymbolChange?.(symbolInfo.name);
          updatePrice(); // تحديث السعر عند تغيير الرمز
        });
      });

    } catch (error) {
      console.error("Error initializing TradingView widget:", error);
      setIsLoading(false);
    }
  };

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

    const initializeChart = async () => {
      try {
        await loadTradingViewScript();
        console.log("TradingView script loaded successfully");
        initWidget();
      } catch (error) {
        console.error("Error loading TradingView script:", error);
        setIsLoading(false);
      }
    };

    initializeChart();

    return () => {
      if (priceUpdateInterval.current) {
        clearInterval(priceUpdateInterval.current);
      }
      
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
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