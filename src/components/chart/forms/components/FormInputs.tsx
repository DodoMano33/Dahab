
import React from "react";
import { SymbolInput } from "../../inputs/SymbolInput";
import { PriceInput } from "../../inputs/PriceInput";
import { TimeframeInput } from "../../inputs/TimeframeInput";
import { AnalysisDurationInput } from "../../inputs/AnalysisDurationInput";

interface FormInputsProps {
  symbol: string;
  setSymbol: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  timeframe: string;
  setTimeframe: (value: string) => void;
  duration: string;
  setDuration: (value: string) => void;
  defaultPrice: number | null;
}

export const FormInputs = ({
  symbol,
  setSymbol,
  price,
  setPrice,
  timeframe,
  setTimeframe,
  duration,
  setDuration,
  defaultPrice
}: FormInputsProps) => {
  return (
    <>
      <SymbolInput 
        value={symbol} 
        onChange={setSymbol} 
        defaultValue={symbol}
        disabled={true}
      />
      
      <PriceInput 
        value={price} 
        onChange={setPrice}
        defaultValue={defaultPrice?.toString()}
      />
      
      <AnalysisDurationInput
        value={duration}
        onChange={setDuration}
      />
      
      <TimeframeInput value={timeframe} onChange={setTimeframe} />
    </>
  );
};
