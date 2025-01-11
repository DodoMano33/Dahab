import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { priceUpdater } from '@/utils/price/priceUpdater';
import { toast } from 'sonner';

export const useBackTest = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateAnalysisStatus = async (id: string, currentPrice: number) => {
    try {
      console.log(`Updating analysis status for ID ${id} with current price: ${currentPrice}`);
      
      const { error } = await supabase.rpc('update_analysis_status', {
        p_id: id,
        p_current_price: currentPrice
      });

      if (error) {
        console.error('Error updating analysis status:', error);
        throw error;
      }
      
      console.log(`Successfully updated analysis status for ID ${id}`);
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
          console.log(`Checking analysis for ${analysis.symbol}:`, {
            currentTargets: analysis.analysis.targets,
            stopLoss: analysis.analysis.stopLoss,
            lastCheckedPrice: analysis.last_checked_price
          });

          const currentPrice = await priceUpdater.fetchPrice(analysis.symbol);
          console.log(`Current price for ${analysis.symbol}: ${currentPrice}`);
          
          await updateAnalysisStatus(analysis.id, currentPrice);

          // إظهار إشعار إذا تم تحقيق هدف أو وقف خسارة
          if (!analysis.target_hit && currentPrice >= analysis.analysis.targets[0].price) {
            toast.success(`تم تحقيق الهدف للرمز ${analysis.symbol}`);
          }
          if (!analysis.stop_loss_hit && currentPrice <= analysis.analysis.stopLoss) {
            toast.error(`تم تفعيل وقف الخسارة للرمز ${analysis.symbol}`);
          }
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