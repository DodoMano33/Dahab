
/**
 * Hook for managing TradingView chart setup and lifecycle
 */
import { useEffect, useRef } from 'react';
import { createTradingViewWidget } from '@/utils/tradingview/chartSetup';
import { 
  initPriceCapture, 
  requestInitialPrice, 
  setupPriceUpdateChecker 
} from '@/utils/tradingview/priceUpdater';
import { cleanupPriceCapture } from '@/utils/price/screenshotPriceExtractor';

interface UseTradingViewChartProps {
  symbol?: string;
  onPriceUpdate?: (price: number) => void;
}

export const useTradingViewChart = ({ 
  symbol = "XAUUSD",
  onPriceUpdate 
}: UseTradingViewChartProps = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPriceRef = useRef<number | null>(null);
  const priceProvider = "CFI";

  useEffect(() => {
    if (!containerRef.current) return;
    
    console.log('TradingViewWidget mounted with symbol:', symbol, 'provider:', priceProvider);
    
    // Create and setup the TradingView widget
    const { widgetDiv } = createTradingViewWidget(containerRef.current, symbol, priceProvider);
    
    // Start price capture with timers
    const startCaptureTimer = initPriceCapture();
    
    // Schedule multiple initial price requests to ensure we get a price
    const initialPriceTimer = setTimeout(requestInitialPrice, 3000);
    const secondPriceTimer = setTimeout(requestInitialPrice, 5000);
    const thirdPriceTimer = setTimeout(requestInitialPrice, 8000);
    
    // Setup periodic price update checker
    const priceUpdateChecker = setupPriceUpdateChecker(currentPriceRef, priceProvider);

    return () => {
      // Cleanup all timers
      clearTimeout(startCaptureTimer);
      clearTimeout(initialPriceTimer);
      clearTimeout(secondPriceTimer);
      clearTimeout(thirdPriceTimer);
      clearInterval(priceUpdateChecker);
      
      // Stop and cleanup price capture
      cleanupPriceCapture();
      
      // Clean container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, onPriceUpdate]);

  return {
    containerRef,
    currentPriceRef
  };
};
