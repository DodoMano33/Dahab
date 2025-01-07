import { useState } from "react";
import { TimeframeAnalysis } from "./TimeframeAnalysis";
import { IntervalAnalysis } from "./IntervalAnalysis";
import { AnalysisTypes } from "./AnalysisTypes";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { SearchHistory } from "../SearchHistory";
import { SymbolPriceInput } from "./SymbolPriceInput";
import { AutoAnalysis } from "./AutoAnalysis";

interface AnalysisSettingsProps {
  onTimeframesChange: (timeframes: string[]) => void;
  onIntervalChange: (interval: string) => void;
}

export const AnalysisSettings = ({
  onTimeframesChange,
  onIntervalChange,
}: AnalysisSettingsProps) => {
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<string>("");
  const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState<string[]>([]);
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleTimeframesChange = (timeframes: string[]) => {
    setSelectedTimeframes(timeframes);
    onTimeframesChange(timeframes);
  };

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval);
    onIntervalChange(interval);
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

  const refreshHistory = () => {
    setIsHistoryOpen(false);
    setTimeout(() => setIsHistoryOpen(true), 100);
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
        <AutoAnalysis
          symbol={symbol}
          price={price}
          selectedTimeframes={selectedTimeframes}
          selectedInterval={selectedInterval}
          selectedAnalysisTypes={selectedAnalysisTypes}
          onAnalysisComplete={refreshHistory}
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
        onDelete={() => {}}
        validHistory={[]}
        handleSelect={handleSelect}
      />
    </div>
  );
};