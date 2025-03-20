
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useCurrentPrice = () => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string>('XAUUSD');

  const fetchLatestPrice = useCallback(async () => {
    try {
      console.log('جاري جلب أحدث سعر للرمز:', symbol);
      
      // أولاً، نحاول تحديث السعر من خلال وظيفة Edge
      try {
        const { data, error } = await supabase.functions.invoke('update-real-time-prices', {
          body: { symbols: [symbol] }
        });
        
        if (error) {
          console.warn('لم نتمكن من تحديث السعر من خلال وظيفة Edge:', error);
        } else {
          console.log('تم تحديث السعر بنجاح من خلال وظيفة Edge:', data);
        }
      } catch (updateError) {
        console.warn('خطأ في استدعاء وظيفة تحديث السعر:', updateError);
      }
      
      // ثم نجلب أحدث سعر من قاعدة البيانات
      const { data, error } = await supabase
        .from('real_time_prices')
        .select('price, updated_at')
        .eq('symbol', symbol)
        .single();

      if (error) {
        console.error('خطأ في جلب السعر من قاعدة البيانات:', error);
        return;
      }

      if (data) {
        const { price, updated_at } = data;
        setCurrentPrice(price);
        setLastUpdateTime(updated_at);
        setPriceUpdateCount(prev => prev + 1);
        
        console.log(`تم تحديث السعر للرمز ${symbol}: ${price}`);
        
        // إطلاق حدث تحديث السعر
        window.dispatchEvent(new CustomEvent('metal-price-update', { 
          detail: { price, symbol } 
        }));
      }
    } catch (error) {
      console.error('خطأ غير متوقع في جلب السعر:', error);
    }
  }, [symbol]);

  // استدعاء fetchLatestPrice عند التحميل وكل 60 ثانية (دقيقة واحدة)
  useEffect(() => {
    console.log('بدء تعقب السعر للرمز:', symbol);
    
    // جلب السعر الأولي
    fetchLatestPrice();
    
    // إعداد فاصل زمني لتحديث السعر كل دقيقة
    const intervalId = setInterval(fetchLatestPrice, 60000);
    
    // الاستماع لأحداث تحديث السعر من المصادر الأخرى
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        const newPrice = event.detail.price;
        const eventSymbol = event.detail.symbol || symbol;
        
        if (eventSymbol === symbol && newPrice !== currentPrice) {
          console.log(`تم استلام تحديث السعر من حدث خارجي: ${newPrice} للرمز ${eventSymbol}`);
          setCurrentPrice(newPrice);
          setLastUpdateTime(new Date().toISOString());
          setPriceUpdateCount(prev => prev + 1);
        }
      }
    };
    
    window.addEventListener('metal-price-update', handlePriceUpdate as EventListener);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('metal-price-update', handlePriceUpdate as EventListener);
    };
  }, [symbol, fetchLatestPrice, currentPrice]);

  return { 
    currentPrice, 
    priceUpdateCount, 
    lastUpdateTime,
    setSymbol,
    fetchLatestPrice
  };
};
