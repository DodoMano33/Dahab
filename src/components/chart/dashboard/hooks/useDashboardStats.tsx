
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getStrategyName, mainAnalysisTypes } from "@/utils/technicalAnalysis/analysisTypeMap";

export function useDashboardStats(userId: string | undefined) {
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching backtest stats...");
        const { data, error } = await supabase.rpc('get_backtest_stats');
        
        if (error) {
          console.error('Error fetching stats:', error);
          toast.error('حدث خطأ أثناء جلب البيانات الإحصائية');
          return;
        }
        
        console.log("Received backtest stats:", data);
        
        // جمع النتائج في قاموس لسهولة البحث
        const statsMap: Record<string, any> = {};
        
        // إعداد قاموس فقط بأنواع التحليل المعتمدة (بقيم صفرية)
        mainAnalysisTypes.forEach(type => {
          const displayName = getStrategyName(type);
          statsMap[type] = {
            type,
            success: 0,
            fail: 0,
            display_name: displayName
          };
        });
        
        // معالجة النتائج من قاعدة البيانات (إذا كانت موجودة)
        if (data && Array.isArray(data)) {
          data.forEach((stat: any) => {
            // تخطي أي نوع تحليل ليس موجود في القائمة المعتمدة
            if (!stat.type || !mainAnalysisTypes.includes(stat.type)) {
              return;
            }
            
            // تحديث الإحصائيات
            if (statsMap[stat.type]) {
              statsMap[stat.type].success += stat.success || 0;
              statsMap[stat.type].fail += stat.fail || 0;
            }
          });
        }
        
        // تحويل القاموس إلى مصفوفة
        const processedStats = Object.values(statsMap);
        
        console.log("Processed dashboard stats:", processedStats);
        console.log("Total dashboard stats count:", processedStats.length);
        
        setStats(processedStats || []);
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
    
    // Find the best performing analysis type
    const bestType = stats.length > 0 ? stats.reduce((prev, current) => {
      const prevTotal = prev.success + prev.fail;
      const currentTotal = current.success + current.fail;
      
      // Only consider stats with at least some data (minimum 5 analyses)
      if (currentTotal < 5) return prev;
      if (prevTotal < 5) return currentTotal >= 5 ? current : prev;
      
      const prevRate = prev.success / prevTotal || 0;
      const currentRate = current.success / currentTotal || 0;
      
      return currentRate > prevRate ? current : prev;
    }).display_name || '' : '';
    
    return { totalSuccess, totalFail, overallRate, bestType };
  }, [stats]);

  return { stats, isLoading, dashboardStats, setStats, setIsLoading };
}
