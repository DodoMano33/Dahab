
import { SymbolInput } from "../../inputs/SymbolInput";
import { PriceInput } from "../../inputs/PriceInput";
import { TimeframeInput } from "../../inputs/TimeframeInput";
import { AnalysisDurationInput } from "../../inputs/AnalysisDurationInput";

interface ChartFormInputsProps {
  symbol: string;
  setSymbol: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  timeframe: string;
  setTimeframe: (value: string) => void;
  duration: string;
  setDuration: (value: string) => void;
  defaultSymbol?: string;
  defaultPrice?: string;
}

export const ChartFormInputs = ({
  symbol,
  setSymbol,
  price,
  setPrice,
  timeframe,
  setTimeframe,
  duration,
  setDuration,
  defaultSymbol,
  defaultPrice
}: ChartFormInputsProps) => {
  return (
    <>
      <SymbolInput 
        value={symbol} 
        onChange={setSymbol} 
        defaultValue={defaultSymbol}
      />
      <PriceInput 
        value={price} 
        onChange={setPrice}
        defaultValue={defaultPrice}
      />
      <AnalysisDurationInput
        value={duration}
        onChange={setDuration}
      />
      <TimeframeInput 
        value={timeframe} 
        onChange={setTimeframe} 
      />
    </>
  );
};
