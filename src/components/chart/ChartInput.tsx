import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Brain, TrendingUp, Building2, Turtle, Activity, Waves } from "lucide-react";

interface ChartInputProps {
  mode: "tradingview";
  onTradingViewConfig: (symbol: string, timeframe: string, providedPrice?: number, isScalping?: boolean, isAI?: boolean, isSMC?: boolean, isICT?: boolean, isTurtleSoup?: boolean, isGann?: boolean, isWaves?: boolean) => void;
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

  const handleSubmit = (
    e: React.FormEvent, 
    isScalping: boolean = false, 
    isAI: boolean = false, 
    isSMC: boolean = false, 
    isICT: boolean = false, 
    isTurtleSoup: boolean = false, 
    isGann: boolean = false,
    isWaves: boolean = false
  ) => {
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

    const timeframe = isScalping ? "5" : "D";
    console.log(`تحليل ${isWaves ? 'Waves' : isGann ? 'Gann' : isTurtleSoup ? 'Turtle Soup' : isICT ? 'ICT' : isSMC ? 'SMC' : isAI ? 'بالذكاء الاصطناعي' : isScalping ? 'سكالبينج' : 'عادي'} للرمز ${symbol}`);
    onTradingViewConfig(symbol, timeframe, providedPrice, isScalping, isAI, isSMC, isICT, isTurtleSoup, isGann, isWaves);
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

      <div className="flex flex-wrap gap-2 pt-4">
        <Button
          type="submit"
          disabled={isAnalyzing}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isAnalyzing ? "جاري التحليل..." : "تحليل عادي"}
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
          disabled={isAnalyzing}
          onClick={(e) => handleSubmit(e, false, false, true)}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          تحليل SMC
        </Button>

        <Button
          type="button"
          disabled={isAnalyzing}
          onClick={(e) => handleSubmit(e, false, false, false, true)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
        >
          <Building2 className="w-4 h-4" />
          تحليل ICT
        </Button>

        <Button
          type="button"
          disabled={isAnalyzing}
          onClick={(e) => handleSubmit(e, false, false, false, false, true)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Turtle className="w-4 h-4" />
          تحليل Turtle Soup
        </Button>

        <Button
          type="button"
          disabled={isAnalyzing}
          onClick={(e) => handleSubmit(e, false, false, false, false, false, true)}
          className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          تحليل Gann
        </Button>

        <Button
          type="button"
          disabled={isAnalyzing}
          onClick={(e) => handleSubmit(e, false, false, false, false, false, false, true)}
          className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
        >
          <Waves className="w-4 h-4" />
          تحليل Waves
        </Button>

        <Button
          type="button"
          disabled={isAnalyzing}
          onClick={(e) => handleSubmit(e, false, true)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Brain className="w-4 h-4" />
          تحليل ذكي
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