
import React, { useEffect, useRef } from 'react';

interface ChartInitializerProps {
  forcedSymbol: string;
  onChartReady: () => void;
  onPriceExtraction: (price: number) => void;
}

export const ChartInitializer: React.FC<ChartInitializerProps> = ({ 
  forcedSymbol,
  onChartReady,
  onPriceExtraction
}) => {
  const container = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const chartReadyRef = useRef<boolean>(false);

  useEffect(() => {
    if (!container.current) return;
    
    console.log('Initializing TradingView widget');
    const config = {
      autosize: true,
      symbol: `OANDA:${forcedSymbol}`,
      interval: "1",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      details: true,
      hotlist: true,
      calendar: true,
      studies: ["MASimple@tv-basicstudies"],
      container_id: "tradingview_widget",
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user",
      debug: true
    };
    
    try {
      if (container.current) {
        container.current.innerHTML = '';
      }
      
      const widget = new window.TradingView.widget(config);
      widgetRef.current = widget;
      window.tvWidget = widget;
      
      widget.onChartReady(() => {
        console.log('TradingView chart is ready');
        chartReadyRef.current = true;
        onChartReady();
        
        try {
          const chart = widget.chart();
          const symbolInfo = chart.symbol();
          console.log('Current symbol:', symbolInfo);
          
          const directPrice = chart.crosshairPrice();
          if (directPrice && !isNaN(directPrice)) {
            console.log('Extracted price directly from chart:', directPrice);
            onPriceExtraction(directPrice);
          }
        } catch (chartApiError) {
          console.warn('Error accessing chart API on ready:', chartApiError);
        }
      });
      
    } catch (widgetError) {
      console.error('Error initializing TradingView widget:', widgetError);
    }
    
    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [forcedSymbol, onChartReady, onPriceExtraction]);

  return (
    <div 
      id="tradingview_widget"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    />
  );
};
