
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { toast } from "sonner";
import { SymbolSelector } from "./chart/inputs/SymbolSelector";
import { AnalysisDurationInput } from "./chart/inputs/AnalysisDurationInput";

interface TradingViewSelectorProps {
  onConfigSubmit: (symbol: string, timeframe: string, currentPrice?: number, customHours?: number) => void;
  isLoading: boolean;
  onHistoryClick: () => void;
  defaultSymbol?: string;
  defaultPrice?: number | null;
}

export const TradingViewSelector = ({ 
  onConfigSubmit, 
  isLoading, 
  onHistoryClick,
  defaultSymbol,
  defaultPrice
}: TradingViewSelectorProps) => {
  const [symbol, setSymbol] = useState(defaultSymbol || "");
  const [customHours, setCustomHours] = useState<string>("24");

  useEffect(() => {
    if (defaultSymbol) setSymbol(defaultSymbol);
  }, [defaultSymbol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!symbol && !defaultSymbol) {
        toast.error("الرجاء انتظار تحميل الشارت أو اختيار رمز العملة");
        return;
      }
      
      const hours = Number(customHours);
      if (isNaN(hours) || hours < 1 || hours > 72) {
        toast.error("الرجاء إدخال مدة صالحة بين 1 و 72 ساعة");
        return;
      }
      
      console.log("تقديم تحليل:", { 
        symbol: symbol || defaultSymbol, 
        currentPrice: defaultPrice,
        customHours: hours
      });
      
      await onConfigSubmit(symbol || defaultSymbol || "", "1d", defaultPrice || undefined, hours);
      
    } catch (error) {
      console.error("خطأ في تقديم التحليل:", error);
      toast.error("حدث خطأ أثناء تحليل الرسم البياني");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SymbolSelector 
        value={symbol}
        onChange={setSymbol}
        defaultValue={defaultSymbol}
      />

      <AnalysisDurationInput
        value={customHours}
        onChange={setCustomHours}
      />

      <div className="flex gap-2">
        <Button 
          type="submit" 
          className="flex-1" 
          disabled={isLoading || (!symbol && !defaultSymbol)}
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
