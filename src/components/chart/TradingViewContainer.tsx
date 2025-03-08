
import React from 'react';

interface TradingViewContainerProps {
  widgetId: string;
  symbol: string;
  scriptRef: React.MutableRefObject<HTMLScriptElement | null>;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const TradingViewContainer: React.FC<TradingViewContainerProps> = ({
  widgetId,
  symbol,
  scriptRef,
  containerRef
}) => {
  React.useEffect(() => {
    // Clean up any existing widget to prevent duplicates
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Create the widget container structure
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.id = widgetId;
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = 'calc(100% - 32px)';
    widgetDiv.style.width = '100%';

    const copyright = document.createElement('div');
    copyright.className = 'tradingview-widget-copyright';
    copyright.innerHTML = '<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a>';

    // Append elements in the correct order
    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(copyright);

    // Create the script element
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = 'text/javascript';
    script.async = true;

    // Create the configuration object
    const config = {
      autosize: true,
      symbol: symbol,
      interval: "1",
      timezone: "Asia/Jerusalem",
      theme: "dark",
      style: "1",
      locale: "en",
      hide_legend: true,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      hide_volume: true,
      support_host: "https://www.tradingview.com"
    };

    // Set the script content
    script.innerHTML = JSON.stringify(config);
    
    // Save script reference to prevent duplicates
    scriptRef.current = script;
    
    // Append the script to the widget container
    widgetContainer.appendChild(script);

    // Clear existing content and append new widget
    if (containerRef.current) {
      containerRef.current.appendChild(widgetContainer);
    }

    return () => {
      // Clean up on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, containerRef, widgetId, scriptRef]);

  return null;
};
