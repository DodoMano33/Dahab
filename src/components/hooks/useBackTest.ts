import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { priceUpdater } from '@/utils/price/priceUpdater';
import { toast } from 'sonner';

export const useBackTest = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckRef = useRef<{ [key: string]: number }>({});

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

      if (!analysis) {
        console.log(`Analysis ${id} not found, skipping update`);
        return;
      }

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

      // Group analyses by symbol to minimize API calls
      const analysesBySymbol: { [key: string]: typeof activeAnalyses } = {};
      activeAnalyses.forEach(analysis => {
        if (!analysesBySymbol[analysis.symbol]) {
          analysesBySymbol[analysis.symbol] = [];
        }
        analysesBySymbol[analysis.symbol].push(analysis);
      });

      for (const [symbol, analyses] of Object.entries(analysesBySymbol)) {
        try {
          // Check if we should skip this symbol due to recent check
          const now = Date.now();
          const lastCheck = lastCheckRef.current[symbol] || 0;
          const timeSinceLastCheck = now - lastCheck;
          
          // Skip if checked in the last 5 minutes
          if (timeSinceLastCheck < 300000) { // 5 minutes in milliseconds
            console.log(`Skipping ${symbol} - checked ${Math.floor(timeSinceLastCheck/1000)}s ago`);
            continue;
          }

          console.log(`Fetching price for ${symbol}...`);
          const currentPrice = await priceUpdater.fetchPrice(symbol);
          
          if (currentPrice === null || currentPrice === undefined || isNaN(currentPrice)) {
            console.log(`Invalid price received for symbol ${symbol}`);
            if (priceUpdater.isRateLimited()) {
              toast.error('تم تجاوز حد طلبات API - سيتم المحاولة لاحقاً');
              return; // Exit early if rate limited
            }
            continue;
          }

          // Update last check time
          lastCheckRef.current[symbol] = now;

          // Update all analyses for this symbol
          for (const analysis of analyses) {
            await updateAnalysisStatus(analysis.id, currentPrice);
          }
          
        } catch (error) {
          console.error(`Error processing symbol ${symbol}:`, error);
          if (error instanceof Error && error.message.includes('rate limit')) {
            toast.error('تم تجاوز حد طلبات API - سيتم المحاولة لاحقاً');
            return; // Exit early if rate limited
          }
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
        // Check every 5 minutes instead of every minute
        intervalRef.current = setInterval(checkAnalyses, 300000);
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