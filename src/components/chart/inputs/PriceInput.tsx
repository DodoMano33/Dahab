
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchPreciousMetalPrice } from "@/utils/price/api/fetchers";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  tradingViewPrice?: number | null;
}

export const PriceInput = ({ 
  value, 
  onChange, 
  defaultValue
}: PriceInputProps) => {
  const [useAutoPrice, setUseAutoPrice] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // محاولة تحديث السعر
  const updatePrice = async () => {
    if (!useAutoPrice) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log("بدء جلب سعر الذهب...");
      
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
        
        toast.success(`تم تحديث السعر: ${price}`);
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
        toast.success(`تم تحديث السعر: ${priceData.price} (${updateTime})`);
      } else {
        throw new Error("لا يوجد سعر متاح في قاعدة البيانات");
      }
    } catch (error: any) {
      console.error("خطأ في جلب السعر:", error);
      setErrorMessage("لم نتمكن من جلب السعر الحالي. يرجى المحاولة مرة أخرى أو إدخال السعر يدويًا");
      toast.error("فشل في تحديث السعر: " + (error.message || "خطأ غير معروف"));
    } finally {
      setIsLoading(false);
    }
  };
  
  // استدعاء updatePrice مباشرة عند تحميل المكون وكل 30 ثانية
  useEffect(() => {
    // تحقق إذا كان السعر فارغًا وكان وضع السعر التلقائي مفعل
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

  // اختيار السعر المناسب للعرض
  const displayPrice = value 
    ? parseFloat(value).toFixed(2)
    : defaultValue 
      ? defaultValue 
      : "السعر غير متاح";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          السعر (إجباري)
        </label>
        <Badge 
          variant={useAutoPrice ? "default" : "outline"} 
          className="cursor-pointer" 
          onClick={toggleAutoPriceMode}
        >
          {useAutoPrice ? "السعر التلقائي" : "السعر اليدوي"}
        </Badge>
      </div>
      <div className="flex gap-2">
        <Input
          id="price"
          type="number"
          step="any"
          placeholder={`أدخل السعر (إجباري)`}
          value={value}
          onChange={(e) => !useAutoPrice && onChange(e.target.value)}
          className={`w-full ${useAutoPrice ? 'bg-gray-100' : ''}`}
          dir="ltr"
          disabled={useAutoPrice}
        />
        {useAutoPrice && (
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            disabled={isLoading}
            onClick={updatePrice}
            title="تحديث السعر"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>
      
      {useAutoPrice && isLoading && (
        <p className="text-sm text-yellow-500 mt-1">
          جارِ جلب السعر من Metal Price API...
        </p>
      )}
      
      {useAutoPrice && errorMessage && (
        <div className="flex flex-col mt-1">
          <p className="text-sm text-red-500">{errorMessage}</p>
          <button 
            onClick={() => setUseAutoPrice(false)}
            className="text-xs text-blue-500 hover:underline mt-1"
          >
            التحويل إلى الإدخال اليدوي
          </button>
        </div>
      )}
      
      {!useAutoPrice && value && (
        <p className="text-sm text-green-500 mt-1">
          السعر المدخل يدوياً: {displayPrice}
        </p>
      )}
      
      {useAutoPrice && value && !isLoading && !errorMessage && (
        <p className="text-sm text-blue-500 mt-1">
          السعر الحالي (Metal Price API): {displayPrice}
        </p>
      )}
    </div>
  );
}
