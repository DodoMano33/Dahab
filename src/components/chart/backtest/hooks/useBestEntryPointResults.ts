
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const PAGE_SIZE = 500;

export const useBestEntryPointResults = () => {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTradingViewPrice, setCurrentTradingViewPrice] = useState<number | null>(null);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);

  // استمع لتحديثات السعر من TradingView
  useEffect(() => {
    const handleTradingViewPriceUpdate = (event: MessageEvent) => {
      if (event.data && event.data.name === 'price-update' && event.data.price) {
        console.log('TradingView price updated:', event.data.price);
        setCurrentTradingViewPrice(event.data.price);
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
        console.error('Error fetching results:', error);
        toast.error('حدث خطأ أثناء جلب النتائج');
        return;
      }

      // Process results and calculate profit/loss based on direction
      const processedResults = data?.map(result => {
        // احتساب قيمة الربح أو الخسارة بناءً على الاتجاه
        if (result.entry_point_price !== null && result.entry_point_price !== undefined) {
          const closePrice = result.is_success ? result.target_price : result.stop_loss;
          
          if (closePrice !== null && closePrice !== undefined) {
            if (result.direction === 'up' || result.direction === 'صاعد') {
              if (result.is_success) {
                // اتجاه صاعد وتحقق الهدف: سعر الإغلاق - سعر الدخول (إيجابي)
                result.profit_loss = Number(closePrice) - Number(result.entry_point_price);
              } else {
                // اتجاه صاعد ووصل لوقف الخسارة: سعر الدخول - سعر الإغلاق (سلبي)
                result.profit_loss = Number(result.entry_point_price) - Number(closePrice);
              }
            } else if (result.direction === 'down' || result.direction === 'هابط') {
              if (result.is_success) {
                // اتجاه هابط وتحقق الهدف: سعر الدخول - سعر الإغلاق (إيجابي)
                result.profit_loss = Number(result.entry_point_price) - Number(closePrice);
              } else {
                // اتجاه هابط ووصل لوقف الخسارة: سعر الإغلاق - سعر الدخول (سلبي)
                result.profit_loss = Number(closePrice) - Number(result.entry_point_price);
              }
            } else {
              console.warn(`Result with unknown direction: ${result.direction}`);
            }
          }
        }
        
        return result;
      }) || [];
      
      // Calculate total profit/loss
      let total = 0;
      processedResults.forEach(result => {
        if (result.profit_loss !== null && result.profit_loss !== undefined) {
          const profitLossValue = Number(result.profit_loss);
          // إذا كانت النتيجة ناجحة، نضيف قيمة الربح (موجبة بالفعل)
          // إذا كانت النتيجة فاشلة، نضيف قيمة الخسارة (سالبة بالفعل)
          total += profitLossValue;
        }
      });

      // If we're on page 0, reset everything, otherwise add to existing data
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
    setSelectedItems(new Set());
    await fetchResults(0);
  }, []);

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = results.map(result => result.id);
      setSelectedItems(new Set(allIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) {
      toast.error("الرجاء تحديد عناصر للحذف");
      return;
    }

    try {
      setIsDeleting(true);
      const selectedArray = Array.from(selectedItems);
      
      const { error } = await supabase
        .from('best_entry_point_results')
        .delete()
        .in('id', selectedArray);

      if (error) {
        throw error;
      }

      toast.success("تم حذف العناصر المحددة بنجاح");
      await refresh();
    } catch (error) {
      console.error('Error deleting items:', error);
      toast.error("حدث خطأ أثناء حذف العناصر");
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
    currentTradingViewPrice,
    totalProfitLoss
  };
};
