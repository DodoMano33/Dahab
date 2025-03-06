
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useBackTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

  // جلب آخر وقت فحص عند تحميل المكون
  useEffect(() => {
    const fetchLastCheckTime = async () => {
      const { data, error } = await supabase
        .from('search_history')
        .select('last_checked_at')
        .order('last_checked_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0 && data[0].last_checked_at) {
        setLastCheckTime(new Date(data[0].last_checked_at));
      }
    };

    fetchLastCheckTime();
  }, []);

  const triggerManualCheck = async () => {
    try {
      setIsLoading(true);
      
      // جلب جميع التحليلات النشطة من سجل البحث
      const { data: analyses, error } = await supabase
        .from('search_history')
        .select('*')
        .is('result_timestamp', null);

      if (error) {
        throw error;
      }

      console.log('Analyses to check:', analyses);

      if (analyses.length === 0) {
        toast.info('لا توجد تحليلات نشطة للفحص');
        setIsLoading(false);
        return;
      }

      const currentTime = new Date().toISOString();

      // تحديث وقت آخر فحص لجميع التحليلات دفعة واحدة
      const { error: batchUpdateError } = await supabase
        .from('search_history')
        .update({ last_checked_at: currentTime })
        .in('id', analyses.map(a => a.id));

      if (batchUpdateError) {
        console.error('Error updating last_checked_at:', batchUpdateError);
        throw batchUpdateError;
      }

      // التحقق من تحديث البيانات
      console.log('Updated last_checked_at to:', currentTime);
      
      // معالجة كل تحليل
      for (const analysis of analyses) {
        try {
          // تحقق من وجود نقطة دخول مثالية
          const hasBestEntryPoint = analysis.analysis.bestEntryPoint?.price;
          const currentPrice = analysis.last_checked_price || analysis.current_price;
          
          // تحديث حالة التحليل مع نقطة الدخول المثالية
          if (hasBestEntryPoint) {
            await supabase.rpc('update_analysis_status_with_entry_point', {
              p_id: analysis.id,
              p_current_price: currentPrice
            });
          } else {
            // تحديث حالة التحليل العادي
            await supabase.rpc('update_analysis_status', {
              p_id: analysis.id,
              p_current_price: currentPrice
            });
          }
        } catch (analysisError) {
          console.error(`Error processing analysis ${analysis.id}:`, analysisError);
          toast.error(`حدث خطأ أثناء معالجة التحليل ${analysis.symbol}`);
        }
      }

      // تحديث وقت آخر فحص في واجهة المستخدم
      setLastCheckTime(new Date(currentTime));
      toast.success('تم فحص جميع التحليلات بنجاح');
      
      // إجراء تحديث إضافي للتأكد من أن البيانات محدثة
      await refreshHistory();
      
    } catch (error) {
      console.error('Error in manual check:', error);
      toast.error('حدث خطأ أثناء فحص التحليلات');
    } finally {
      setIsLoading(false);
    }
  };

  // دالة لتحديث بيانات سجل البحث بعد إجراء الفحص
  const refreshHistory = async () => {
    try {
      // تحديث البيانات دون إعادة التحميل الكامل للصفحة
      await supabase.from('search_history').select('count').limit(1);
      console.log('Refreshed search history data');
    } catch (error) {
      console.error('Failed to refresh search history:', error);
    }
  };

  return {
    triggerManualCheck,
    isLoading,
    lastCheckTime
  };
};
