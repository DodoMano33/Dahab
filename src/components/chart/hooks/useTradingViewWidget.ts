
import { useState, useRef, useEffect } from 'react';
import { createMessageHandler, extractPriceFromDOM } from '../utils/tradingViewMessageHandler';

interface UseTradingViewWidgetProps {
  symbol: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

export const useTradingViewWidget = ({
  symbol,
  onSymbolChange,
  onPriceUpdate
}: UseTradingViewWidgetProps) => {
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const lastSymbolRef = useRef<string>(symbol);
  const lastPriceRef = useRef<number | null>(null);
  const widgetIdRef = useRef<string>(`tradingview_widget_${Date.now()}`);

  // Mark widget as loaded when script loads
  useEffect(() => {
    if (!containerRef.current || !scriptRef.current) return;

    const handleScriptLoad = () => {
      console.log("TradingView widget script loaded successfully");
      setWidgetLoaded(true);
      
      // Initial notification of current symbol
      if (onSymbolChange) {
        console.log("Initial symbol set to:", symbol);
        onSymbolChange(symbol);
      }
    };

    scriptRef.current.addEventListener('load', handleScriptLoad);

    return () => {
      if (scriptRef.current) {
        scriptRef.current.removeEventListener('load', handleScriptLoad);
      }
    };
  }, [symbol, onSymbolChange, scriptRef.current]);

  // Set up event listeners for symbol and price updates
  useEffect(() => {
    if (!widgetLoaded) return;

    const handleMessage = createMessageHandler({
      onSymbolChange,
      onPriceUpdate,
      lastSymbolRef,
      lastPriceRef
    });

    // Add event listener for messages
    window.addEventListener('message', handleMessage);

    return () => {
      // Clean up event listener on unmount
      window.removeEventListener('message', handleMessage);
    };
  }, [widgetLoaded, onSymbolChange, onPriceUpdate]);

  // Periodically check for price updates (as a fallback)
  useEffect(() => {
    if (!widgetLoaded || !containerRef.current) return;
    
    // Attempt to extract price from TradingView widget every 5 seconds
    const interval = setInterval(() => {
      if (containerRef.current) {
        extractPriceFromDOM(containerRef.current, lastPriceRef, onPriceUpdate);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [widgetLoaded, onPriceUpdate]);

  return {
    containerRef,
    scriptRef,
    widgetId: widgetIdRef.current,
    widgetLoaded
  };
};
