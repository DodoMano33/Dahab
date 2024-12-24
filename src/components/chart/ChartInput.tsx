import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface ChartInputProps {
  mode: "tradingview";
  onTradingViewConfig: (symbol: string, timeframe: string, providedPrice?: number, isScalping?: boolean) => void;
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

  const handleSubmit = (e: React.FormEvent, isScalping: boolean = false) => {
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

    // تحديد الإطار الزمني بناءً على نوع التحليل
    const timeframe = isScalping ? "5" : "D";
    console.log(`تحليل ${isScalping ? 'سكالبينج' : 'عادي'} للرمز ${symbol}`);
    onTradingViewConfig(symbol, timeframe, providedPrice, isScalping);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
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

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={isAnalyzing}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isAnalyzing ? "جاري التحليل..." : "تحليل"}
        </Button>

        <Button
          type="button"
          disabled={isAnalyzing}
          onClick={(e) => handleSubmit(e, true)}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
        >
          تحليل سكالبينج
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