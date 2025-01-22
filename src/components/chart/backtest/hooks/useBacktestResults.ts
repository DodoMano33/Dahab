import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const PAGE_SIZE = 100; // Changed from 20 to 100

export const useBacktestResults = () => {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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
      
      if (pageNumber === 0) {
        setResults(data || []);
      } else {
        setResults(prev => [...prev, ...(data || [])]);
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
    refresh
  };
};