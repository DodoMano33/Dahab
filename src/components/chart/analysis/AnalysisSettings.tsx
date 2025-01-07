import { useState, useEffect } from "react";
import { TimeframeAnalysis } from "./TimeframeAnalysis";
import { IntervalAnalysis } from "./IntervalAnalysis";
import { AnalysisTypes } from "./AnalysisTypes";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { toast } from "sonner";
import { useAnalysisHandler } from "./AnalysisHandler";
import { useAuth } from "@/contexts/AuthContext";
import { SearchHistory } from "../SearchHistory";
import { supabase } from "@/lib/supabase";
import { AutoAnalysisButton } from "./AutoAnalysisButton";
import { SymbolPriceInput } from "./SymbolPriceInput";

interface AnalysisSettingsProps {
  onTimeframesChange: (timeframes: string[]) => void;
  onIntervalChange: (interval: string) => void;
}

export const AnalysisSettings = ({
  onTimeframesChange,
  onIntervalChange,
}: AnalysisSettingsProps) => {
  const { user } = useAuth();
  const { handleTradingViewConfig } = useAnalysisHandler();
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<string>("");
  const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisInterval, setAnalysisInterval] = useState<NodeJS.Timeout | null>(null);
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");
  
  // History related state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      if (analysisInterval) {
        clearInterval(analysisInterval);
      }
    };
  }, []);

  const handleTimeframesChange = (timeframes: string[]) => {
    setSelectedTimeframes(timeframes);
    onTimeframesChange(timeframes);
  };

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval);
    onIntervalChange(interval);
  };

  const validateInputs = () => {
    if (!symbol) {
      toast.error("الرجاء اختيار رمز العملة");
      return false;
    }

    if (!price) {
      toast.error("الرجاء إدخال السعر الحالي");
      return false;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("الرجاء إدخال سعر صحيح");
      return false;
    }

    if (selectedTimeframes.length === 0) {
      toast.error("الرجاء اختيار إطار زمني واحد على الأقل");
      return false;
    }

    if (!selectedInterval) {
      toast.error("الرجاء اختيار مدة التحليل");
      return false;
    }

    if (selectedAnalysisTypes.length === 0) {
      toast.error("الرجاء اختيار نوع تحليل واحد على الأقل");
      return false;
    }

    return true;
  };

  const startAnalysis = async () => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول لبدء التحليل التلقائي");
      return;
    }

    if (!validateInputs()) {
      return;
    }

    setIsAnalyzing(true);
    console.log("بدء التحليل التلقائي:", {
      timeframes: selectedTimeframes,
      interval: selectedInterval,
      analysisTypes: selectedAnalysisTypes
    });

    const intervalMs = getIntervalInMs(selectedInterval);
    const numericPrice = Number(price);

    const interval = setInterval(async () => {
      try {
        for (const timeframe of selectedTimeframes) {
          for (const analysisType of selectedAnalysisTypes) {
            if (analysisType !== "normal") {
              await handleTradingViewConfig(
                symbol,
                timeframe,
                numericPrice,
                analysisType === "scalping",
                false,
                analysisType === "smc",
                analysisType === "ict",
                analysisType === "turtleSoup",
                analysisType === "gann",
                analysisType === "waves",
                analysisType === "patterns",
                analysisType === "priceAction"
              );
            }
          }
        }
      } catch (error) {
        console.error("خطأ في التحليل التلقائي:", error);
        toast.error("حدث خطأ أثناء التحليل التلقائي");
      }
    }, intervalMs);

    setAnalysisInterval(interval);
    toast.success("تم بدء التحليل التلقائي");
  };

  const stopAnalysis = () => {
    if (analysisInterval) {
      clearInterval(analysisInterval);
      setAnalysisInterval(null);
    }
    setIsAnalyzing(false);
    toast.success("تم إيقاف التحليل التلقائي");
  };

  const handleHistoryClick = () => {
    setIsHistoryOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("تم حذف العنصر بنجاح");
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      console.error("Error deleting history item:", error);
      toast.error("حدث خطأ أثناء حذف العنصر");
    }
  };

  const handleSelect = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      <SymbolPriceInput
        symbol={symbol}
        price={price}
        onSymbolChange={setSymbol}
        onPriceChange={setPrice}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TimeframeAnalysis
          selectedTimeframes={selectedTimeframes}
          onTimeframeChange={handleTimeframesChange}
        />
        <IntervalAnalysis
          selectedInterval={selectedInterval}
          onIntervalChange={handleIntervalChange}
        />
        <AnalysisTypes
          selectedTypes={selectedAnalysisTypes}
          onTypesChange={setSelectedAnalysisTypes}
        />
      </div>

      <div className="flex flex-col gap-4 items-center">
        <AutoAnalysisButton
          isAnalyzing={isAnalyzing}
          onClick={isAnalyzing ? stopAnalysis : startAnalysis}
          disabled={!symbol || !price}
        />

        <Button
          onClick={() => setIsHistoryOpen(true)}
          variant="outline"
          className="flex items-center gap-2 w-full md:w-auto"
        >
          <History className="w-5 h-5" />
          سجل البحث الذي تم اختباره
        </Button>
      </div>

      <SearchHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        dateRange={dateRange}
        setDateRange={setDateRange}
        isDatePickerOpen={isDatePickerOpen}
        setIsDatePickerOpen={setIsDatePickerOpen}
        selectedItems={selectedItems}
        onDelete={handleDelete}
        validHistory={[]}
        handleSelect={handleSelect}
      />
    </div>
  );
};

const getIntervalInMs = (interval: string): number => {
  switch (interval) {
    case "1m":
      return 60 * 1000;
    case "5m":
      return 5 * 60 * 1000;
    case "30m":
      return 30 * 60 * 1000;
    case "1h":
      return 60 * 60 * 1000;
    case "4h":
      return 4 * 60 * 60 * 1000;
    case "1d":
      return 24 * 60 * 60 * 1000;
    default:
      return 5 * 60 * 1000;
  }
};