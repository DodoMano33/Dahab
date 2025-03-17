
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const PriceInput = ({ 
  value, 
  onChange,
  defaultValue
}: PriceInputProps) => {
  const [useAutoPrice, setUseAutoPrice] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  // الاستماع فقط لأحداث تحديث السعر
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail?.price && useAutoPrice) {
        const newPrice = event.detail.price;
        setCurrentPrice(newPrice);
        onChange(newPrice.toString());
      }
    };
    
    window.addEventListener('price-updated', handlePriceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('price-updated', handlePriceUpdate as EventListener);
    };
  }, [onChange, useAutoPrice]);

  // التعامل مع التبديل بين الوضع التلقائي واليدوي
  const toggleAutoPriceMode = () => {
    const newMode = !useAutoPrice;
    setUseAutoPrice(newMode);
    
    if (newMode && currentPrice !== null) {
      onChange(currentPrice.toString());
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
        className={`w-full ${useAutoPrice ? 'bg-gray-100 price-display' : ''}`}
        dir="ltr"
        disabled={useAutoPrice}
      />
      {currentPrice !== null && (
        <p className={`text-sm mt-1 ${useAutoPrice ? 'text-green-500' : 'text-gray-500'}`}>
          السعر المباشر من الشارت: {formatPrice(currentPrice)}
        </p>
      )}
    </div>
  );
};
