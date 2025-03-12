
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface UseAnalysisCheckerProps {
  symbol: string;
  currentPriceRef: React.MutableRefObject<number | null>;
}

export const useAnalysisChecker = ({ symbol, currentPriceRef }: UseAnalysisCheckerProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const checkActiveAnalysesWithCurrentPrice = async (price: number | null) => {
    if (isChecking) {
      console.log('Already checking analyses, skipping this request');
      return;
    }
    
    try {
      setIsChecking(true);
      console.log('Triggering check for active analyses with current price:', price);
      
      const requestBody: Record<string, any> = { 
        symbol,
        requestedAt: new Date().toISOString()
      };
      
      if (price !== null) {
        requestBody.currentPrice = price;
      }

      const supabaseUrl = 'https://nhvkviofvefwbvditgxo.supabase.co';
      const { data: authSession } = await supabase.auth.getSession();
      
      try {
        const { data, error } = await fetch(`${supabaseUrl}/functions/auto-check-analyses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odmt2aW9mdmVmd2J2ZGl0Z3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzQ4MTcsImV4cCI6MjA1MTIxMDgxN30.TFOufP4Cg5A0Hev_2GNUbRFSW4GRxWzC1RKBYwFxB3U',
            'Authorization': authSession?.session?.access_token 
              ? `Bearer ${authSession.session.access_token}` 
              : ''
          },
          body: JSON.stringify(requestBody),
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Error status: ${response.status} ${response.statusText}`);
          }
          return response.json().then(data => ({ data, error: null }));
        }).catch(error => {
          console.error('Fetch error:', error);
          return { data: null, error };
        });
        
        if (error) {
          throw error;
        }
        
        console.log('Analyses check result:', data);
        
        window.dispatchEvent(new CustomEvent('analyses-checked', { 
          detail: { 
            timestamp: data.timestamp, 
            checkedCount: data.checked, 
            symbol: data.symbol 
          }
        }));
        
        window.dispatchEvent(new CustomEvent('historyUpdated', { 
          detail: { timestamp: data.timestamp }
        }));

        // Reset retry count after successful request
        retryCountRef.current = 0;
      } catch (fetchError) {
        console.error('Error checking analyses:', fetchError);
        
        if (retryCountRef.current < maxRetries) {
          // Increment retry count and attempt retry
          retryCountRef.current++;
          const retryDelay = Math.pow(2, retryCountRef.current) * 1000; // Exponential backoff
          
          console.log(`Retry ${retryCountRef.current}/${maxRetries} will occur in ${retryDelay}ms`);
          
          setTimeout(() => {
            console.log(`Executing retry ${retryCountRef.current} for analyses check`);
            checkActiveAnalysesWithCurrentPrice(price);
          }, retryDelay);
          
          return;
        }
        
        window.dispatchEvent(new CustomEvent('analyses-check-failed', { 
          detail: { error: fetchError instanceof Error ? fetchError.message : String(fetchError) }
        }));
      }
    } catch (error) {
      console.error('Failed to check active analyses:', error);
      
      window.dispatchEvent(new CustomEvent('analyses-check-failed', { 
        detail: { error: error instanceof Error ? error.message : String(error) }
      }));
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const handleManualCheck = () => {
      console.log('Manual check requested, current price:', currentPriceRef.current);
      const price = currentPriceRef.current;
      if (price !== null) {
        console.log('Executing manual check with price:', price);
        checkActiveAnalysesWithCurrentPrice(price);
      } else {
        console.warn('Manual check requested but current price is null');
        checkActiveAnalysesWithCurrentPrice(null);
      }
    };
    
    window.addEventListener('manual-check-analyses', handleManualCheck);

    const autoCheckInterval = setInterval(() => {
      const price = currentPriceRef.current;
      if (price !== null) {
        console.log('Auto check triggered with price:', price);
        checkActiveAnalysesWithCurrentPrice(price);
      } else {
        console.warn('Auto check skipped, current price is null');
        checkActiveAnalysesWithCurrentPrice(null);
      }
    }, 10000);

    return () => {
      window.removeEventListener('manual-check-analyses', handleManualCheck);
      clearInterval(autoCheckInterval);
    };
  }, [symbol, currentPriceRef]);

  return {
    isChecking
  };
};
