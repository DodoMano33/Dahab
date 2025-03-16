
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const PAGE_SIZE = 500; // Changed from 100 to 500

export const useBacktestResults = () => {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [currentTradingViewPrice, setCurrentTradingViewPrice] = useState<number | null>(null);

  // استمع لتحديثات السعر من TradingView
  useEffect(() => {
    const handleTradingViewPriceUpdate = (event: MessageEvent) => {
      try {
        if (event.data && event.data.name === 'price-update' && event.data.price) {
          console.log('TradingView price updated:', event.data.price);
          setCurrentTradingViewPrice(event.data.price);
        }
      } catch (error) {
        console.error('Error handling TradingView price update:', error);
      }
    };

    window.addEventListener('message', handleTradingViewPriceUpdate);
    return () => {
      window.removeEventListener('message', handleTradingViewPriceUpdate);
    };
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
      
      // طباعة بعض البيانات للتشخيص
      if (data && data.length > 0) {
        console.log('First result sample:', {
          id: data[0].id,
          created_at: data[0].created_at,
          result_timestamp: data[0].result_timestamp
        });
      }
      
      // معالجة النتائج للتأكد من أن البيانات صحيحة
      const processedResults = data?.map(result => {
        // التأكد من أن نوع التحليل موجود
        if (!result.analysis_type) {
          console.warn(`Result with missing analysis_type:`, result.id);
          result.analysis_type = 'normal';
        }
        
        // التأكد من أن تاريخ النتيجة ليس فارغاً (إذا كان فارغاً، ضع قيمة فارغة واضحة)
        if (!result.result_timestamp) {
          console.warn(`Result with empty result_timestamp:`, result.id);
          result.result_timestamp = null;
        }
        
        return result;
      }) || [];
      
      // If we're on page 0, reset the results, otherwise add to them
      if (pageNumber === 0) {
        setResults(processedResults);
      } else {
        setResults(prev => [...prev, ...processedResults]);
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
    currentTradingViewPrice
  };
};
