
import { useState, useEffect } from 'react';
import { screenPriceReader } from '@/utils/price/screenReader';

// Hook لاستخدام قارئ السعر من الشاشة
export const usePriceReader = (interval: number = 1000) => {
  const [price, setPrice] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  // استماع لتحديثات السعر
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        setPrice(event.detail.price);
      }
    };

    // إضافة مستمعي الأحداث
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    
    // بدء قراءة السعر
    screenPriceReader.start(interval);
    setIsActive(true);
    
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
    startReading,
    stopReading,
  };
};
