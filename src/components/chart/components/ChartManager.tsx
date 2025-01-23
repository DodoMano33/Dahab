import { LiveTradingViewChart } from "../LiveTradingViewChart";

interface ChartManagerProps {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
  onPriceUpdate: (price: number) => void;
}

export const ChartManager = ({
  symbol,
  onSymbolChange,
  onPriceUpdate,
}: ChartManagerProps) => {
  return (
    <LiveTradingViewChart
      symbol={symbol}
      onSymbolChange={onSymbolChange}
      onPriceUpdate={onPriceUpdate}
    />
  );
};