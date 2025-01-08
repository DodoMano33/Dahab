import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { priceUpdater } from '@/utils/price/priceUpdater';
import { toast } from 'sonner';

export const useBackTest = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateAnalysisStatus = async (id: string, currentPrice: number) => {
    try {
      console.log(`تحديث حالة التحليل للمعرف ${id} بالسعر الحالي: ${currentPrice}`);
      
      const { error } = await supabase.rpc('update_analysis_status', {
        p_id: id,
        p_current_price: currentPrice
      });

      if (error) {
        console.error('خطأ في تحديث حالة التحليل:', error);
        throw error;
      }
      
      console.log(`تم تحديث حالة التحليل بنجاح للمعرف ${id}`);
    } catch (error) {
      console.error('خطأ في updateAnalysisStatus:', error);
      toast.error('حدث خطأ في تحديث حالة التحليل');
    }
  };

  const checkAnalyses = async () => {
    try {
      console.log('بدء فحص التحليلات...');
      
      const { data: activeAnalyses, error } = await supabase
        .from('search_history')
        .select('*')
        .or('target_hit.eq.false,stop_loss_hit.eq.false')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) {
        console.error('خطأ في جلب التحليلات النشطة:', error);
        return;
      }

      console.log(`تم العثور على ${activeAnalyses?.length} تحليل نشط للفحص`);

      for (const analysis of (activeAnalyses || [])) {
        try {
          console.log(`فحص التحليل للرمز ${analysis.symbol}:`, {
            currentTargets: analysis.analysis.targets,
            stopLoss: analysis.analysis.stopLoss,
            lastCheckedPrice: analysis.last_checked_price
          });

          let currentPrice: number;
          try {
            currentPrice = await priceUpdater.fetchPrice(analysis.symbol);
            console.log(`السعر الحالي للرمز ${analysis.symbol}: ${currentPrice}`);
          } catch (priceError) {
            console.error(`خطأ في جلب السعر للرمز ${analysis.symbol}:`, priceError);
            // استخدام آخر سعر معروف إذا كان متوفراً
            if (analysis.last_checked_price) {
              currentPrice = analysis.last_checked_price;
              console.log(`استخدام آخر سعر معروف: ${currentPrice}`);
            } else {
              console.log(`تخطي التحليل لعدم توفر السعر`);
              continue;
            }
          }
          
          await updateAnalysisStatus(analysis.id, currentPrice);

          // إظهار إشعارات للمستخدم
          if (!analysis.target_hit && currentPrice >= analysis.analysis.targets[0].price) {
            toast.success(`تم تحقيق الهدف للرمز ${analysis.symbol}`);
          }
          if (!analysis.stop_loss_hit && currentPrice <= analysis.analysis.stopLoss) {
            toast.error(`تم تفعيل وقف الخسارة للرمز ${analysis.symbol}`);
          }
        } catch (error) {
          console.error(`خطأ في معالجة التحليل ${analysis.id}:`, error);
        }
      }
    } catch (error) {
      console.error('خطأ في checkAnalyses:', error);
    }
  };

  useEffect(() => {
    const startBackTest = async () => {
      console.log('بدء فترة اختبار التحليلات...');
      await checkAnalyses(); // تنفيذ فحص أولي
      intervalRef.current = setInterval(checkAnalyses, 60000); // فحص كل دقيقة
    };

    startBackTest();

    return () => {
      if (intervalRef.current) {
        console.log('تنظيف فترة اختبار التحليلات...');
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return null;
};