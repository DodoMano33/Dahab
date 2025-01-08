import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { priceUpdater } from '@/utils/price/priceUpdater';
import { toast } from 'sonner';

export const useBackTest = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateAnalysisStatus = async (id: string, currentPrice: number) => {
    try {
      const { error } = await supabase.rpc('update_analysis_status', {
        p_id: id,
        p_current_price: currentPrice
      });

      if (error) {
        console.error('Error updating analysis status:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateAnalysisStatus:', error);
    }
  };

  const checkAnalyses = async () => {
    try {
      console.log('Starting analysis check...');
      
      // جلب جميع التحليلات التي لم يتم تحقيق أهدافها أو وقف خسارتها بعد
      const { data: activeAnalyses, error } = await supabase
        .from('search_history')
        .select('*')
        .or('target_hit.eq.false,stop_loss_hit.eq.false');

      if (error) {
        console.error('Error fetching active analyses:', error);
        return;
      }

      console.log(`Found ${activeAnalyses.length} active analyses to check`);

      // تحديث كل تحليل نشط
      for (const analysis of activeAnalyses) {
        try {
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
    // بدء الفحص الدوري كل دقيقة
    const startBackTest = () => {
      console.log('Starting back test interval...');
      checkAnalyses(); // تنفيذ فحص أولي
      intervalRef.current = setInterval(checkAnalyses, 60000); // فحص كل دقيقة
    };

    startBackTest();

    // تنظيف عند إزالة المكون
    return () => {
      if (intervalRef.current) {
        console.log('Cleaning up back test interval...');
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return null;
};