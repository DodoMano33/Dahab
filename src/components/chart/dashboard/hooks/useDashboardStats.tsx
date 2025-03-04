
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useDashboardStats(userId: string | undefined) {
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.rpc('get_backtest_stats');
        
        if (error) {
          console.error('Error fetching stats:', error);
          toast.error('حدث خطأ أثناء جلب البيانات الإحصائية');
          return;
        }
        
        setStats(data || []);
      } catch (error) {
        console.error('Error in fetchStats:', error);
        toast.error('حدث خطأ أثناء جلب البيانات الإحصائية');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [userId]);

  const dashboardStats = useMemo(() => {
    if (!stats.length) return { totalSuccess: 0, totalFail: 0, overallRate: 0, bestType: '' };
    
    const totalSuccess = stats.reduce((acc, stat) => acc + stat.success, 0);
    const totalFail = stats.reduce((acc, stat) => acc + stat.fail, 0);
    const total = totalSuccess + totalFail;
    
    const overallRate = total > 0 ? Math.round((totalSuccess / total) * 100) : 0;
    
    const bestType = stats.length > 0 ? stats.reduce((prev, current) => {
      const prevTotal = prev.success + prev.fail;
      const currentTotal = current.success + current.fail;
      
      // Only consider stats with at least some data
      if (currentTotal === 0) return prev;
      if (prevTotal === 0) return current;
      
      const prevRate = prev.success / prevTotal || 0;
      const currentRate = current.success / currentTotal || 0;
      
      return currentRate > prevRate ? current : prev;
    }).type : '';
    
    return { totalSuccess, totalFail, overallRate, bestType };
  }, [stats]);

  return { stats, isLoading, dashboardStats, setStats, setIsLoading };
}
