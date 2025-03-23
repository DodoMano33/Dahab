
import { useState, useEffect } from 'react';
import { useCurrentPrice } from './useCurrentPrice';

export const usePrice = (symbol: string) => {
  const { currentPrice, fetchLatestPrice } = useCurrentPrice();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initialize price data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchLatestPrice();
        setError(null);
      } catch (err) {
        console.error("Error fetching price:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch price'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up polling every minute
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, [symbol, fetchLatestPrice]);

  return {
    currentPrice,
    isLoading,
    error,
    refresh: fetchLatestPrice
  };
};
