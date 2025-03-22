
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
      
      // Process results to enhance analysis types
      const processedResults = data?.map(result => {
        // Make sure analysis_type is properly set
        if (!result.analysis_type) {
          console.warn(`Result with missing analysis_type:`, result.id);
          result.analysis_type = 'normal';
        }
        
        // احتساب قيمة الربح أو الخسارة بناءً على الاتجاه
        if (result.entry_price !== null && result.entry_price !== undefined) {
          const closePrice = result.is_success ? result.target_price : result.stop_loss;
          
          if (closePrice !== null && closePrice !== undefined) {
            if (result.direction === 'up' || result.direction === 'صاعد') {
              if (result.is_success) {
                // اتجاه صاعد وتحقق الهدف: سعر الإغلاق - سعر الدخول (إيجابي)
                result.profit_loss = Number(closePrice) - Number(result.entry_price);
              } else {
                // اتجاه صاعد ووصل لوقف الخسارة: سعر الدخول - سعر الإغلاق (سلبي)
                result.profit_loss = Number(result.entry_price) - Number(closePrice);
              }
            } else if (result.direction === 'down' || result.direction === 'هابط') {
              if (result.is_success) {
                // اتجاه هابط وتحقق الهدف: سعر الدخول - سعر الإغلاق (إيجابي)
                result.profit_loss = Number(result.entry_price) - Number(closePrice);
              } else {
                // اتجاه هابط ووصل لوقف الخسارة: سعر الإغلاق - سعر الدخول (سلبي)
                result.profit_loss = Number(closePrice) - Number(result.entry_price);
              }
            } else {
              console.warn(`Result with unknown direction: ${result.direction}`);
            }
          }
        }

        // Make sure direction is set properly for DirectionIndicator
        if (result.direction) {
          // الاتجاه سيظل كما هو في قاعدة البيانات (up, down, neutral)
          // سيتم تحويله في واجهة المستخدم إلى (صاعد، هابط، محايد)
          console.log(`Result ${result.id} has direction: ${result.direction}`);
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
          const profitLossValue = Number(result.profit_loss);
          // إذا كانت النتيجة ناجحة، نضيف قيمة الربح (موجبة بالفعل)
          // إذا كانت النتيجة فاشلة، نضيف قيمة الخسارة (سالبة بالفعل)
          total += profitLossValue;
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
    currentTradingViewPrice
  };
};
