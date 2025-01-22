import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AnalysisStats {
  type: string;
  success: number;
  fail: number;
}

export const useBacktestStats = () => {
  const [stats, setStats] = useState<AnalysisStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        setStats(results || []);
      } catch (error) {
        console.error('Error in fetchStats:', error);
        toast.error('حدث خطأ أثناء جلب الإحصائيات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
};