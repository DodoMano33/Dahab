
import { useEffect, useRef, useState } from 'react';
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
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);
  const intervalIdRef = useRef<number | null>(null);
  const isComponentMountedRef = useRef<boolean>(true);
  const lastUpdateTimeRef = useRef<number>(0);
  const priceCache = useRef<Record<string, { price: number, timestamp: number }>>({});

  useEffect(() => {
    isComponentMountedRef.current = true;
    
    // بدلاً من الاستماع لرسائل TradingView، نستخدم Metal Price API مباشرة
    const fetchInitialPrice = async () => {
      if (!isComponentMountedRef.current) return;
      
      try {
        // تحقق من وجود سعر مخزن مؤقتًا حديث (أقل من 60 ثانية)
        const now = Date.now();
        const cachedData = priceCache.current[symbol];
        const isCacheValid = cachedData && (now - cachedData.timestamp < 60000);
        
        if (isCacheValid) {
          console.log(`استخدام السعر المخزن مؤقتًا للرمز ${symbol}:`, cachedData.price);
          setCurrentPrice(cachedData.price);
          onPriceUpdate?.(cachedData.price);
          return;
        }
        
        console.log(`بدء محاولة جلب السعر للرمز ${symbol} من Metal Price API`);
        const price = await priceUpdater.fetchPrice(symbol);
        
        if (price && isComponentMountedRef.current) {
          setPriceUpdateCount(prev => prev + 1);
          console.log(`تم تحديث السعر من Metal Price API:`, price, 'للرمز:', symbol);
          
          setCurrentPrice(price);
          onPriceUpdate?.(price);
          
          // تخزين السعر مؤقتًا
          priceCache.current[symbol] = { price, timestamp: now };
          
          // إطلاق حدث تحديث السعر للمكونات الأخرى
          window.dispatchEvent(new CustomEvent('metal-price-update', { 
            detail: { price, symbol }
          }));
          
          lastUpdateTimeRef.current = now;
        }
      } catch (error) {
        console.error('خطأ في جلب السعر الأولي من Metal Price API:', error);
      }
    };

    fetchInitialPrice();

    // الاشتراك في تحديثات Metal Price API
    const handlePriceUpdated = (price: number) => {
      if (!isComponentMountedRef.current) return;
      
      const now = Date.now();
      // منع التحديثات المتكررة جدًا (الحد الأدنى 10 ثواني بين التحديثات)
      if (now - lastUpdateTimeRef.current < 10000) {
        return;
      }
      
      setPriceUpdateCount(prev => prev + 1);
      setCurrentPrice(price);
      onPriceUpdate?.(price);
      
      // تخزين السعر مؤقتًا
      priceCache.current[symbol] = { price, timestamp: now };
      lastUpdateTimeRef.current = now;
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
    
    // تحديث السعر كل 60 ثانية
    intervalIdRef.current = window.setInterval(() => {
      if (!isComponentMountedRef.current) return;
      
      const now = Date.now();
      // تحقق من الوقت المنقضي منذ آخر تحديث
      if (now - lastUpdateTimeRef.current < 60000) {
        return;
      }
      
      priceUpdater.fetchPrice(symbol)
        .then(price => {
          if (price !== null && isComponentMountedRef.current) {
            handlePriceUpdated(price);
          }
        })
        .catch(error => {
          console.error('فشل في تحديث السعر من التحديث الدوري:', error);
        });
    }, 60000);

    return () => {
      console.log('تنظيف موارد useTradingViewMessages');
      isComponentMountedRef.current = false;
      
      priceUpdater.unsubscribe(symbol, handlePriceUpdated);
      
      if (intervalIdRef.current !== null) {
        window.clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [symbol, onSymbolChange, onPriceUpdate]);

  return {
    currentPrice,
    priceUpdateCount
  };
};
