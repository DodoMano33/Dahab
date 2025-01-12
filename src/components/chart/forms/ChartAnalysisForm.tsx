import { useState } from "react";
import { SymbolInput } from "../inputs/SymbolInput";
import { PriceInput } from "../inputs/PriceInput";
import { TimeframeInput } from "../inputs/TimeframeInput";
import { AnalysisButtonGroup } from "../buttons/AnalysisButtonGroup";
import { CombinedAnalysisDialog } from "../analysis/CombinedAnalysisDialog";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

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
}

export const ChartAnalysisForm = ({
  onSubmit,
  isAnalyzing,
  onHistoryClick,
  currentAnalysis
}: ChartAnalysisFormProps) => {
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");
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

    const providedPrice = price ? Number(price) : undefined;
    if (price && isNaN(providedPrice!)) {
      toast.error("الرجاء إدخال سعر صحيح");
      return;
    }

    if (isAI) {
      setIsAIDialogOpen(true);
      return;
    }
    
    console.log(`تحليل ${currentAnalysis} للرمز ${symbol} على الإطار الزمني ${timeframe}`);
    
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
    const providedPrice = price ? Number(price) : undefined;
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
    <div className="space-y-8">
      <form className="space-y-8">
        {/* Input Fields Section */}
        <Card className="p-6">
          <div className="space-y-4">
            <SymbolInput value={symbol} onChange={setSymbol} />
            <PriceInput value={price} onChange={setPrice} />
            <TimeframeInput value={timeframe} onChange={setTimeframe} />
          </div>
        </Card>

        {/* Manual Analysis Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-center mb-4 text-red-500">التحليل اليدوي</h2>
          <AnalysisButtonGroup
            isAnalyzing={isAnalyzing}
            onSubmit={handleSubmit}
            onHistoryClick={onHistoryClick}
            currentAnalysis={currentAnalysis}
          />
        </Card>

        {/* Results Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-center mb-4 text-gray-700">النتائج</h2>
          <div className="flex justify-center">
            <button
              onClick={onHistoryClick}
              className="bg-purple-100 text-purple-700 px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-200 transition-colors"
            >
              سجل البحث
            </button>
          </div>
        </Card>

        {/* Auto Analysis Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-center mb-4 text-green-500">التحليل التلقائي</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Auto Analysis content will go here */}
          </div>
        </Card>
      </form>

      <CombinedAnalysisDialog
        isOpen={isAIDialogOpen}
        onClose={() => setIsAIDialogOpen(false)}
        onAnalyze={handleCombinedAnalysis}
      />
    </div>
  );
};