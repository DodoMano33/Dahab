
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
        // تحديد الرمز ليكون CFI:XAUUSD دائمًا
        if (event.data.name === 'symbol-change') {
          console.log('Symbol changed, but keeping CFI:XAUUSD as the only symbol');
          onSymbolChange?.('XAUUSD'); // نستخدم XAUUSD للواجهة ولكن داخليًا نستخدم CFI:XAUUSD
        }
        
        if (event.data.name === 'price-update') {
          const price = event.data.price;
          if (price === null || price === undefined || isNaN(price)) {
            console.warn('Received invalid price from TradingView:', price);
            return;
          }
          
          priceUpdateCountRef.current += 1;
          console.log(`★★★ Price updated from TradingView (${priceUpdateCountRef.current}):`, price, 'for CFI:XAUUSD');
          
          currentPriceRef.current = price;
          onPriceUpdate?.(price);
          
          // يرسل حدث تحديث السعر للمكونات الأخرى
          window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
            detail: { price, symbol: 'CFI:XAUUSD' }
          }));
          
          // استجابة لطلب السعر الحالي
          window.addEventListener('request-current-price', () => {
            if (currentPriceRef.current !== null) {
              window.dispatchEvent(new CustomEvent('current-price-response', {
                detail: { price: currentPriceRef.current }
              }));
            }
          });
          
          console.log('Current price saved in ref:', currentPriceRef.current);
        }
      } catch (error) {
        console.error('Error handling TradingView message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // عند التركيب، تأكد من أن TradingView يعرض CFI:XAUUSD
    const forcedSymbol = 'XAUUSD';
    if (symbol !== forcedSymbol) {
      console.log(`Forcing symbol to be ${forcedSymbol} internally (CFI:XAUUSD)`);
      onSymbolChange?.(forcedSymbol);
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [symbol, onSymbolChange, onPriceUpdate]);

  return {
    currentPrice: currentPriceRef.current,
    priceUpdateCount: priceUpdateCountRef.current
  };
};
