
import { useEffect, useRef } from 'react';
import { priceUpdater } from '@/utils/priceUpdater';

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
    // بدلاً من الاستماع لرسائل TradingView، نستخدم Metal Price API مباشرة
    const fetchInitialPrice = async () => {
      try {
        const price = await priceUpdater.fetchPrice(symbol);
        if (price) {
          priceUpdateCountRef.current += 1;
          console.log(`★★★ تم تحديث السعر من Metal Price API (${priceUpdateCountRef.current}):`, price, 'للرمز:', symbol);
          
          currentPriceRef.current = price;
          onPriceUpdate?.(price);
          
          // إطلاق حدث تحديث السعر للمكونات الأخرى
          window.dispatchEvent(new CustomEvent('metal-price-update', { 
            detail: { price, symbol }
          }));
        }
      } catch (error) {
        console.error('خطأ في جلب السعر الأولي من Metal Price API:', error);
      }
    };

    fetchInitialPrice();

    // الاشتراك في تحديثات Metal Price API
    const handlePriceUpdated = (price: number) => {
      priceUpdateCountRef.current += 1;
      console.log(`★★★ تم تحديث السعر من Metal Price API (${priceUpdateCountRef.current}):`, price, 'للرمز:', symbol);
      
      currentPriceRef.current = price;
      onPriceUpdate?.(price);
    };
    
    const handlePriceError = (error: Error) => {
      console.error('خطأ في تحديث السعر من Metal Price API:', error);
    };
    
    // الاشتراك في تحديثات السعر
    priceUpdater.subscribe({
      symbol,
      onUpdate: handlePriceUpdated,
      onError: handlePriceError
    });
    
    // الاستماع لتحديثات السعر العامة
    const handleMetalPriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        priceUpdateCountRef.current += 1;
        currentPriceRef.current = event.detail.price;
        console.log('تم استلام تحديث السعر عبر حدث metal-price-update:', event.detail.price);
      }
    };
    
    window.addEventListener('metal-price-update', handleMetalPriceUpdate as EventListener);
    
    // تحديث السعر كل 30 ثانية
    const intervalId = setInterval(() => {
      priceUpdater.fetchPrice(symbol)
        .then(price => {
          if (price !== null) {
            handlePriceUpdated(price);
          }
        })
        .catch(error => {
          console.error('فشل في تحديث السعر من التحديث الدوري:', error);
        });
    }, 30000);

    return () => {
      window.removeEventListener('metal-price-update', handleMetalPriceUpdate as EventListener);
      priceUpdater.unsubscribe(symbol, handlePriceUpdated);
      clearInterval(intervalId);
    };
  }, [symbol, onSymbolChange, onPriceUpdate]);

  return {
    currentPrice: currentPriceRef.current,
    priceUpdateCount: priceUpdateCountRef.current
  };
};
