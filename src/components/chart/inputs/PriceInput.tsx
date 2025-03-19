
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
  const [useAutoPrice, setUseAutoPrice] = useState(false);
  
  // استخدام السعر من Alpha Vantage تلقائيًا
  useEffect(() => {
    if (useAutoPrice && tradingViewPrice !== null && tradingViewPrice !== undefined) {
      onChange(tradingViewPrice.toString());
    }
  }, [tradingViewPrice, useAutoPrice, onChange]);

  // استمع للتحديثات المباشرة من Alpha Vantage
  useEffect(() => {
    const handleAlphaVantagePriceUpdate = (event: CustomEvent) => {
      if (useAutoPrice && event.detail && event.detail.price) {
        onChange(event.detail.price.toString());
      }
    };

    window.addEventListener('alpha-vantage-price-update', handleAlphaVantagePriceUpdate as EventListener);
    return () => {
      window.removeEventListener('alpha-vantage-price-update', handleAlphaVantagePriceUpdate as EventListener);
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
          السعر المباشر من Alpha Vantage: {displayPrice}
        </p>
      )}
      {!useAutoPrice && tradingViewPrice !== null && (
        <p className="text-sm text-gray-500 mt-1">
          السعر المتاح من Alpha Vantage: {displayPrice}
        </p>
      )}
    </div>
  );
};
