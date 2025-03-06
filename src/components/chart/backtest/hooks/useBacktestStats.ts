
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { getStrategyName, mainAnalysisTypes } from '@/utils/technicalAnalysis/analysisTypeMap';

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
      
      // جمع نتائج الاستعلام في قاموس لسهولة البحث
      const statsMap: Record<string, AnalysisStats> = {};
      
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
      
      // معالجة النتائج من قاعدة البيانات (إذا كانت موجودة)
      if (results && Array.isArray(results)) {
        results.forEach((stat: any) => {
          // التأكد من وجود نوع صالح
          if (!stat.type) {
            console.warn('Found stat without type:', stat);
            stat.type = 'normal';
          }
          
          const displayName = getStrategyName(stat.type);
          console.log(`Processing stat: ${stat.type} -> ${displayName}`);
          
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
      }
      
      // تحويل القاموس إلى مصفوفة
      const processedStats = Object.values(statsMap);
      
      console.log('Processed backtest stats:', processedStats);
      console.log('Unique analysis types:', [...new Set(processedStats.map(s => s.type))]);
      console.log('Total types count:', processedStats.length);
      
      setStats(processedStats);
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
