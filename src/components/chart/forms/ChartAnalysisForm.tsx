import { useState } from "react";
import { SymbolInput } from "../inputs/SymbolInput";
import { PriceInput } from "../inputs/PriceInput";
import { AnalysisButtonGroup } from "../buttons/AnalysisButtonGroup";
import { toast } from "sonner";

interface ChartAnalysisFormProps {
  onSubmit: (
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
  isAnalyzing: boolean;
  onHistoryClick: () => void;
}

export const ChartAnalysisForm = ({
  onSubmit,
  isAnalyzing,
  onHistoryClick
}: ChartAnalysisFormProps) => {
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (
    e: React.MouseEvent,
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

    const timeframe = "5";
    
    console.log(`تحليل ${isPatternAnalysis ? 'Patterns' : isWaves ? 'Waves' : isGann ? 'Gann' : isTurtleSoup ? 'Turtle Soup' : isICT ? 'ICT' : isSMC ? 'SMC' : isAI ? 'بالذكاء الاصطناعي' : isScalping ? 'سكالبينج' : 'عادي'} للرمز ${symbol}`);
    
    onSubmit(
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
    <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <SymbolInput value={symbol} onChange={setSymbol} />
      <PriceInput value={price} onChange={setPrice} />
      <AnalysisButtonGroup
        isAnalyzing={isAnalyzing}
        onSubmit={handleSubmit}
        onHistoryClick={onHistoryClick}
      />
    </form>
  );
};