
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { extractPriceFromChart } from "@/utils/price/capture/priceExtractor";

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
  // حالة للتبديل بين الوضع التلقائي واليدوي
  const [useAutoPrice, setUseAutoPrice] = useState(true);
  const [extractedPrice, setExtractedPrice] = useState<number | null>(null);
  
  // استخراج السعر من الشارت بشكل دوري
  useEffect(() => {
    // التحقق من وجود سعر مباشر من TradingView أولاً
    if (tradingViewPrice !== null && tradingViewPrice !== undefined) {
      setExtractedPrice(tradingViewPrice);
      if (useAutoPrice) {
        onChange(tradingViewPrice.toString());
      }
      return;
    }
    
    // محاولة استخراج السعر من الشارت
    const fetchPrice = async () => {
      const price = await extractPriceFromChart();
      if (price !== null) {
        setExtractedPrice(price);
        if (useAutoPrice) {
          onChange(price.toString());
        }
      }
    };
    
    // جلب السعر مباشرة ثم جدولة تحديثات دورية
    fetchPrice();
    const interval = setInterval(fetchPrice, 3000);
    
    return () => {
      clearInterval(interval);
    };
  }, [tradingViewPrice, useAutoPrice, onChange]);

  // التعامل مع التبديل بين الوضع التلقائي واليدوي
  const toggleAutoPriceMode = () => {
    const newMode = !useAutoPrice;
    setUseAutoPrice(newMode);
    
    if (newMode && extractedPrice !== null) {
      onChange(extractedPrice.toString());
    }
  };

  // عرض السعر بتنسيق مناسب
  const formatPrice = (price: number | null) => {
    return price !== null ? price.toFixed(2) : (defaultValue || "السعر غير متاح");
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
      {extractedPrice !== null && (
        <p className={`text-sm mt-1 ${useAutoPrice ? 'text-green-500' : 'text-gray-500'}`}>
          السعر المباشر من الشارت: {formatPrice(extractedPrice)}
        </p>
      )}
    </div>
  );
};
