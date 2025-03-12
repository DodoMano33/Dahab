
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface UseAnalysisCheckerProps {
  symbol: string;
  currentPriceRef: React.MutableRefObject<number | null>;
}

export const useAnalysisChecker = ({ symbol, currentPriceRef }: UseAnalysisCheckerProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastErrorTime, setLastErrorTime] = useState<Date | null>(null);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const requestTimeoutRef = useRef<number | null>(null);

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
      
      // إنشاء AbortController للتمكن من إلغاء الطلب إذا استغرق وقتًا طويلًا
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 ثانية كحد أقصى

      try {
        console.log('Sending fetch request to:', `${supabaseUrl}/functions/auto-check-analyses`);
        console.log('With headers:', {
          'Content-Type': 'application/json',
          'Authorization': authSession?.session?.access_token ? 'Bearer [hidden]' : 'No token'
        });
        console.log('With body:', JSON.stringify(requestBody));
        
        const response = await fetch(`${supabaseUrl}/functions/auto-check-analyses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odmt2aW9mdmVmd2J2ZGl0Z3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzQ4MTcsImV4cCI6MjA1MTIxMDgxN30.TFOufP4Cg5A0Hev_2GNUbRFSW4GRxWzC1RKBYwFxB3U',
            'Authorization': authSession?.session?.access_token 
              ? `Bearer ${authSession.session.access_token}` 
              : ''
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          const responseText = await response.text();
          console.error(`Error status: ${response.status} ${response.statusText}, Body: ${responseText}`);
          throw new Error(`Error status: ${response.status} ${response.statusText}, Server response: ${responseText}`);
        }
        
        const responseText = await response.text();
        console.log('Response text:', responseText);
        
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError, 'Raw response:', responseText);
          throw new Error(`Failed to parse JSON response: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`);
        }
        
        console.log('Analyses check result:', data);
        
        // إعادة تعيين عدادات الأخطاء بعد النجاح
        setConsecutiveErrors(0);
        retryCountRef.current = 0;
        setLastErrorTime(null);
        
        window.dispatchEvent(new CustomEvent('analyses-checked', { 
          detail: { 
            timestamp: data.timestamp || data.currentTime, 
            checkedCount: data.checked || 0, 
            symbol: data.symbol || symbol
          }
        }));
        
        window.dispatchEvent(new CustomEvent('historyUpdated', { 
          detail: { timestamp: data.timestamp || data.currentTime }
        }));
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        // تسجيل خطأ الاتصال مع تفاصيل إضافية
        console.error('Fetch error details:', {
          message: fetchError instanceof Error ? fetchError.message : String(fetchError),
          type: fetchError instanceof Error ? fetchError.name : typeof fetchError,
          stack: fetchError instanceof Error ? fetchError.stack : 'No stack trace',
          isAbortError: fetchError instanceof DOMException && fetchError.name === 'AbortError'
        });
        
        setLastErrorTime(new Date());
        setConsecutiveErrors(prev => prev + 1);
        
        if (retryCountRef.current < maxRetries) {
          // زيادة عدد المحاولات وتأخير المحاولة التالية
          retryCountRef.current++;
          const retryDelay = Math.pow(2, retryCountRef.current) * 1000; // تأخير متزايد
          
          console.log(`Retry ${retryCountRef.current}/${maxRetries} will occur in ${retryDelay}ms`);
          
          requestTimeoutRef.current = window.setTimeout(() => {
            console.log(`Executing retry ${retryCountRef.current} for analyses check`);
            checkActiveAnalysesWithCurrentPrice(price);
          }, retryDelay);
          
          return;
        }
        
        // إرسال حدث فشل فحص التحليلات
        window.dispatchEvent(new CustomEvent('analyses-check-failed', { 
          detail: { 
            error: fetchError instanceof Error ? fetchError.message : String(fetchError),
            consecutiveErrors: consecutiveErrors + 1,
            lastErrorTime: new Date()
          }
        }));
      }
    } catch (error) {
      console.error('Failed to check active analyses:', error);
      
      setLastErrorTime(new Date());
      setConsecutiveErrors(prev => prev + 1);
      
      window.dispatchEvent(new CustomEvent('analyses-check-failed', { 
        detail: { 
          error: error instanceof Error ? error.message : String(error),
          consecutiveErrors: consecutiveErrors + 1,
          lastErrorTime: new Date()
        }
      }));
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const handleManualCheck = () => {
      console.log('Manual check requested, current price:', currentPriceRef.current);
      const price = currentPriceRef.current;
      
      // تنظيف أي محاولات سابقة معلقة
      if (requestTimeoutRef.current !== null) {
        clearTimeout(requestTimeoutRef.current);
        requestTimeoutRef.current = null;
      }
      
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
      
      // تخطي الفحص التلقائي إذا كان آخر خطأ حدث منذ أقل من دقيقة واحدة
      if (lastErrorTime && (new Date().getTime() - lastErrorTime.getTime() < 60000)) {
        console.log('Skipping auto check due to recent error');
        return;
      }
      
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
      
      if (requestTimeoutRef.current !== null) {
        clearTimeout(requestTimeoutRef.current);
      }
    };
  }, [symbol, currentPriceRef, lastErrorTime, consecutiveErrors]);

  return {
    isChecking,
    lastErrorTime,
    consecutiveErrors,
    retryCount: retryCountRef.current
  };
};
