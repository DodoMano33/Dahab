
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { PriceLoadingState } from "./price/PriceLoadingState";
import { PriceErrorMessage } from "./price/PriceErrorMessage";
import { PriceMessage } from "./price/PriceMessage";
import { usePriceUpdater } from "./price/usePriceUpdater";

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
  const {
    useAutoPrice,
    isLoading,
    errorMessage,
    updatePrice,
    toggleAutoPriceMode
  } = usePriceUpdater({ onChange });

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
      
      {useAutoPrice && isLoading && <PriceLoadingState />}
      
      {useAutoPrice && errorMessage && (
        <PriceErrorMessage 
          message={errorMessage} 
          onSwitchToManual={() => toggleAutoPriceMode()}
        />
      )}
      
      <PriceMessage
        displayPrice={displayPrice}
        isAutoPrice={useAutoPrice}
        isLoading={isLoading}
        hasError={!!errorMessage}
      />
    </div>
  );
};
