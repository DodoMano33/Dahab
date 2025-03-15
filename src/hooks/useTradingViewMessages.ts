
import { useEffect, useRef } from 'react';
import { usePriceReader } from './usePriceReader';

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
  const { price: screenPrice } = usePriceReader(500); // تحديث كل نصف ثانية لزيادة الدقة

  // إضافة مستمع للسعر المباشر من TradingView
  useEffect(() => {
    const handleDirectTVPrice = (event: CustomEvent) => {
      if (event.detail && typeof event.detail.price === 'number') {
        const directPrice = event.detail.price;
        currentPriceRef.current = directPrice;
        priceUpdateCountRef.current += 1;
        console.log(`★★★ Direct price from TradingView (${priceUpdateCountRef.current}):`, directPrice, 'for XAUUSD');
        
        if (onPriceUpdate) {
          onPriceUpdate(directPrice);
        }
        
        // إرسال حدث تحديث السعر - نقل السعر دون تعديل للحفاظ على الدقة
        window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
          detail: { price: directPrice, symbol: 'XAUUSD' }
        }));
      }
    };
    
    window.addEventListener('tradingview-direct-price', handleDirectTVPrice as EventListener);
    return () => {
      window.removeEventListener('tradingview-direct-price', handleDirectTVPrice as EventListener);
    };
  }, [onPriceUpdate]);

  // استماع لتحديثات السعر من قارئ الشاشة كاحتياط
  useEffect(() => {
    // تحديث السعر من قارئ الشاشة إذا كان متاحًا
    if (screenPrice !== null) {
      currentPriceRef.current = screenPrice;
      priceUpdateCountRef.current += 1;
      console.log(`★★★ Price updated from Screen Reader (${priceUpdateCountRef.current}):`, screenPrice, 'for XAUUSD');
      
      if (onPriceUpdate) {
        onPriceUpdate(screenPrice);
      }
      
      // إرسال حدث تحديث السعر
      window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
        detail: { price: screenPrice, symbol: 'XAUUSD' }
      }));
    }
  }, [screenPrice, onPriceUpdate]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        // تحديد الرمز ليكون XAUUSD دائمًا
        if (event.data.name === 'symbol-change') {
          console.log('Symbol changed, but keeping XAUUSD as the only symbol');
          onSymbolChange?.('XAUUSD');
        }
        
        if (event.data.name === 'price-update') {
          const price = event.data.price;
          if (price === null || price === undefined || isNaN(price)) {
            console.warn('Received invalid price from TradingView:', price);
            return;
          }
          
          // استخدم سعر TradingView فقط إذا لم يكن هناك سعر من قارئ الشاشة
          if (screenPrice === null) {
            priceUpdateCountRef.current += 1;
            console.log(`★★★ Price updated from TradingView (${priceUpdateCountRef.current}):`, price, 'for XAUUSD');
            
            currentPriceRef.current = price;
            onPriceUpdate?.(price);
            
            // يرسل حدث تحديث السعر للمكونات الأخرى
            window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
              detail: { price, symbol: 'XAUUSD' }
            }));
          }
        }
      } catch (error) {
        console.error('Error handling TradingView message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // عند التركيب، تأكد من أن TradingView يعرض XAUUSD
    const forcedSymbol = 'XAUUSD';
    if (symbol !== forcedSymbol) {
      console.log(`Forcing symbol to be ${forcedSymbol} instead of ${symbol}`);
      onSymbolChange?.(forcedSymbol);
    }

    // معالج لطلبات السعر الحالي
    const handleCurrentPriceRequest = () => {
      // استخدم سعر الشاشة أولاً، ثم سعر TradingView
      const finalPrice = screenPrice !== null ? screenPrice : currentPriceRef.current;
      
      if (finalPrice !== null) {
        console.log('Responding to current price request with:', finalPrice);
        window.dispatchEvent(new CustomEvent('current-price-response', {
          detail: { 
            price: finalPrice,
            symbol: 'XAUUSD'
          }
        }));
      } else {
        console.log('No current price available to respond to request');
      }
    };

    window.addEventListener('request-current-price', handleCurrentPriceRequest);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('request-current-price', handleCurrentPriceRequest);
    };
  }, [symbol, onSymbolChange, onPriceUpdate, screenPrice]);

  return {
    currentPrice: screenPrice || currentPriceRef.current,
    priceUpdateCount: priceUpdateCountRef.current
  };
};
