
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { fetchCurrentPrice } from "@/services/priceService";
import { toast } from "sonner";

interface SymbolInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  onPriceUpdate?: (price: number | null) => void;
  updateChart?: boolean; // Flag to determine if we should update the chart
  onUpdateChart?: (symbol: string) => void; // Function to update the chart
}

export const SymbolInput = ({ 
  value, 
  onChange, 
  defaultValue,
  onPriceUpdate,
  updateChart = true,
  onUpdateChart
}: SymbolInputProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value || defaultValue || "");

  // استخدام قيمة مؤجلة للرمز لتجنب طلبات API متعددة وتحديث الشارت
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value || defaultValue || "");
      
      // If updateChart flag is true and we have a value and onUpdateChart function
      if (updateChart && onUpdateChart && (value || defaultValue)) {
        const symbolToUpdate = value || defaultValue || "";
        console.log(`Updating chart with symbol: ${symbolToUpdate}`);
        onUpdateChart(symbolToUpdate);
      }
    }, 500); // Slightly longer debounce for chart updates

    return () => clearTimeout(timer);
  }, [value, defaultValue, updateChart, onUpdateChart]);

  // استدعاء API للحصول على السعر عند تغيير الرمز - فقط إذا لم يتم تحديث السعر من الشارت
  useEffect(() => {
    const fetchPrice = async () => {
      if (!debouncedValue) return;
      
      try {
        setIsLoading(true);
        console.log(`Fetching price for symbol: ${debouncedValue}`);
        const price = await fetchCurrentPrice(debouncedValue);
        console.log(`Price result for ${debouncedValue}:`, price);
        
        if (price && onPriceUpdate) {
          onPriceUpdate(price);
          toast.success(`تم تحديث سعر ${debouncedValue}`, {
            description: `السعر الحالي: ${price}`,
            duration: 3000,
          });
        } else if (!price) {
          console.warn(`No price returned for ${debouncedValue}`);
          // توست تحذيري بدلاً من الخطأ إذا لم يتم العثور على سعر
          toast.warning(`لم يتم العثور على سعر لـ ${debouncedValue}`, {
            description: "سيتم محاولة الحصول على السعر من الشارت",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("خطأ في الحصول على السعر:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
  }, [debouncedValue, onPriceUpdate]);

  return (
    <div>
      <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
        رمز العملة
      </label>
      <div className="relative">
        <Input
          id="symbol"
          placeholder={defaultValue || "مثال: XAUUSD"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
          dir="ltr"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>
      {defaultValue && !value && (
        <p className="text-sm text-gray-500 mt-1">
          سيتم استخدام الرمز {defaultValue} من الشارت
        </p>
      )}
    </div>
  );
};
