
import { useEffect, useRef, useState } from 'react';

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
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const currentPriceRef = useRef<number | null>(null);
  const priceUpdateCountRef = useRef<number>(0);
  const lastPriceUpdateTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        // تحديد الرمز ليكون XAUUSD دائمًا
        if (event.data && event.data.name === 'symbol-change') {
          console.log('Symbol changed, but keeping XAUUSD as the only symbol');
          onSymbolChange?.('XAUUSD');
        }
        
        if (event.data && event.data.name === 'price-update' && 
            event.data.price !== undefined && event.data.price !== null) {
          
          const price = Number(event.data.price);
          if (isNaN(price)) {
            console.warn('Received invalid price from TradingView:', event.data.price);
            return;
          }
          
          priceUpdateCountRef.current += 1;
          lastPriceUpdateTimeRef.current = new Date();
          
          console.log(`★★★ Price updated from TradingView (${priceUpdateCountRef.current}):`, 
                      price, 'for XAUUSD at', lastPriceUpdateTimeRef.current.toISOString());
          
          // تحديث السعر في الحالة والمرجع
          setCurrentPrice(price);
          currentPriceRef.current = price;
          
          // استدعاء معالج التحديث إذا تم توفيره
          onPriceUpdate?.(price);
          
          // نشر حدث تحديث السعر للمكونات الأخرى
          window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
            detail: { price, symbol: 'XAUUSD', timestamp: new Date().toISOString() }
          }));
        }
      } catch (error) {
        console.error('Error handling TradingView message:', error);
      }
    };

    // إضافة مستمع رسائل global
    window.addEventListener('message', handleMessage);
    
    // إضافة مستمع لطلبات السعر الحالي
    const handleCurrentPriceRequest = () => {
      if (currentPriceRef.current !== null) {
        console.log('Responding to current-price request with:', currentPriceRef.current);
        window.dispatchEvent(new CustomEvent('current-price-response', {
          detail: { 
            price: currentPriceRef.current,
            timestamp: lastPriceUpdateTimeRef.current?.toISOString() || new Date().toISOString()
          }
        }));
      } else {
        console.log('Received price request but no price is available yet');
      }
    };
    
    window.addEventListener('request-current-price', handleCurrentPriceRequest);
    
    // عند التركيب، تأكد من أن TradingView يعرض XAUUSD
    const forcedSymbol = 'XAUUSD';
    if (symbol !== forcedSymbol) {
      console.log(`Forcing symbol to be ${forcedSymbol} instead of ${symbol}`);
      onSymbolChange?.(forcedSymbol);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('request-current-price', handleCurrentPriceRequest);
    };
  }, [symbol, onSymbolChange, onPriceUpdate]);

  return {
    currentPrice,
    priceUpdateCount: priceUpdateCountRef.current,
    lastPriceUpdateTime: lastPriceUpdateTimeRef.current
  };
};
