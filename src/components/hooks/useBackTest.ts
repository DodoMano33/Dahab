
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useBackTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

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

      // معالجة كل تحليل
      for (const analysis of analyses) {
        try {
          // تحديث وقت آخر فحص للتحليل
          const { error: updateError } = await supabase
            .from('search_history')
            .update({ last_checked_at: new Date().toISOString() })
            .eq('id', analysis.id);
            
          if (updateError) {
            console.error(`Error updating last_checked_at for analysis ${analysis.id}:`, updateError);
            continue; // استمر في المعالجة بالرغم من حدوث خطأ في التحديث
          }

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

      // تحديث وقت آخر فحص عام
      setLastCheckTime(new Date());
      toast.success('تم فحص جميع التحليلات بنجاح');
      
    } catch (error) {
      console.error('Error in manual check:', error);
      toast.error('حدث خطأ أثناء فحص التحليلات');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    triggerManualCheck,
    isLoading,
    lastCheckTime
  };
};
