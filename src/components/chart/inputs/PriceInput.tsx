
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

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
  
  // استخدام السعر من TradingView تلقائيًا عند تغييره
  useEffect(() => {
    if (useAutoPrice && livePrice !== null && livePrice !== undefined) {
      onChange(livePrice.toString());
      console.log('Setting auto price from livePrice:', livePrice);
    }
  }, [livePrice, useAutoPrice, onChange]);

  // استمع للتحديثات المباشرة من TradingView
  useEffect(() => {
    const handleTradingViewPriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        console.log('PriceInput received price update:', event.detail.price);
        setLivePrice(event.detail.price);
        if (useAutoPrice) {
          onChange(event.detail.price.toString());
        }
      }
    };

    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    
    // طلب السعر الحالي عند تحميل المكون
    console.log('PriceInput requesting initial price');
    window.dispatchEvent(new Event('request-current-price'));
    
    // استمع لاستجابة السعر الحالي
    const handleCurrentPriceResponse = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        console.log('PriceInput received current price response:', event.detail.price);
        setLivePrice(event.detail.price);
        if (useAutoPrice) {
          onChange(event.detail.price.toString());
        }
      }
    };
    
    window.addEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
    
    // إنشاء مؤقت لإعادة طلب السعر كل ثانيتين في حالة عدم استجابة الطلب الأول
    const priceRequestTimer = setInterval(() => {
      if (!livePrice && useAutoPrice) {
        console.log('Retrying price request...');
        window.dispatchEvent(new Event('request-current-price'));
      } else {
        clearInterval(priceRequestTimer);
      }
    }, 2000);
    
    return () => {
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
      clearInterval(priceRequestTimer);
    };
  }, [useAutoPrice, onChange, livePrice]);

  // عند تغيير وضع السعر (تلقائي/يدوي)
  const toggleAutoPriceMode = () => {
    const newMode = !useAutoPrice;
    setUseAutoPrice(newMode);
    
    if (newMode && livePrice !== null && livePrice !== undefined) {
      onChange(livePrice.toString());
    }
  };

  const displayPrice = livePrice !== null && livePrice !== undefined
    ? livePrice.toFixed(2)
    : defaultValue || "السعر غير متاح";

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
          السعر المباشر من TradingView: {displayPrice}
        </p>
      )}
      {!useAutoPrice && livePrice !== null && (
        <p className="text-sm text-gray-500 mt-1">
          السعر المتاح من TradingView: {displayPrice}
        </p>
      )}
    </div>
  );
};
