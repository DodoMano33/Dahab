import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { timeframes } from "@/utils/chartPatternAnalysis";
import { toast } from "sonner";

interface TradingViewSelectorProps {
  onConfigSubmit: (symbol: string, timeframe: string, currentPrice: number) => void;
  isLoading: boolean;
}

export const TradingViewSelector = ({ onConfigSubmit, isLoading }: TradingViewSelectorProps) => {
  const [symbol, setSymbol] = useState("");
  const [timeframe, setTimeframe] = useState("1d");
  const [currentPrice, setCurrentPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) {
      toast.error("الرجاء إدخال رمز العملة أو الزوج");
      return;
    }
    if (!currentPrice || isNaN(Number(currentPrice)) || Number(currentPrice) <= 0) {
      toast.error("الرجاء إدخال السعر الحالي بشكل صحيح");
      return;
    }
    console.log("Submitting TradingView config:", { symbol, timeframe, currentPrice });
    onConfigSubmit(symbol, timeframe, Number(currentPrice));
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
          السعر الحالي
        </label>
        <Input
          type="number"
          step="any"
          placeholder="أدخل السعر الحالي"
          value={currentPrice}
          onChange={(e) => setCurrentPrice(e.target.value)}
          className="w-full"
          dir="ltr"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الإطار الزمني
        </label>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2"
        >
          {timeframes.map((tf) => (
            <option key={tf.value} value={tf.value}>
              {tf.label}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "جاري التحليل..." : "تحليل الرسم البياني"}
      </Button>
    </form>
  );
};