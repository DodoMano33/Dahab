
import { useState, useEffect } from 'react';
import { screenPriceReader } from '@/utils/price/screenReader';

// Hook لاستخدام قارئ السعر من الشاشة
export const usePriceReader = (interval: number = 1000) => {
  const [price, setPrice] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(false);

  // استماع لتحديثات السعر
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        setPrice(event.detail.price);
        
        // تحديث حالة السوق إذا كانت متوفرة في الحدث
        if (event.detail.isMarketOpen !== undefined) {
          setIsMarketOpen(event.detail.isMarketOpen);
        }
      }
    };

    // إضافة مستمعي الأحداث
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    
    // بدء قراءة السعر
    screenPriceReader.start(interval);
    setIsActive(true);
    
    // الحصول على حالة السوق الحالية
    setIsMarketOpen(screenPriceReader.isMarketOpenNow());
    
    // تنظيف عند الإلغاء
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      screenPriceReader.stop();
      setIsActive(false);
    };
  }, [interval]);

  const startReading = () => {
    screenPriceReader.start(interval);
    setIsActive(true);
  };

  const stopReading = () => {
    screenPriceReader.stop();
    setIsActive(false);
  };

  return {
    price,
    isActive,
    isMarketOpen,
    startReading,
    stopReading,
  };
};
