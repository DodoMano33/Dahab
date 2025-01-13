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
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching analysis:', fetchError);
        return;
      }

      // If analysis doesn't exist anymore, skip processing
      if (!analysis) {
        console.log(`Analysis ${id} not found, skipping update`);
        return;
      }

      // If analysis has already hit target or stop loss, skip processing
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
        toast.error('حدث خطأ أثناء تحديث حالة التحليل');
        return;
      }

      console.log(`Successfully updated analysis status for ID ${id}`);
    } catch (error) {
      console.error('Error in updateAnalysisStatus:', error);
      toast.error('حدث خطأ أثناء تحديث حالة التحليل');
    }
  };

  const checkAnalyses = async () => {
    try {
      console.log('Starting analysis check...');
      
      const { data: activeAnalyses, error } = await supabase
        .from('search_history')
        .select('*')
        .is('target_hit', false)
        .is('stop_loss_hit', false);

      if (error) {
        console.error('Error fetching active analyses:', error);
        return;
      }

      if (!activeAnalyses || activeAnalyses.length === 0) {
        console.log('No active analyses to check');
        return;
      }

      console.log(`Found ${activeAnalyses.length} active analyses to check`);

      for (const analysis of activeAnalyses) {
        try {
          if (!analysis.symbol) {
            console.error(`Invalid analysis data - missing symbol:`, analysis);
            continue;
          }

          console.log(`Checking analysis for ${analysis.symbol}:`, {
            currentTargets: analysis.analysis?.targets,
            stopLoss: analysis.analysis?.stopLoss,
            lastCheckedPrice: analysis.last_checked_price
          });

          let currentPrice;
          try {
            currentPrice = await priceUpdater.fetchPrice(analysis.symbol);
          } catch (priceError) {
            console.error(`Error fetching price for ${analysis.symbol}:`, priceError);
            continue;
          }
          
          if (currentPrice === null || currentPrice === undefined || isNaN(currentPrice)) {
            console.log(`Invalid price received for symbol ${analysis.symbol}`);
            continue;
          }

          console.log(`Current price for ${analysis.symbol}: ${currentPrice}`);
          await updateAnalysisStatus(analysis.id, currentPrice);
          
        } catch (error) {
          console.error(`Error processing analysis ${analysis.id}:`, error);
          continue;
        }
      }
    } catch (error) {
      console.error('Error in checkAnalyses:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const startBackTest = async () => {
      if (!isMounted) return;
      
      console.log('Starting back test interval...');
      await checkAnalyses(); // Initial check
      
      if (isMounted) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(checkAnalyses, 60000); // Check every minute
      }
    };

    startBackTest();

    return () => {
      isMounted = false;
      if (intervalRef.current) {
        console.log('Cleaning up back test interval...');
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return null;
};