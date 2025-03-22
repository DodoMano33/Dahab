
import { useState, useRef, useEffect } from 'react';
import { priceUpdater } from '@/utils/price/updater';

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
  const isComponentMountedRef = useRef<boolean>(true);
  const lastUpdateTimeRef = useRef<number>(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // استخدام Metal Price API لجلب السعر الحالي
  useEffect(() => {
    isComponentMountedRef.current = true;
    
    // وظيفة لتحديث السعر
    const updatePrice = async () => {
      try {
        // استخدام وظيفة تحديث السعر من priceUpdater
        const price = await priceUpdater.fetchPrice(symbol);
        if (price && isComponentMountedRef.current) {
          console.log('Metal Price API returned price:', price);
          
          // تحديث السعر فقط إذا تغير
          if (price !== currentPrice) {
            setCurrentPrice(price);
            setPriceUpdateCount(prev => prev + 1);
            lastUpdateTimeRef.current = Date.now();
            
            // إخطار المكونات الأخرى بتحديث السعر
            if (onPriceUpdate) {
              onPriceUpdate(price);
            }
            
            // إرسال حدث تحديث السعر للتطبيق
            window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
              detail: { price, symbol } 
            }));
          }
        }
      } catch (error) {
        console.error('Error updating price:', error);
      }
    };
    
    // تحديث السعر فورًا عند التحميل
    updatePrice();
    
    // تحديث السعر كل 10 ثوانٍ
    pollIntervalRef.current = setInterval(updatePrice, 10000);
    
    // تنظيف عند إلغاء المكون
    return () => {
      isComponentMountedRef.current = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [symbol, onPriceUpdate, currentPrice]);

  // الاستماع لتحديثات من priceUpdater
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent<any>) => {
      if (event.detail && event.detail.symbol === symbol && event.detail.price) {
        const newPrice = event.detail.price;
        
        if (newPrice !== currentPrice) {
          setCurrentPrice(newPrice);
          setPriceUpdateCount(prev => prev + 1);
          lastUpdateTimeRef.current = Date.now();
          
          if (onPriceUpdate) {
            onPriceUpdate(newPrice);
          }
        }
      }
    };
    
    window.addEventListener('metal-price-update', handlePriceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('metal-price-update', handlePriceUpdate as EventListener);
    };
  }, [symbol, onPriceUpdate, currentPrice]);
  
  return {
    currentPrice,
    priceUpdateCount
  };
};
