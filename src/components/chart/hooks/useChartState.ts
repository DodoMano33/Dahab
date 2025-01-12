import { useState, useCallback } from 'react';

export const useChartState = () => {
  const [isChartReady, setIsChartReady] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [currentSymbol, setCurrentSymbol] = useState<string>('');

  const handleChartReady = useCallback(() => {
    console.log("Chart is ready");
    setIsChartReady(true);
  }, []);

  const handlePriceUpdate = useCallback((price: number) => {
    console.log("Price updated:", price);
    setCurrentPrice(price);
  }, []);

  const handleSymbolChange = useCallback((symbol: string) => {
    console.log("Symbol changed:", symbol);
    setCurrentSymbol(symbol);
  }, []);

  return {
    isChartReady,
    currentPrice,
    currentSymbol,
    handleChartReady,
    handlePriceUpdate,
    handleSymbolChange
  };
};