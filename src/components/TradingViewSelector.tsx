import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { History } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TradingViewSelectorProps {
  onConfigSubmit: (symbol: string, timeframe: string, currentPrice?: number, customHours?: number) => void;
  isLoading: boolean;
  onHistoryClick: () => void;
  defaultSymbol?: string;
  defaultPrice?: number | null;
}

const SUPPORTED_SYMBOLS = [
  { value: "XAUUSD", label: "الذهب/دولار" },
  { value: "EURUSD", label: "يورو/دولار" },
  { value: "GBPUSD", label: "جنيه/دولار" },
  { value: "USDJPY", label: "دولار/ين" },
  { value: "USDCHF", label: "دولار/فرنك" },
  { value: "AUDUSD", label: "دولار استرالي/دولار" },
  { value: "NZDUSD", label: "دولار نيوزيلندي/دولار" },
  { value: "USDCAD", label: "دولار/دولار كندي" },
  { value: "BTCUSD", label: "بيتكوين/دولار" },
  { value: "ETHUSD", label: "إيثريوم/دولار" }
];

export const TradingViewSelector = ({ 
  onConfigSubmit, 
  isLoading, 
  onHistoryClick,
  defaultSymbol,
  defaultPrice
}: TradingViewSelectorProps) => {
  const [symbol, setSymbol] = useState(defaultSymbol || "");
  const [currentPrice, setCurrentPrice] = useState<string>(defaultPrice?.toString() || "");
  const [customHours, setCustomHours] = useState<string>("8");

  useEffect(() => {
    if (defaultSymbol) {
      setSymbol(defaultSymbol);
    }
  }, [defaultSymbol]);

  useEffect(() => {
    if (defaultPrice !== undefined && defaultPrice !== null) {
      setCurrentPrice(defaultPrice.toString());
      console.log("Price updated from chart:", defaultPrice);
    }
  }, [defaultPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!symbol && !defaultSymbol) {
        toast.error("الرجاء انتظار تحميل الشارت أو اختيار رمز العملة");
        return;
      }
      
      const priceToUse = currentPrice || defaultPrice?.toString();
      if (!priceToUse) {
        toast.error("الرجاء انتظار تحميل السعر من الشارت");
        return;
      }
      
      const price = Number(priceToUse);
      if (isNaN(price) || price <= 0) {
        toast.error("الرجاء التأكد من صحة السعر");
        return;
      }

      const hours = Number(customHours);
      if (isNaN(hours) || hours < 1 || hours > 72) {
        toast.error("الرجاء إدخال مدة صالحة بين 1 و 72 ساعة");
        return;
      }
      
      console.log("تقديم تحليل:", { 
        symbol: symbol || defaultSymbol, 
        currentPrice: price,
        customHours: hours
      });
      
      await onConfigSubmit(symbol || defaultSymbol || "", "1d", price, hours);
      
    } catch (error) {
      console.error("خطأ في تقديم التحليل:", error);
      toast.error("حدث خطأ أثناء تحليل الرسم البياني");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          رمز العملة أو الزوج
        </label>
        <Select 
          value={symbol} 
          onValueChange={setSymbol}
          defaultValue={defaultSymbol}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="اختر رمز العملة أو الزوج" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_SYMBOLS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label} ({option.value})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          السعر الحالي
        </label>
        <Input
          type="number"
          step="any"
          placeholder={defaultPrice ? `السعر الحالي: ${defaultPrice}` : "انتظار تحميل السعر من الشارت..."}
          value={currentPrice}
          onChange={(e) => setCurrentPrice(e.target.value)}
          className="w-full"
          dir="ltr"
        />
        {defaultPrice && !currentPrice && (
          <p className="text-sm text-gray-500 mt-1">
            سيتم استخدام السعر {defaultPrice} من الشارت
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          مدة بقاء التحليل (بالساعات)
        </label>
        <Input
          type="number"
          min="1"
          max="72"
          placeholder="أدخل عدد الساعات (8 ساعات افتراضياً)"
          value={customHours}
          onChange={(e) => setCustomHours(e.target.value)}
          className="w-full"
          dir="ltr"
        />
        <p className="text-sm text-gray-500 mt-1">
          يجب أن تكون المدة بين 1 و 72 ساعة
        </p>
      </div>

      <div className="flex gap-2">
        <Button 
          type="submit" 
          className="flex-1" 
          disabled={isLoading || (!symbol && !defaultSymbol) || (!currentPrice && !defaultPrice)}
        >
          {isLoading ? "جاري التحليل..." : "تحليل الرسم البياني"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onHistoryClick}
          className="flex items-center gap-2"
        >
          <History className="w-4 h-4" />
          سجل البحث
        </Button>
      </div>
    </form>
  );
};