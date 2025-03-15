
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getLastExtractedPrice } from "@/utils/price/screenshotPriceExtractor";

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
  const [extractedPrice, setExtractedPrice] = useState<number | null>(null);
  
  // استدعاء السعر المستخرج من الصورة
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        console.log('PriceInput received extracted price update:', event.detail.price);
        setExtractedPrice(event.detail.price);
        // تحديث السعر المباشر باستخدام السعر المستخرج
        setLivePrice(event.detail.price);
        if (useAutoPrice) {
          onChange(event.detail.price.toString());
        }
      }
    };

    // الاستماع لتحديثات السعر المستخرج
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    
    // التحقق من آخر سعر ملتقط عند التحميل
    const lastPrice = getLastExtractedPrice();
    if (lastPrice !== null) {
      setExtractedPrice(lastPrice);
      setLivePrice(lastPrice);
      if (useAutoPrice) {
        onChange(lastPrice.toString());
      }
    }
    
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    };
  }, [useAutoPrice, onChange]);

  // استخدام السعر من TradingView تلقائيًا (احتياطي)
  useEffect(() => {
    if (useAutoPrice && livePrice === null && tradingViewPrice !== null && tradingViewPrice !== undefined) {
      setLivePrice(tradingViewPrice);
      onChange(tradingViewPrice.toString());
    }
  }, [tradingViewPrice, useAutoPrice, onChange, livePrice]);

  // استمع للتحديثات المباشرة من TradingView (احتياطي)
  useEffect(() => {
    // فقط إذا لم يكن هناك سعر مستخرج
    if (extractedPrice !== null) return;

    const handleTradingViewPriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        console.log('PriceInput received regular price update:', event.detail.price);
        if (extractedPrice === null) {
          setLivePrice(event.detail.price);
          if (useAutoPrice) {
            onChange(event.detail.price.toString());
          }
        }
      }
    };

    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    
    // طلب السعر الحالي عند تحميل المكون
    window.dispatchEvent(new Event('request-current-price'));
    
    // استمع لاستجابة السعر الحالي
    const handleCurrentPriceResponse = (event: CustomEvent) => {
      if (event.detail && event.detail.price && extractedPrice === null) {
        console.log('PriceInput received current price response:', event.detail.price);
        setLivePrice(event.detail.price);
        if (useAutoPrice) {
          onChange(event.detail.price.toString());
        }
      }
    };
    
    window.addEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
    
    return () => {
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
    };
  }, [useAutoPrice, onChange, extractedPrice]);

  const toggleAutoPriceMode = () => {
    const newMode = !useAutoPrice;
    setUseAutoPrice(newMode);
    
    if (newMode && livePrice !== null && livePrice !== undefined) {
      onChange(livePrice.toString());
    }
  };

  // تحديد السعر الذي سيتم عرضه (أولوية للسعر المستخرج من الصورة)
  const effectivePrice = extractedPrice !== null ? extractedPrice : (livePrice !== null ? livePrice : tradingViewPrice);
  const displayPrice = effectivePrice !== null && effectivePrice !== undefined
    ? effectivePrice.toFixed(2)
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
          {extractedPrice !== null ? 
            "السعر المباشر من الصورة: " : 
            "السعر المباشر من TradingView: "} 
          {displayPrice}
        </p>
      )}
      {!useAutoPrice && effectivePrice !== null && (
        <p className="text-sm text-gray-500 mt-1">
          {extractedPrice !== null ? 
            "السعر المتاح من الصورة: " : 
            "السعر المتاح من TradingView: "} 
          {displayPrice}
        </p>
      )}
    </div>
  );
};
