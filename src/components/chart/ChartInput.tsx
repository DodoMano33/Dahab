import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { toast } from "sonner";
import { AnalysisButton } from "./buttons/AnalysisButton";
import { PatternButton } from "./buttons/PatternButton";
import { TechnicalButtons } from "./buttons/TechnicalButtons";
import { SymbolInput } from "./inputs/SymbolInput";
import { PriceInput } from "./inputs/PriceInput";

interface ChartInputProps {
  mode: "tradingview";
  onTradingViewConfig: (
    symbol: string, 
    timeframe: string, 
    providedPrice?: number, 
    isScalping?: boolean, 
    isAI?: boolean, 
    isSMC?: boolean, 
    isICT?: boolean, 
    isTurtleSoup?: boolean, 
    isGann?: boolean, 
    isWaves?: boolean,
    isPatternAnalysis?: boolean
  ) => void;
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
    isWaves: boolean = false,
    isPatternAnalysis: boolean = false
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

    const timeframe = isWaves ? "5" : isScalping ? "5" : "D";
    console.log(`تحليل ${isPatternAnalysis ? 'Patterns' : isWaves ? 'Waves' : isGann ? 'Gann' : isTurtleSoup ? 'Turtle Soup' : isICT ? 'ICT' : isSMC ? 'SMC' : isAI ? 'بالذكاء الاصطناعي' : isScalping ? 'سكالبينج' : 'عادي'} للرمز ${symbol}`);
    
    onTradingViewConfig(
      symbol, 
      timeframe, 
      providedPrice, 
      isScalping, 
      isAI, 
      isSMC, 
      isICT, 
      isTurtleSoup, 
      isGann, 
      isWaves,
      isPatternAnalysis
    );
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <SymbolInput value={symbol} onChange={setSymbol} />
      <PriceInput value={price} onChange={setPrice} />

      <div className="flex flex-wrap gap-2 pt-4">
        <AnalysisButton 
          isAnalyzing={isAnalyzing} 
          onClick={(e) => handleSubmit(e)} 
        />

        <PatternButton 
          isAnalyzing={isAnalyzing}
          onClick={(e) => handleSubmit(e, false, false, false, false, false, false, false, true)}
        />

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
          onClick={(e) => handleSubmit(e, false, true)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Brain className="w-4 h-4" />
          تحليل ذكي
        </Button>

        <TechnicalButtons
          isAnalyzing={isAnalyzing}
          onSMCClick={(e) => handleSubmit(e, false, false, true)}
          onICTClick={(e) => handleSubmit(e, false, false, false, true)}
          onTurtleSoupClick={(e) => handleSubmit(e, false, false, false, false, true)}
          onGannClick={(e) => handleSubmit(e, false, false, false, false, false, true)}
          onWavesClick={(e) => handleSubmit(e, false, false, false, false, false, false, true)}
        />
        
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