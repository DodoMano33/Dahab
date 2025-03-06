
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { getStrategyName } from '@/utils/technicalAnalysis/analysisTypeMap';

interface AnalysisStats {
  type: string;
  success: number;
  fail: number;
}

export const useBacktestStats = () => {
  const [stats, setStats] = useState<AnalysisStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      console.log('Fetching backtest stats...');
      const { data: results, error } = await supabase.rpc('get_backtest_stats');

      if (error) {
        console.error('Error fetching stats:', error);
        toast.error('حدث خطأ أثناء جلب الإحصائيات');
        return;
      }

      console.log('Fetched backtest stats:', results);
      
      // Ensure we're using the correct display names for analysis types
      const formattedStats = results?.map((stat: any) => ({
        ...stat,
        type: stat.type // Keep original type key for mapping
      })) || [];
      
      setStats(formattedStats);
    } catch (error) {
      console.error('Error in fetchStats:', error);
      toast.error('حدث خطأ أثناء جلب الإحصائيات');
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await fetchStats();
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, isLoading, refresh };
};
