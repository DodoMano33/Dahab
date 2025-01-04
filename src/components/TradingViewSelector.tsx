import { useState } from "react";
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
  onConfigSubmit: (symbol: string, timeframe: string, currentPrice?: number) => void;
  isLoading: boolean;
  onHistoryClick: () => void;
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

export const TradingViewSelector = ({ onConfigSubmit, isLoading, onHistoryClick }: TradingViewSelectorProps) => {
  const [symbol, setSymbol] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!symbol) {
        toast.error("الرجاء اختيار رمز العملة أو الزوج");
        return;
      }
      
      if (!currentPrice) {
        toast.error("الرجاء إدخال السعر الحالي");
        return;
      }
      
      const price = Number(currentPrice);
      if (isNaN(price) || price <= 0) {
        toast.error("الرجاء إدخال السعر الحالي بشكل صحيح");
        return;
      }
      
      console.log("Submitting TradingView config:", { symbol, currentPrice: price });
      await onConfigSubmit(symbol, "1d", price);
      
    } catch (error) {
      console.error("Error submitting analysis:", error);
      toast.error("حدث خطأ أثناء تحليل الرسم البياني");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          رمز العملة أو الزوج
        </label>
        <Select value={symbol} onValueChange={setSymbol}>
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
          السعر (إجباري)
        </label>
        <Input
          type="number"
          step="any"
          placeholder="أدخل السعر (إجباري)"
          value={currentPrice}
          onChange={(e) => setCurrentPrice(e.target.value)}
          className="w-full"
          dir="ltr"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={isLoading}>
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