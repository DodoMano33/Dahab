import { useState } from "react";
import { SymbolInput } from "../inputs/SymbolInput";
import { PriceInput } from "../inputs/PriceInput";
import { TimeframeInput } from "../inputs/TimeframeInput";
import { AnalysisButtonGroup } from "../buttons/AnalysisButtonGroup";
import { CombinedAnalysisDialog } from "../analysis/CombinedAnalysisDialog";
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
  onPriceChange?: (price: string) => void;
  currentPrice?: string;
}

export const ChartAnalysisForm = ({
  onSubmit,
  isAnalyzing,
  onHistoryClick,
  currentAnalysis,
  onPriceChange,
  currentPrice = ""
}: ChartAnalysisFormProps) => {
  const [symbol, setSymbol] = useState("");
  const [timeframe, setTimeframe] = useState("1d");
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);

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
    
    if (!symbol) {
      toast.error("الرجاء إدخال رمز العملة");
      return;
    }

    const providedPrice = currentPrice ? Number(currentPrice) : undefined;
    if (currentPrice && isNaN(providedPrice!)) {
      toast.error("الرجاء إدخال سعر صحيح");
      return;
    }

    if (isAI) {
      setIsAIDialogOpen(true);
      return;
    }
    
    console.log(`تحليل ${currentAnalysis} للرمز ${symbol} على الإطار الزمني ${timeframe}`);
    console.log("Price Action Analysis:", isPriceAction); // Added for debugging
    
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
      isPatternAnalysis,
      isPriceAction
    );
  };

  const handleCombinedAnalysis = (selectedTypes: string[]) => {
    const providedPrice = currentPrice ? Number(currentPrice) : undefined;
    if (!providedPrice) {
      toast.error("الرجاء إدخال السعر الحالي للتحليل المدمج");
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
      symbol,
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
      <SymbolInput value={symbol} onChange={setSymbol} />
      <PriceInput 
        value={currentPrice} 
        onChange={(value) => onPriceChange?.(value)} 
      />
      <TimeframeInput value={timeframe} onChange={setTimeframe} />
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
