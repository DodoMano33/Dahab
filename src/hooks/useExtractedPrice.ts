
import { useState, useEffect } from 'react';
import { getLastExtractedPrice } from '@/utils/price/capture/state';
import { extractPriceFromChart } from '@/utils/price/capture/priceExtractor';

interface UseExtractedPriceOptions {
  onPriceChange?: (price: number) => void;
  defaultPrice?: number | null;
}

export const useExtractedPrice = (options: UseExtractedPriceOptions = {}) => {
  const { onPriceChange, defaultPrice } = options;
  
  const [extractedPrice, setExtractedPrice] = useState<number | null>(null);
  
  // استخراج السعر من الشارت عند التحميل
  useEffect(() => {
    const fetchPrice = async () => {
      // التحقق من وجود سعر مستخرج سابقًا أولاً
      const lastPrice = getLastExtractedPrice();
      if (lastPrice !== null) {
        setExtractedPrice(lastPrice);
        onPriceChange?.(lastPrice);
        return;
      }
      
      // استخراج سعر جديد من الشارت
      const newPrice = await extractPriceFromChart();
      if (newPrice !== null) {
        setExtractedPrice(newPrice);
        onPriceChange?.(newPrice);
        return;
      }
      
      // استخدام السعر الافتراضي كخيار أخير
      if (defaultPrice !== null && defaultPrice !== undefined) {
        setExtractedPrice(defaultPrice);
        onPriceChange?.(defaultPrice);
      }
    };
    
    fetchPrice();
    
    // جدولة تحديث متكرر
    const interval = setInterval(async () => {
      const newPrice = await extractPriceFromChart();
      if (newPrice !== null && newPrice !== extractedPrice) {
        setExtractedPrice(newPrice);
        onPriceChange?.(newPrice);
      }
    }, 3000);
    
    return () => {
      clearInterval(interval);
    };
  }, [defaultPrice, onPriceChange, extractedPrice]);

  return {
    price: extractedPrice,
    priceSource: extractedPrice !== null ? 'extracted' : 'default',
    hasPrice: extractedPrice !== null,
    isExtractedPrice: extractedPrice !== null
  };
};
