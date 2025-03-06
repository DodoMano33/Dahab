
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { getStrategyName } from '@/utils/technicalAnalysis/analysisTypeMap';

interface AnalysisStats {
  type: string;
  success: number;
  fail: number;
  display_name?: string;
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

      console.log('Fetched backtest stats raw data:', results);
      
      // Process stats to ensure analysis_type is properly displayed
      const processedStats = results ? results.map((stat: any) => {
        const displayName = getStrategyName(stat.type);
        console.log(`Processing stat: ${stat.type} -> ${displayName}`);
        return {
          ...stat,
          display_name: displayName
        };
      }) : [];
      
      console.log('Processed backtest stats:', processedStats);
      setStats(processedStats || []);
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
