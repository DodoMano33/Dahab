import { useState, useEffect } from "react";
import { SymbolInput } from "../inputs/SymbolInput";
import { PriceInput } from "../inputs/PriceInput";
import { TimeframeInput } from "../inputs/TimeframeInput";
import { AnalysisButtonGroup } from "../buttons/AnalysisButtonGroup";
import { CombinedAnalysisDialog } from "../analysis/CombinedAnalysisDialog";
import { AnalysisDurationInput } from "../inputs/AnalysisDurationInput";
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
    isPatternAnalysis?: boolean,
    isPriceAction?: boolean
  ) => void;
  isAnalyzing: boolean;
  onHistoryClick: () => void;
  currentAnalysis?: string;
  defaultSymbol?: string;
  defaultPrice?: number | null;
  defaultDuration?: string;
  onDurationChange?: (duration: string) => void;
}

export const ChartAnalysisForm = ({
  onSubmit,
  isAnalyzing,
  onHistoryClick,
  currentAnalysis,
  defaultSymbol,
  defaultPrice,
  defaultDuration,
  onDurationChange
}: ChartAnalysisFormProps) => {
  const [symbol, setSymbol] = useState(defaultSymbol || "");
  const [price, setPrice] = useState(defaultPrice?.toString() || "");
  const [timeframe, setTimeframe] = useState("1d");
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [customHours, setCustomHours] = useState(defaultDuration || "8");

  useEffect(() => {
    if (defaultSymbol) setSymbol(defaultSymbol);
    if (defaultPrice) setPrice(defaultPrice.toString());
    if (defaultDuration) setCustomHours(defaultDuration);
  }, [defaultSymbol, defaultPrice, defaultDuration]);

  const handleCustomHoursChange = (value: string) => {
    setCustomHours(value);
    if (onDurationChange) {
      onDurationChange(value);
    }
  };

  const handleSubmit = (
    e: React.MouseEvent,
    isScalping: boolean = false,
    isAI: boolean = false,
    isSMC: boolean = false,
    isICT: boolean = false,
    isTurtleSoup: boolean = false,
    isGann: boolean = false,
    isWaves: boolean = false,
    isPatternAnalysis: boolean = false,
    isPriceAction: boolean = false
  ) => {
    e.preventDefault();
    
    if (!symbol && !defaultSymbol) {
      toast.error("الرجاء إدخال رمز العملة أو انتظار تحميل الشارت");
      return;
    }

    const providedPrice = price ? Number(price) : defaultPrice;
    if (!providedPrice) {
      toast.error("الرجاء إدخال السعر أو انتظار تحميل الشارت");
      return;
    }

    if (isNaN(providedPrice)) {
      toast.error("الرجاء إدخال سعر صحيح");
      return;
    }

    if (isAI) {
      setIsAIDialogOpen(true);
      return;
    }
    
    console.log(`تحليل ${currentAnalysis} للرمز ${symbol || defaultSymbol} على الإطار الزمني ${timeframe}`);
    console.log("Price Action Analysis:", isPriceAction);
    
    onSubmit(
      symbol || defaultSymbol || "",
      timeframe,
      providedPrice,
      isScalping,
      isAI,
      isSMC,
      isICT,
      isTurtleSoup,
      isGann,
      isWaves,
      isPatternAnalysis,
      isPriceAction
    );
  };

  const handleCombinedAnalysis = (selectedTypes: string[]) => {
    const providedPrice = price ? Number(price) : defaultPrice;
    if (!providedPrice) {
      toast.error("الرجاء إدخال السعر الحالي للتحليل المدمج أو انتظار تحميل الشارت");
      return;
    }

    console.log("Starting combined analysis with types:", selectedTypes);
    
    const analysisFlags = {
      isScalping: selectedTypes.includes("scalping"),
      isAI: true,
      isSMC: selectedTypes.includes("smc"),
      isICT: selectedTypes.includes("ict"),
      isTurtleSoup: selectedTypes.includes("turtleSoup"),
      isGann: selectedTypes.includes("gann"),
      isWaves: selectedTypes.includes("waves"),
      isPatternAnalysis: selectedTypes.includes("patterns"),
      isPriceAction: selectedTypes.includes("priceAction")
    };

    onSubmit(
      symbol || defaultSymbol || "",
      timeframe,
      providedPrice,
      analysisFlags.isScalping,
      analysisFlags.isAI,
      analysisFlags.isSMC,
      analysisFlags.isICT,
      analysisFlags.isTurtleSoup,
      analysisFlags.isGann,
      analysisFlags.isWaves,
      analysisFlags.isPatternAnalysis,
      analysisFlags.isPriceAction
    );
  };

  return (
    <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <SymbolInput 
        value={symbol} 
        onChange={setSymbol} 
        defaultValue={defaultSymbol}
      />
      <PriceInput 
        value={price} 
        onChange={setPrice}
        defaultValue={defaultPrice?.toString()}
      />
      <TimeframeInput value={timeframe} onChange={setTimeframe} />
      <AnalysisDurationInput
        value={customHours}
        onChange={handleCustomHoursChange}
      />
      <AnalysisButtonGroup
        isAnalyzing={isAnalyzing}
        onSubmit={handleSubmit}
        onHistoryClick={onHistoryClick}
        currentAnalysis={currentAnalysis}
      />
      <CombinedAnalysisDialog
        isOpen={isAIDialogOpen}
        onClose={() => setIsAIDialogOpen(false)}
        onAnalyze={handleCombinedAnalysis}
      />
    </form>
  );
};
