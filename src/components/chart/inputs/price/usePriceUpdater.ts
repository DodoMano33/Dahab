
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { fetchPreciousMetalPrice } from "@/utils/price/api/fetchers";
import { saveCurrentPrice, getCurrentPrice } from "@/utils/price/localStorage";

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
      console.log("بدء جلب سعر الذهب من investing.com...");
      
      // استخدام Edge Function لجلب السعر
      const { data, error } = await supabase.functions.invoke('update-real-time-prices', {
        body: { symbols: ['XAUUSD'] }
      });

      if (error) {
        console.error("خطأ في استدعاء وظيفة تحديث السعر:", error);
        
        // محاولة استرجاع السعر من التخزين المحلي
        const { price: localPrice } = getCurrentPrice();
        if (localPrice) {
          console.log(`استخدام السعر من التخزين المحلي: ${localPrice}`);
          onChange(localPrice.toString());
          toast.info(`استخدام السعر المحفوظ: ${localPrice}`, { duration: 2000 });
          return;
        }
        
        throw new Error("فشل في تحديث السعر");
      }

      // استرجاع السعر المحدث من قاعدة البيانات
      const { data: priceData, error: priceError } = await supabase
        .from('real_time_prices')
        .select('price, updated_at')
        .eq('symbol', 'XAUUSD')
        .single();

      if (priceError) {
        console.error("خطأ في جلب السعر من قاعدة البيانات:", priceError);
        
        // محاولة استرجاع السعر من التخزين المحلي
        const { price: localPrice } = getCurrentPrice();
        if (localPrice) {
          console.log(`استخدام السعر من التخزين المحلي: ${localPrice}`);
          onChange(localPrice.toString());
          toast.info(`استخدام السعر المحفوظ: ${localPrice}`, { duration: 2000 });
          return;
        }
        
        throw new Error("لم نتمكن من استرجاع السعر المحدث");
      }

      if (priceData && priceData.price) {
        const price = priceData.price.toString();
        onChange(price);
        
        // حفظ السعر في التخزين المحلي
        saveCurrentPrice(priceData.price);
        
        // إرسال حدث لتحديث السعر في جميع أنحاء التطبيق
        window.dispatchEvent(new CustomEvent('metal-price-update', { 
          detail: { price: priceData.price, symbol: 'XAUUSD' } 
        }));
        
        const updateTime = new Date(priceData.updated_at).toLocaleTimeString();
        toast.success(`تم تحديث السعر: ${priceData.price} (${updateTime})`, { duration: 1000 });
      } else {
        throw new Error("لا يوجد سعر متاح في قاعدة البيانات");
      }
    } catch (error: any) {
      console.error("خطأ في جلب السعر:", error);
      setErrorMessage("لم نتمكن من جلب السعر الحالي. يرجى إدخال السعر يدويًا");
      toast.error("فشل في تحديث السعر. يرجى المحاولة مرة أخرى", { duration: 3000 });
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
