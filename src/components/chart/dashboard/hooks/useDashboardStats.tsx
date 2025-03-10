
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
        console.log("Unique analysis types in stats:", 
          [...new Set(data?.map((stat: any) => stat.type) || [])]);
        
        // جمع النتائج في قاموس لسهولة البحث
        const statsMap: Record<string, any> = {};
        
        // إعداد قاموس بجميع أنواع التحليل المتاحة (بقيم صفرية)
        mainAnalysisTypes.forEach(type => {
          const displayName = getStrategyName(type);
          statsMap[type] = {
            type,
            success: 0,
            fail: 0,
            display_name: displayName
          };
        });
        
        // معالجة النتائج من قاعدة البيانات
        (data || []).forEach((stat: any) => {
          if (!stat.type) {
            console.warn('Found stat without type:', stat);
            stat.type = 'normal';
          }
          
          const displayName = getStrategyName(stat.type);
          console.log(`Processing dashboard stat: ${stat.type} -> ${displayName}`);
          
          // البحث عن أقرب مطابقة في قائمة أنواع التحليل الرئيسية
          let matchedType = stat.type;
          for (const mainType of mainAnalysisTypes) {
            if (
              mainType.toLowerCase() === stat.type.toLowerCase() ||
              getStrategyName(mainType) === displayName
            ) {
              matchedType = mainType;
              break;
            }
          }
          
          // تحديث الإحصائيات
          if (statsMap[matchedType]) {
            statsMap[matchedType].success += stat.success || 0;
            statsMap[matchedType].fail += stat.fail || 0;
          } else {
            // إذا لم يتم العثور على مطابقة، نضيف النوع كما هو
            statsMap[stat.type] = {
              type: stat.type,
              success: stat.success || 0,
              fail: stat.fail || 0,
              display_name: displayName
            };
          }
        });
        
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
