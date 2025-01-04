import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { History } from "lucide-react";

interface TradingViewSelectorProps {
  onConfigSubmit: (symbol: string, timeframe: string, currentPrice?: number) => void;
  isLoading: boolean;
  onHistoryClick: () => void;
}

export const TradingViewSelector = ({ onConfigSubmit, isLoading, onHistoryClick }: TradingViewSelectorProps) => {
  const [symbol, setSymbol] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!symbol) {
        toast.error("الرجاء إدخال رمز العملة أو الزوج");
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
        <Input
          type="text"
          placeholder="مثال: BTCUSD, EURUSD"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full"
          dir="ltr"
        />
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