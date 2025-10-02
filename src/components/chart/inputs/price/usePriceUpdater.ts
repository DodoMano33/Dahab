
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { fetchPreciousMetalPrice } from "@/utils/price/api/fetchers";

export interface UsePriceUpdaterOptions {
  onChange: (value: string) => void;
  initialAutoMode?: boolean;
}

export const usePriceUpdater = ({ onChange, initialAutoMode = false }: UsePriceUpdaterOptions) => {
  const [useAutoPrice, setUseAutoPrice] = useState(initialAutoMode);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const updatePrice = async () => {
    if (!useAutoPrice) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log("بدء جلب سعر الذهب...");
      
      // تم تعطيل Metal Price API مؤقتًا بناءً على طلب المستخدم
      const mockPrice = 3000 + Math.random() * 50; // سعر عشوائي للتجربة
      toast.warning("تم تعطيل Metal Price API مؤقتًا، استخدام سعر تجريبي", { duration: 3000 });
      const priceStr = mockPrice.toString();
      onChange(priceStr);
      
      // إرسال حدث لتحديث السعر في جميع أنحاء التطبيق
      window.dispatchEvent(new CustomEvent('metal-price-update', { 
        detail: { price: mockPrice, symbol: 'XAUUSD' } 
      }));
      
      toast.success(`تم تحديث السعر (تجريبي): ${mockPrice.toFixed(2)}`, { duration: 1000 });
      setIsLoading(false);
      return;
      
      /* الكود المعلق ولا يستخدم حاليًا
      // أولاً: محاولة جلب السعر مباشرة من Metal Price API
      const price = await fetchPreciousMetalPrice('XAUUSD');
      
      if (price) {
        console.log(`تم جلب سعر الذهب من Metal Price API: ${price}`);
        const priceStr = price.toString();
        onChange(priceStr);
        
        // إرسال حدث لتحديث السعر في جميع أنحاء التطبيق
        window.dispatchEvent(new CustomEvent('metal-price-update', { 
          detail: { price, symbol: 'XAUUSD' } 
        }));
        
        toast.success(`تم تحديث السعر: ${price}`, { duration: 1000 });
        setIsLoading(false);
        return;
      }
      
      // ثانياً: إذا فشلت المحاولة المباشرة، استخدم Edge Function
      console.log("محاولة استخدام Edge Function لجلب السعر...");
      const { data, error } = await supabase.functions.invoke('update-real-time-prices', {
        body: { symbols: ['XAUUSD'] }
      });

      if (error) {
        console.error("خطأ في استدعاء وظيفة تحديث السعر:", error);
        throw new Error("فشل في تحديث السعر عبر وظيفة Edge");
      }

      // استرجاع السعر المحدث من قاعدة البيانات
      const { data: priceData, error: priceError } = await supabase
        .from('real_time_prices')
        .select('price, updated_at')
        .eq('symbol', 'XAUUSD')
        .single();

      if (priceError) {
        console.error("خطأ في جلب السعر من قاعدة البيانات:", priceError);
        throw new Error("لم نتمكن من استرجاع السعر المحدث");
      }

      if (priceData && priceData.price) {
        const price = priceData.price.toString();
        onChange(price);
        
        // إرسال حدث لتحديث السعر في جميع أنحاء التطبيق
        window.dispatchEvent(new CustomEvent('metal-price-update', { 
          detail: { price: priceData.price, symbol: 'XAUUSD' } 
        }));
        
        const updateTime = new Date(priceData.updated_at).toLocaleTimeString();
        toast.success(`تم تحديث السعر: ${priceData.price} (${updateTime})`, { duration: 1000 });
      } else {
        throw new Error("لا يوجد سعر متاح في قاعدة البيانات");
      }
      */
    } catch (error: any) {
      console.error("خطأ في جلب السعر:", error);
      setErrorMessage("لم نتمكن من جلب السعر الحالي. تم تعطيل Metal Price API مؤقتًا، يرجى إدخال السعر يدويًا");
      toast.error("فشل في تحديث السعر: تم تعطيل Metal Price API مؤقتًا", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };
  
  // استدعاء updatePrice عند تحميل المكون وكل 30 ثانية
  useEffect(() => {
    if (useAutoPrice) {
      console.log("جاري جلب السعر الأولي عند تحميل المكون...");
      updatePrice();
      
      // محاولة تحديث السعر كل 30 ثانية
      const interval = setInterval(() => {
        if (useAutoPrice) {
          console.log("محاولة تحديث السعر دورياً...");
          updatePrice();
        }
      }, 30000);
      
      // تنظيف الفاصل الزمني عند إزالة المكون
      return () => clearInterval(interval);
    }
  }, [useAutoPrice]);
  
  // تفعيل أو تعطيل وضع السعر التلقائي
  const toggleAutoPriceMode = () => {
    const newMode = !useAutoPrice;
    setUseAutoPrice(newMode);
    
    if (newMode) {
      // محاولة الحصول على السعر تلقائيًا
      updatePrice();
    } else {
      // تعطيل وضع السعر التلقائي والسماح بإدخال السعر يدويًا
      setErrorMessage(null);
    }
  };

  return {
    useAutoPrice,
    isLoading,
    errorMessage,
    updatePrice,
    toggleAutoPriceMode,
    setUseAutoPrice
  };
};
