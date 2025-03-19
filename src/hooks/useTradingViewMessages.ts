
import { useEffect, useRef } from 'react';

interface UseTradingViewMessagesProps {
  symbol: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

export const useTradingViewMessages = ({
  symbol,
  onSymbolChange,
  onPriceUpdate
}: UseTradingViewMessagesProps) => {
  const currentPriceRef = useRef<number | null>(null);
  const priceUpdateCountRef = useRef<number>(0);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (event.data.name === 'symbol-change') {
          console.log('Symbol changed to:', event.data.symbol);
          onSymbolChange?.(event.data.symbol);
        }
        if (event.data.name === 'price-update') {
          const price = event.data.price;
          if (price === null || price === undefined || isNaN(price)) {
            console.warn('Received invalid price from TradingView:', price);
            return;
          }
          
          priceUpdateCountRef.current += 1;
          console.log(`★★★ Price updated from TradingView (${priceUpdateCountRef.current}):`, price, 'for symbol:', symbol);
          
          currentPriceRef.current = price;
          onPriceUpdate?.(price);
          
          window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
            detail: { price, symbol }
          }));
          
          console.log('Current price saved in ref:', currentPriceRef.current);
        }
      } catch (error) {
        console.error('Error handling TradingView message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [symbol, onSymbolChange, onPriceUpdate]);

  return {
    currentPrice: currentPriceRef.current,
    priceUpdateCount: priceUpdateCountRef.current
  };
};
