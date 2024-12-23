import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface ChartInputProps {
  mode: "tradingview";
  onTradingViewConfig: (symbol: string, timeframe: string, providedPrice?: number) => void;
  onHistoryClick: () => void;
  isAnalyzing: boolean;
}

export const ChartInput = ({
  mode,
  onTradingViewConfig,
  onHistoryClick,
  isAnalyzing
}: ChartInputProps) => {
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symbol) {
      toast.error("الرجاء إدخال رمز العملة");
      return;
    }

    const providedPrice = price ? Number(price) : undefined;
    if (price && isNaN(providedPrice!)) {
      toast.error("الرجاء إدخال سعر صحيح");
      return;
    }

    onTradingViewConfig(symbol, "D", providedPrice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
          رمز العملة
        </label>
        <Input
          id="symbol"
          placeholder="مثال: XAUUSD"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full"
          dir="ltr"
        />
      </div>
      
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          السعر (اختياري)
        </label>
        <Input
          id="price"
          type="number"
          step="any"
          placeholder="أدخل السعر (اختياري)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full"
          dir="ltr"
        />
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button
          type="submit"
          disabled={isAnalyzing}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isAnalyzing ? "جاري التحليل..." : "تحليل"}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onHistoryClick}
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          سجل البحث
        </Button>
      </div>
    </form>
  );
};