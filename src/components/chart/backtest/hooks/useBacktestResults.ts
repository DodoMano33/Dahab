
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { getStrategyName } from '@/utils/technicalAnalysis/analysisTypeMap';

const PAGE_SIZE = 500; // Changed from 100 to 500

export const useBacktestResults = () => {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [currentTradingViewPrice, setCurrentTradingViewPrice] = useState<number | null>(null);
  const [lastPriceUpdateTime, setLastPriceUpdateTime] = useState<Date | null>(null);

  // استمع لتحديثات السعر من TradingView ومن أحداث التطبيق المختلفة
  useEffect(() => {
    const handleTradingViewPriceUpdate = (event: CustomEvent) => {
      try {
        if (event.detail && event.detail.price !== undefined && event.detail.price !== null) {
          console.log('Backtest results received price update:', event.detail.price);
          setCurrentTradingViewPrice(event.detail.price);
          setLastPriceUpdateTime(new Date());
        }
      } catch (error) {
        console.error('Error handling price update in Backtest results:', error);
      }
    };

    // استمع لجميع أحداث تحديث السعر المحتملة
    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    window.addEventListener('global-price-update', handleTradingViewPriceUpdate as EventListener);
    window.addEventListener('current-price-response', handleTradingViewPriceUpdate as EventListener);
    
    // طلب السعر الحالي عند تحميل المكون
    window.dispatchEvent(new Event('request-current-price'));
    
    // استمع لرسائل TradingView المباشرة
    const handleTradingViewMessages = (event: MessageEvent) => {
      try {
        if (event.data && event.data.name === 'price-update' && 
            event.data.price !== undefined && event.data.price !== null) {
          setCurrentTradingViewPrice(event.data.price);
          setLastPriceUpdateTime(new Date());
        }
      } catch (error) {
        console.error('Error handling TradingView message in Backtest results:', error);
      }
    };
    
    window.addEventListener('message', handleTradingViewMessages);
    
    return () => {
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
      window.removeEventListener('global-price-update', handleTradingViewPriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handleTradingViewPriceUpdate as EventListener);
      window.removeEventListener('message', handleTradingViewMessages);
    };
  }, []);

  // تنفيذ طلب السعر بشكل متكرر
  useEffect(() => {
    const requestPriceInterval = setInterval(() => {
      window.dispatchEvent(new Event('request-current-price'));
    }, 30000); // طلب تحديث كل 30 ثانية
    
    return () => clearInterval(requestPriceInterval);
  }, []);

  const fetchResults = async (pageNumber: number) => {
    try {
      console.log(`Fetching backtest results page ${pageNumber}...`);
      const start = pageNumber * PAGE_SIZE;
      
      const { data, error, count } = await supabase
        .from('backtest_results')
        .select('*', { count: 'exact' })
        .range(start, start + PAGE_SIZE - 1)
        .order('result_timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching results:', error);
        toast.error('حدث خطأ أثناء جلب النتائج');
        return;
      }

      console.log(`Fetched ${data?.length} results`);
      
      // Process results to enhance analysis types
      const processedResults = data?.map(result => {
        // Make sure analysis_type is properly set
        if (!result.analysis_type) {
          console.warn(`Result with missing analysis_type:`, result.id);
          result.analysis_type = 'normal';
        }
        
        // Make sure profit_loss is correctly formatted
        if (result.profit_loss !== null && result.profit_loss !== undefined) {
          // Store the absolute value - we'll format it with the sign later based on is_success
          result.profit_loss = Math.abs(Number(result.profit_loss));
        }
        
        // Log the analysis type for debugging
        console.log(`Result ${result.id} has analysis_type: ${result.analysis_type} -> ${getStrategyName(result.analysis_type)}`);
        
        return result;
      }) || [];
      
      // Log unique analysis types from this batch
      if (processedResults.length > 0) {
        console.log('Unique analysis types in this batch:', 
          [...new Set(processedResults.map(r => r.analysis_type))]);
      }
      
      // Calculate total profit/loss
      let total = 0;
      processedResults.forEach(result => {
        if (result.profit_loss !== null && result.profit_loss !== undefined) {
          if (result.is_success) {
            total += Number(result.profit_loss);
          } else {
            total -= Number(result.profit_loss);
          }
        }
      });
      
      // If we're on page 0, reset the total, otherwise add to it
      if (pageNumber === 0) {
        setResults(processedResults);
        setTotalProfitLoss(total);
      } else {
        setResults(prev => [...prev, ...processedResults]);
        setTotalProfitLoss(prev => prev + total);
      }

      setHasMore((count || 0) > (start + PAGE_SIZE));
    } catch (error) {
      console.error('Error in fetchResults:', error);
      toast.error('حدث خطأ أثناء جلب النتائج');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const refresh = useCallback(async () => {
    setPage(0);
    setHasMore(true);
    setIsLoading(true);
    await fetchResults(0);
  }, []);

  useEffect(() => {
    fetchResults(page);
  }, [page]);

  return {
    results,
    isLoading,
    hasMore,
    loadMore,
    refresh,
    totalProfitLoss,
    currentTradingViewPrice,
    lastPriceUpdateTime
  };
};
