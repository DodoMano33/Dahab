import { useState } from "react";
import { SymbolPriceInput } from "../analysis/SymbolPriceInput";
import { AutoAnalysis } from "../analysis/AutoAnalysis";

interface AnalysisFormProps {
  onAnalysis: (result: any) => void;
  isAnalyzing: boolean;
  currentAnalysis: string;
  selectedTimeframes: string[];
  selectedInterval: string;
  selectedAnalysisTypes: string[];
}

export const AnalysisForm = ({
  onAnalysis,
  isAnalyzing,
  currentAnalysis,
  selectedTimeframes,
  selectedInterval,
  selectedAnalysisTypes
}: AnalysisFormProps) => {
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");

  const handleAutoAnalysis = () => {
    console.log("Starting auto analysis from AnalysisForm");
  };

  return (
    <div className="space-y-4">
      <SymbolPriceInput
        symbol={symbol}
        price={price}
        onSymbolChange={setSymbol}
        onPriceChange={setPrice}
        onAutoAnalysis={handleAutoAnalysis}
        selectedTimeframes={selectedTimeframes}
        selectedInterval={selectedInterval}
        selectedAnalysisTypes={selectedAnalysisTypes}
      />
      
      <AutoAnalysis
        symbol={symbol}
        price={price}
        selectedTimeframes={selectedTimeframes}
        selectedInterval={selectedInterval}
        selectedAnalysisTypes={selectedAnalysisTypes}
        onAnalysisComplete={onAnalysis}
      />
    </div>
  );
};