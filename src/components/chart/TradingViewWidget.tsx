
import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
  setSymbol?: (symbol: string) => void;  // Added to allow setting symbol from parent
}

function TradingViewWidget({ 
  symbol = "CAPITALCOM:GOLD",
  onSymbolChange,
  onPriceUpdate,
  setSymbol
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const symbolRef = useRef<string>(symbol);

  // Update chart when symbol prop changes from outside
  useEffect(() => {
    if (symbol && symbol !== symbolRef.current) {
      symbolRef.current = symbol;
      try {
        console.log("Setting TradingView symbol to:", symbol);
        const tvWidget = (window as any).tvWidget;
        if (tvWidget && tvWidget.chart && tvWidget.chart()) {
          tvWidget.chart().setSymbol(symbol);
        } else {
          console.warn("TradingView widget not ready yet, symbol will be set on init:", symbol);
        }
      } catch (error) {
        console.error("Error updating TradingView symbol:", error);
      }
    }
  }, [symbol]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = 'text/javascript';
    script.async = true;

    // Create the configuration object
    const config = {
      autosize: true,
      symbol: symbolRef.current,
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

    // Create widget container structure
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = 'calc(100% - 32px)';
    widgetDiv.style.width = '100%';

    const copyright = document.createElement('div');
    copyright.className = 'tradingview-widget-copyright';
    copyright.innerHTML = '<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a>';

    // Append elements in the correct order
    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(copyright);
    widgetContainer.appendChild(script);

    // Clear existing content and append new widget
    if (container.current) {
      container.current.innerHTML = '';
      container.current.appendChild(widgetContainer);
    }

    // Store reference to widget
    widgetRef.current = widgetDiv;

    // Add event listeners for symbol and price updates
    const handleMessage = (event: MessageEvent) => {
      try {
        // Handle symbol change from TradingView
        if (event.data && event.data.name === 'tv-symbol-change') {
          const newSymbol = event.data.symbol;
          console.log('TradingView symbol changed to:', newSymbol);
          
          if (onSymbolChange && newSymbol) {
            // Extract pure symbol name (without exchange prefix)
            const purifiedSymbol = newSymbol.includes(':') 
              ? newSymbol.split(':')[1] 
              : newSymbol;
              
            onSymbolChange(purifiedSymbol);
          }
        }
        
        // Handle price update from TradingView
        if (event.data && event.data.name === 'tv-price-update') {
          const price = parseFloat(event.data.price);
          console.log('TradingView price updated to:', price);
          
          if (onPriceUpdate && !isNaN(price)) {
            onPriceUpdate(price);
          }
        }
      } catch (error) {
        console.error('Error handling TradingView message:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    // Add custom script to hook into TradingView events
    const customScript = document.createElement('script');
    customScript.innerHTML = `
      window.addEventListener('DOMContentLoaded', function() {
        window.addEventListener('message', function(e) {
          if (e.data && e.data.method === 'symbolChanged') {
            window.postMessage({
              name: 'tv-symbol-change',
              symbol: e.data.params[0]
            }, '*');
            
            // Try to get current price after symbol change
            try {
              setTimeout(function() {
                if (window.tvWidget && window.tvWidget.chart) {
                  const price = window.tvWidget.activeChart().crosshairPrice();
                  if (price) {
                    window.postMessage({
                      name: 'tv-price-update',
                      price: price
                    }, '*');
                  }
                }
              }, 1000);
            } catch (err) {
              console.error('Error getting price:', err);
            }
          }
        });
        
        // Poll for price updates
        setInterval(function() {
          try {
            if (window.tvWidget && window.tvWidget.activeChart) {
              const chart = window.tvWidget.activeChart();
              if (chart) {
                const price = chart.crosshairPrice();
                if (price) {
                  window.postMessage({
                    name: 'tv-price-update',
                    price: price
                  }, '*');
                }
              }
            }
          } catch (err) {
            // Silent error - widget might not be ready
          }
        }, 2000);

        // Add global method to set the symbol
        window.setTradingViewSymbol = function(symbol) {
          try {
            if (window.tvWidget && window.tvWidget.chart && window.tvWidget.chart()) {
              console.log("Setting TradingView symbol via global method:", symbol);
              window.tvWidget.chart().setSymbol(symbol);
              return true;
            }
          } catch (err) {
            console.error("Error in setTradingViewSymbol:", err);
          }
          return false;
        };
      });
    `;
    document.head.appendChild(customScript);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (document.head.contains(customScript)) {
        document.head.removeChild(customScript);
      }
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div 
        ref={container}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}

export default TradingViewWidget;
