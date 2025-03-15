
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  tradingViewPrice?: number | null;
}

export const PriceInput = ({ 
  value, 
  onChange, 
  defaultValue,
  tradingViewPrice
}: PriceInputProps) => {
  const [useAutoPrice, setUseAutoPrice] = useState(true); // تفعيل السعر التلقائي افتراضيًا
  const [livePrice, setLivePrice] = useState<number | null>(tradingViewPrice);
  const [retryCount, setRetryCount] = useState(0);
  
  // استماع لسعر TradingView المباشر
  useEffect(() => {
    const handleDirectTVPrice = (event: CustomEvent) => {
      if (event.detail && typeof event.detail.price === 'number') {
        const directPrice = event.detail.price;
        console.log('PriceInput received direct TradingView price:', directPrice);
        
        // تأكد من تحديث السعر بالقيمة الدقيقة من TradingView
        setLivePrice(directPrice);
        
        if (useAutoPrice) {
          console.log('Auto-updating price with direct TradingView price:', directPrice);
          onChange(directPrice.toString());
        }
        
        // إعادة تعيين عداد المحاولات بعد نجاح استلام السعر
        setRetryCount(0);
      }
    };
    
    window.addEventListener('tradingview-direct-price', handleDirectTVPrice as EventListener);
    
    return () => {
      window.removeEventListener('tradingview-direct-price', handleDirectTVPrice as EventListener);
    };
  }, [useAutoPrice, onChange]);
  
  // استخدام السعر من TradingView تلقائيًا عند التغيير
  useEffect(() => {
    if (useAutoPrice && livePrice !== null && livePrice !== undefined) {
      console.log('Updating price input with live price:', livePrice);
      onChange(livePrice.toString());
    }
  }, [livePrice, useAutoPrice, onChange]);

  // تطبيق السعر الأولي من tradingViewPrice إذا كان متاحًا
  useEffect(() => {
    if (tradingViewPrice !== null && tradingViewPrice !== undefined) {
      console.log('Received initial TradingView price:', tradingViewPrice);
      setLivePrice(tradingViewPrice);
      
      if (useAutoPrice) {
        console.log('Setting initial auto price:', tradingViewPrice);
        onChange(tradingViewPrice.toString());
      }
    }
  }, [tradingViewPrice, useAutoPrice, onChange]);

  // استمع للتحديثات المباشرة من TradingView وقارئ الشاشة
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        const updatedPrice = event.detail.price;
        console.log('PriceInput received price update:', updatedPrice);
        setLivePrice(updatedPrice);
        
        if (useAutoPrice) {
          console.log('Auto-updating price to:', updatedPrice);
          onChange(updatedPrice.toString());
        }
        
        // إعادة تعيين عداد المحاولات بعد نجاح استلام السعر
        setRetryCount(0);
      }
    };

    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    
    // طلب السعر الحالي عند تحميل المكون
    window.dispatchEvent(new Event('request-current-price'));
    // طلب السعر المباشر من TradingView
    window.dispatchEvent(new Event('request-tradingview-price'));
    
    // استمع لاستجابة السعر الحالي
    const handleCurrentPriceResponse = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        const responsePrice = event.detail.price;
        console.log('PriceInput received current price response:', responsePrice);
        setLivePrice(responsePrice);
        
        if (useAutoPrice) {
          console.log('Auto-updating price to (from response):', responsePrice);
          onChange(responsePrice.toString());
        }
        
        // إعادة تعيين عداد المحاولات بعد نجاح استلام السعر
        setRetryCount(0);
      }
    };
    
    window.addEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
    
    // إضافة محاولات متكررة لطلب السعر في حالة عدم الاستجابة الأولى
    const requestInterval = setInterval(() => {
      if (livePrice === null || livePrice === undefined) {
        // طلب السعر من مصدرين بشكل متكرر
        window.dispatchEvent(new Event('request-current-price'));
        window.dispatchEvent(new Event('request-tradingview-price'));
        
        setRetryCount(prev => prev + 1);
        console.log(`PriceInput requesting price again (attempt ${retryCount + 1})...`);
        
        // عرض إشعار إذا استمرت محاولات الاسترداد لفترة طويلة
        if (retryCount > 10 && retryCount % 5 === 0) {
          toast.info("جارِ محاولة استرداد السعر المباشر...", { duration: 3000 });
        }
      }
    }, 500); // محاولة كل نصف ثانية
    
    return () => {
      clearInterval(requestInterval);
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
    };
  }, [useAutoPrice, onChange, livePrice, retryCount]);

  const toggleAutoPriceMode = () => {
    const newMode = !useAutoPrice;
    setUseAutoPrice(newMode);
    
    if (newMode && livePrice !== null && livePrice !== undefined) {
      console.log('Toggle auto price mode ON with price:', livePrice);
      onChange(livePrice.toString());
      toast.success("تم تفعيل السعر التلقائي");
    } else if (!newMode) {
      toast.info("تم تفعيل الإدخال اليدوي للسعر");
    }
  };

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
        <p className="text-sm text-green-500 mt-1">
          {livePrice !== null && livePrice !== undefined 
            ? `السعر المباشر: ${livePrice.toFixed(2)}` 
            : "جاري تحميل السعر المباشر..."}
        </p>
      )}
      {!useAutoPrice && livePrice !== null && livePrice !== undefined && (
        <p className="text-sm text-gray-500 mt-1">
          السعر المتاح حاليًا: {livePrice.toFixed(2)}
        </p>
      )}
    </div>
  );
};
