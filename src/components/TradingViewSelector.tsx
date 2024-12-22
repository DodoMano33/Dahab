import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { timeframes } from "@/utils/chartPatternAnalysis";
import { toast } from "sonner";

interface TradingViewSelectorProps {
  onConfigSubmit: (symbol: string, timeframe: string) => void;
}

export const TradingViewSelector = ({ onConfigSubmit }: TradingViewSelectorProps) => {
  const [symbol, setSymbol] = useState("");
  const [timeframe, setTimeframe] = useState("1d");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) {
      toast.error("الرجاء إدخال رمز العملة أو الزوج");
      return;
    }
    onConfigSubmit(symbol, timeframe);
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

      <Button type="submit" className="w-full">
        تحليل الرسم البياني
      </Button>
    </form>
  );
};