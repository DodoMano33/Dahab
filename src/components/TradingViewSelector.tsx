
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { toast } from "sonner";
import { PriceInput } from "./chart/inputs/PriceInput";
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
  const [currentPrice, setCurrentPrice] = useState(defaultPrice?.toString() || "");
  const [customHours, setCustomHours] = useState<string>("24");
  const [tradingViewPrice, setTradingViewPrice] = useState<number | null>(null);

  useEffect(() => {
    if (defaultSymbol) setSymbol(defaultSymbol);
    if (defaultPrice) setCurrentPrice(defaultPrice.toString());
    
    // استمع لتحديثات أسعار TradingView
    const handleTradingViewPriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        console.log('TradingViewSelector received price update:', event.detail.price);
        setTradingViewPrice(event.detail.price);
      }
    };
    
    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    
    // طلب السعر الحالي عند التحميل
    window.dispatchEvent(new Event('request-current-price'));
    
    return () => {
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    };
  }, [defaultSymbol, defaultPrice]);

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
      <SymbolSelector 
        value={symbol}
        onChange={setSymbol}
        defaultValue={defaultSymbol}
      />
      
      <PriceInput
        value={currentPrice}
        onChange={setCurrentPrice}
        defaultValue={defaultPrice?.toString()}
        tradingViewPrice={tradingViewPrice}
      />

      <AnalysisDurationInput
        value={customHours}
        onChange={setCustomHours}
      />

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
