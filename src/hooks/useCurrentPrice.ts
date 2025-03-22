
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useCurrentPrice = () => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const [symbol] = useState<string>('XAUUSD'); // استخدام XAUUSD دائماً

  const fetchLatestPrice = useCallback(async () => {
    try {
      console.log('جاري جلب أحدث سعر للذهب (XAUUSD)');
      
      // جلب أحدث سعر من قاعدة البيانات
      const { data, error } = await supabase
        .from('real_time_prices')
        .select('price, updated_at')
        .eq('symbol', 'XAUUSD')
        .single();

      if (error) {
        console.error('خطأ في جلب سعر الذهب من قاعدة البيانات:', error);
        return;
      }

      if (data) {
        const { price, updated_at } = data;
        setCurrentPrice(price);
        setLastUpdateTime(updated_at);
        setPriceUpdateCount(prev => prev + 1);
        
        console.log(`تم تحديث سعر الذهب: ${price}`);
        
        // إطلاق حدث تحديث السعر
        window.dispatchEvent(new CustomEvent('metal-price-update', { 
          detail: { price, symbol: 'XAUUSD' } 
        }));
      }
    } catch (error) {
      console.error('خطأ غير متوقع في جلب سعر الذهب:', error);
    }
  }, []);

  // استدعاء fetchLatestPrice عند التحميل مباشرة وكل 60 ثانية (دقيقة واحدة)
  useEffect(() => {
    console.log('بدء تعقب سعر الذهب (XAUUSD)');
    
    // جلب السعر الأولي فوراً
    fetchLatestPrice();
    
    // إعداد فاصل زمني لتحديث السعر كل دقيقة
    const intervalId = setInterval(fetchLatestPrice, 60000);
    
    // تشغيل وظيفة تحديث السعر المجدولة عند بدء التطبيق
    const initScheduledUpdates = async () => {
      try {
        // تشغيل الوظيفة المجدولة عند بدء التطبيق
        const { error } = await supabase.functions.invoke('schedule-auto-price-updates');
        if (error) {
          console.warn('لم نتمكن من بدء الجدولة التلقائية للأسعار:', error);
        } else {
          console.log('تم بدء الجدولة التلقائية للأسعار بنجاح');
        }
      } catch (err) {
        console.warn('خطأ في بدء الجدولة التلقائية للأسعار:', err);
      }
    };
    
    initScheduledUpdates();
    
    // الاستماع لأحداث تحديث السعر من المصادر الأخرى
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        const newPrice = event.detail.price;
        
        if (newPrice !== currentPrice) {
          console.log(`تم استلام تحديث سعر الذهب من حدث خارجي: ${newPrice}`);
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
  }, [fetchLatestPrice, currentPrice]);

  return { 
    currentPrice, 
    priceUpdateCount, 
    lastUpdateTime,
    symbol: 'XAUUSD', // دائماً نرجع XAUUSD
    fetchLatestPrice
  };
};
