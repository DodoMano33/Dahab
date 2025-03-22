
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
      
      // إنشاء قاموس لجميع أنواع التحليل المدعومة (16 نوع) مع قيم أولية صفرية
      const statsMap: Record<string, AnalysisStats> = {};
      
      // إعداد قاموس بالأنواع الـ 16 المطلوبة
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
      if (results && Array.isArray(results)) {
        results.forEach((stat: any) => {
          if (!stat.type) {
            console.warn('Found stat without type:', stat);
            stat.type = 'normal';
          }
          
          // توحيد أنواع التحليل للأنواع الـ 16 المطلوبة
          const normalizedType = stat.type.toLowerCase().replace(/_/g, '').trim();
          let matchedType = 'normal'; // افتراضي
          
          // البحث عن أقرب مطابقة في قائمة أنواع التحليل الرئيسية
          for (const mainType of mainAnalysisTypes) {
            const normalizedMainType = mainType.toLowerCase().replace(/_/g, '').trim();
            if (normalizedType.includes(normalizedMainType) || 
                getStrategyName(mainType).toLowerCase().includes(normalizedType)) {
              matchedType = mainType;
              break;
            }
          }
          
          // التعامل مع حالات خاصة
          if (normalizedType.includes('smc') || normalizedType.includes('هيكلالسوق')) {
            matchedType = 'smc';
          } else if (normalizedType.includes('ict') || normalizedType.includes('نظريةالسوق')) {
            matchedType = 'ict';
          } else if (normalizedType.includes('turtle') || normalizedType.includes('الحساءالسلحفائي')) {
            matchedType = 'turtle_soup';
          } else if (normalizedType.includes('fibon') && normalizedType.includes('adv')) {
            matchedType = 'fibonacci_advanced';
          } else if (normalizedType.includes('fibon')) {
            matchedType = 'fibonacci';
          }
          
          // تحديث الإحصائيات
          if (statsMap[matchedType]) {
            statsMap[matchedType].success += stat.success || 0;
            statsMap[matchedType].fail += stat.fail || 0;
          } else {
            // إذا لم يتم العثور على مطابقة، نضيف للنوع الافتراضي
            statsMap['normal'].success += stat.success || 0;
            statsMap['normal'].fail += stat.fail || 0;
          }
        });
      }
      
      // تحويل القاموس إلى مصفوفة
      const processedStats = Object.values(statsMap);
      
      console.log('Processed backtest stats:', processedStats);
      console.log('Unique analysis types after processing:', [...new Set(processedStats.map(s => s.type))]);
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
