import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { priceUpdater } from '@/utils/price/priceUpdater';
import { toast } from 'sonner';

export const useBackTest = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateAnalysisStatus = async (id: string, currentPrice: number) => {
    try {
      console.log(`Updating analysis status for ID ${id} with current price: ${currentPrice}`);
      
      const { data: analysis, error: fetchError } = await supabase
        .from('search_history')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching analysis:', fetchError);
        return;
      }

      // إذا كان التحليل قد وصل بالفعل إلى الهدف أو وقف الخسارة، نتخطاه
      if (analysis.target_hit || analysis.stop_loss_hit) {
        console.log(`Analysis ${id} already completed, skipping update`);
        return;
      }

      const { error: updateError } = await supabase.rpc('update_analysis_status', {
        p_id: id,
        p_current_price: currentPrice
      });

      if (updateError) {
        console.error('Error updating analysis status:', updateError);
        throw updateError;
      }

      // نتحقق من حالة التحليل بعد التحديث
      const { data: updatedAnalysis, error: checkError } = await supabase
        .from('search_history')
        .select('*')
        .eq('id', id)
        .single();

      if (checkError) {
        console.error('Error checking updated analysis:', checkError);
        return;
      }

      // إذا تم الوصول إلى الهدف أو وقف الخسارة، نعرض إشعار ونحذف التحليل
      if (updatedAnalysis.target_hit || updatedAnalysis.stop_loss_hit) {
        if (updatedAnalysis.target_hit) {
          toast.success(`تم تحقيق الهدف للرمز ${updatedAnalysis.symbol}`);
        } else {
          toast.error(`تم تفعيل وقف الخسارة للرمز ${updatedAnalysis.symbol}`);
        }

        // حذف التحليل من سجل البحث
        const { error: deleteError } = await supabase
          .from('search_history')
          .delete()
          .eq('id', id);

        if (deleteError) {
          console.error('Error deleting completed analysis:', deleteError);
        } else {
          console.log(`Successfully deleted completed analysis ${id}`);
        }
      }
      
      console.log(`Successfully updated analysis status for ID ${id}`);
    } catch (error) {
      console.error('Error in updateAnalysisStatus:', error);
    }
  };

  const checkAnalyses = async () => {
    try {
      console.log('Starting analysis check...');
      
      // جلب فقط التحليلات التي لم تصل بعد إلى الهدف أو وقف الخسارة
      const { data: activeAnalyses, error } = await supabase
        .from('search_history')
        .select('*')
        .is('target_hit', false)
        .is('stop_loss_hit', false);

      if (error) {
        console.error('Error fetching active analyses:', error);
        return;
      }

      console.log(`Found ${activeAnalyses.length} active analyses to check`);

      for (const analysis of activeAnalyses) {
        try {
          console.log(`Checking analysis for ${analysis.symbol}:`, {
            currentTargets: analysis.analysis.targets,
            stopLoss: analysis.analysis.stopLoss,
            lastCheckedPrice: analysis.last_checked_price
          });

          const currentPrice = await priceUpdater.fetchPrice(analysis.symbol);
          console.log(`Current price for ${analysis.symbol}: ${currentPrice}`);
          
          await updateAnalysisStatus(analysis.id, currentPrice);
        } catch (error) {
          console.error(`Error processing analysis ${analysis.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in checkAnalyses:', error);
    }
  };

  useEffect(() => {
    const startBackTest = () => {
      console.log('Starting back test interval...');
      checkAnalyses(); // تنفيذ فحص أولي
      intervalRef.current = setInterval(checkAnalyses, 60000); // فحص كل دقيقة
    };

    startBackTest();

    return () => {
      if (intervalRef.current) {
        console.log('Cleaning up back test interval...');
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return null;
};