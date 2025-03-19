
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
  const [useAutoPrice, setUseAutoPrice] = useState(true);
  
  // استخدام السعر من Metal Price API تلقائيًا
  useEffect(() => {
    if (useAutoPrice && tradingViewPrice !== null && tradingViewPrice !== undefined) {
      onChange(tradingViewPrice.toString());
    }
  }, [tradingViewPrice, useAutoPrice, onChange]);

  // استمع للتحديثات المباشرة من Metal Price API
  useEffect(() => {
    const handleMetalPriceUpdate = (event: CustomEvent) => {
      if (useAutoPrice && event.detail && event.detail.price) {
        onChange(event.detail.price.toString());
      }
    };

    window.addEventListener('metal-price-update', handleMetalPriceUpdate as EventListener);
    return () => {
      window.removeEventListener('metal-price-update', handleMetalPriceUpdate as EventListener);
    };
  }, [useAutoPrice, onChange]);

  const toggleAutoPriceMode = () => {
    const newMode = !useAutoPrice;
    setUseAutoPrice(newMode);
    
    if (newMode && tradingViewPrice !== null && tradingViewPrice !== undefined) {
      onChange(tradingViewPrice.toString());
    }
  };

  const displayPrice = tradingViewPrice !== null && tradingViewPrice !== undefined
    ? tradingViewPrice.toFixed(5)
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
          السعر المباشر من Metal Price API: {displayPrice}
        </p>
      )}
      {!useAutoPrice && tradingViewPrice !== null && (
        <p className="text-sm text-gray-500 mt-1">
          السعر المتاح من Metal Price API: {displayPrice}
        </p>
      )}
    </div>
  );
};
