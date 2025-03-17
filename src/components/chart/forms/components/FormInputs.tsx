
import React from "react";
import { SymbolInput } from "../../inputs/SymbolInput";
import { TimeframeInput } from "../../inputs/TimeframeInput";
import { AnalysisDurationInput } from "../../inputs/AnalysisDurationInput";

interface FormInputsProps {
  symbol: string;
  setSymbol: (value: string) => void;
  timeframe: string;
  setTimeframe: (value: string) => void;
  duration: string;
  setDuration: (value: string) => void;
}

export const FormInputs = ({
  symbol,
  setSymbol,
  timeframe,
  setTimeframe,
  duration,
  setDuration
}: FormInputsProps) => {
  return (
    <>
      <SymbolInput 
        value={symbol} 
        onChange={setSymbol} 
        defaultValue={symbol}
        disabled={true}
      />
      
      <AnalysisDurationInput
        value={duration}
        onChange={setDuration}
      />
      
      <TimeframeInput value={timeframe} onChange={setTimeframe} />
    </>
  );
};
