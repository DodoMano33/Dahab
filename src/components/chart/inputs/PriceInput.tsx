
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useExtractedPrice } from "@/hooks/useExtractedPrice";

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
  
  // استخدام الهوك الجديد للحصول على السعر المستخرج
  const { price: extractedPrice, priceSource, hasPrice } = useExtractedPrice({
    onPriceChange: (newPrice) => {
      if (useAutoPrice) {
        onChange(newPrice.toString());
      }
    },
    defaultPrice: tradingViewPrice
  });

  // تحديث القيمة عند تغيير الوضع التلقائي
  useEffect(() => {
    if (useAutoPrice && hasPrice && extractedPrice !== null) {
      onChange(extractedPrice.toString());
    }
  }, [useAutoPrice, hasPrice, extractedPrice, onChange]);

  // التعامل مع التبديل بين الوضع التلقائي واليدوي
  const toggleAutoPriceMode = () => {
    const newMode = !useAutoPrice;
    setUseAutoPrice(newMode);
    
    if (newMode && extractedPrice !== null) {
      onChange(extractedPrice.toString());
    }
  };

  // تحديد رسائل للعرض استناداً إلى مصدر السعر
  const getPriceSourceLabel = () => {
    switch (priceSource) {
      case 'extracted':
        return "السعر المباشر من الصورة:";
      case 'tradingview':
        return "السعر المباشر من TradingView:";
      case 'default':
        return "السعر الافتراضي:";
      default:
        return "السعر غير متاح";
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
      {hasPrice && (
        <p className={`text-sm mt-1 ${useAutoPrice ? 'text-green-500' : 'text-gray-500'}`}>
          {getPriceSourceLabel()} {formatPrice(extractedPrice)}
        </p>
      )}
    </div>
  );
};
