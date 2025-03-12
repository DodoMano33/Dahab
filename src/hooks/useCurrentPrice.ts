
import { useState, useEffect } from 'react';

export const useCurrentPrice = () => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);

  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        console.log('useCurrentPrice: Price updated to', event.detail.price);
        setCurrentPrice(event.detail.price);
        setPriceUpdateCount(prev => prev + 1);
      }
    };

    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    
    // طلب السعر الحالي فور تحميل المكون
    window.dispatchEvent(new Event('request-current-price'));
    
    // الاستماع لرد السعر الحالي
    const handleCurrentPriceResponse = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        console.log('useCurrentPrice: Received current price', event.detail.price);
        setCurrentPrice(event.detail.price);
        setPriceUpdateCount(prev => prev + 1);
      }
    };
    
    window.addEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
    
    // إعادة طلب السعر الحالي كل 30 ثانية كإجراء احتياطي
    const priceRefreshInterval = setInterval(() => {
      window.dispatchEvent(new Event('request-current-price'));
    }, 30000);
    
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
      clearInterval(priceRefreshInterval);
    };
  }, []);

  return { currentPrice, priceUpdateCount };
};
