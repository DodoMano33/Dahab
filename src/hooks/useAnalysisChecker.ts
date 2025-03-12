
import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface UseAnalysisCheckerProps {
  symbol: string;
  currentPriceRef: React.MutableRefObject<number | null>;
}

export const useAnalysisChecker = ({ symbol, currentPriceRef }: UseAnalysisCheckerProps) => {
  const checkActiveAnalysesWithCurrentPrice = async (price: number | null) => {
    try {
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
      const apiKey = supabase.supabaseKey;
      
      const { data, error } = await fetch(`${supabaseUrl}/functions/auto-check-analyses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey,
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
        console.error('Error checking analyses:', error);
        window.dispatchEvent(new CustomEvent('analyses-check-failed', { 
          detail: { error: String(error) }
        }));
        return;
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
    } catch (error) {
      console.error('Failed to check active analyses:', error);
      
      window.dispatchEvent(new CustomEvent('analyses-check-failed', { 
        detail: { error: error instanceof Error ? error.message : String(error) }
      }));
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
};
