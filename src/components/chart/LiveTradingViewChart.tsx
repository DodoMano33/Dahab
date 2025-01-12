import React, { useState } from 'react';
import { Loader2 } from "lucide-react";
import { TradingViewChartController } from './TradingViewChartController';
import { useChartState } from './hooks/useChartState';

interface LiveTradingViewChartProps {
  symbol: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

export const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ 
  symbol = "XAUUSD",
  onSymbolChange,
  onPriceUpdate
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    isChartReady,
    handleChartReady,
    handlePriceUpdate,
    handleSymbolChange
  } = useChartState();

  const handleReady = () => {
    setIsLoading(false);
    handleChartReady();
  };

  return (
    <div className="relative w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">جاري تحميل الشارت...</p>
          </div>
        </div>
      )}
      <TradingViewChartController
        symbol={symbol}
        onReady={handleReady}
        onPriceUpdate={(price) => {
          handlePriceUpdate(price);
          onPriceUpdate?.(price);
        }}
        onSymbolChange={(newSymbol) => {
          handleSymbolChange(newSymbol);
          onSymbolChange?.(newSymbol);
        }}
      />
    </div>
  );
};