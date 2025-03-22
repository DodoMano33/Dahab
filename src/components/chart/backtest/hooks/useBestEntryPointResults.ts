
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const PAGE_SIZE = 100;

export const useBestEntryPointResults = () => {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
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
      console.log(`Fetching best entry point results page ${pageNumber}...`);
      const start = pageNumber * PAGE_SIZE;
      
      const { data, error, count } = await supabase
        .from('best_entry_point_results')
        .select('*', { count: 'exact' })
        .range(start, start + PAGE_SIZE - 1)
        .order('result_timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching best entry point results:', error);
        toast.error('حدث خطأ أثناء جلب نتائج أفضل نقاط الدخول');
        return;
      }

      console.log(`Fetched ${data?.length} best entry point results`);
      
      // Process results to ensure direction is properly set
      const processedResults = data?.map(result => {
        // Make sure direction is logged for debugging
        if (result.direction) {
          console.log(`Result ${result.id} has direction: ${result.direction}`);
        }
        return result;
      }) || [];
      
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
    setSelectedItems(new Set());
    await fetchResults(0);
  }, []);

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = results.map(item => item.id);
      setSelectedItems(new Set(allIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) {
      toast.error('الرجاء تحديد عناصر للحذف');
      return;
    }

    try {
      setIsDeleting(true);
      const selectedIds = Array.from(selectedItems);
      
      // حذف العناصر المحددة واحدًا تلو الآخر
      for (const id of selectedIds) {
        const { error } = await supabase
          .from('best_entry_point_results')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error(`Error deleting entry point result ${id}:`, error);
          toast.error('حدث خطأ أثناء حذف بعض النتائج');
        }
      }
      
      setSelectedItems(new Set());
      toast.success('تم حذف العناصر المحددة بنجاح');
      await refresh();
    } catch (error) {
      console.error('Error deleting selected items:', error);
      toast.error('حدث خطأ أثناء حذف العناصر المحددة');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchResults(page);
  }, [page]);

  return {
    results,
    isLoading,
    hasMore,
    loadMore,
    refresh,
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    handleDeleteSelected,
    isDeleting,
    currentTradingViewPrice
  };
};
