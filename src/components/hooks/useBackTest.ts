
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface FetchDiagnostics {
  startTime: Date;
  endTime: Date | null;
  status: 'pending' | 'success' | 'error';
  responseStatus?: number;
  responseTime?: number;
  error?: string;
  retryCount: number;
}

export const useBackTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [diagnostics, setDiagnostics] = useState<FetchDiagnostics[]>([]);
  const maxRetries = 3;
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchLastCheckTime = async () => {
      try {
        console.log("Fetching last check time...");
        const { data, error } = await supabase
          .from('search_history')
          .select('last_checked_at')
          .order('last_checked_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching last_checked_at:", error);
          return;
        }

        if (data && data.length > 0 && data[0].last_checked_at) {
          console.log("Initial last_checked_at:", data[0].last_checked_at);
          setLastCheckTime(new Date(data[0].last_checked_at));
        } else {
          console.log("No last_checked_at found in database");
        }
      } catch (err) {
        console.error("Exception in fetchLastCheckTime:", err);
      }
    };

    fetchLastCheckTime();
    
    const handleHistoryUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.timestamp) {
        console.log("useBackTest detected history update with timestamp:", customEvent.detail.timestamp);
        setLastCheckTime(new Date(customEvent.detail.timestamp));
      }
    };
    
    const handleAnalysesChecked = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.timestamp) {
        console.log("useBackTest detected analyses checked with timestamp:", customEvent.detail.timestamp);
        setLastCheckTime(new Date(customEvent.detail.timestamp));
      }
    };
    
    window.addEventListener('historyUpdated', handleHistoryUpdate);
    window.addEventListener('analyses-checked', handleAnalysesChecked);
    
    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
      window.removeEventListener('analyses-checked', handleAnalysesChecked);
    };
  }, []);

  const doFetchRequest = async (retry = 0): Promise<any> => {
    // إلغاء أي طلب سابق معلق
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // إنشاء controller جديد للطلب الحالي
    abortControllerRef.current = new AbortController();
    
    const diagnosticEntry: FetchDiagnostics = {
      startTime: new Date(),
      endTime: null,
      status: 'pending',
      retryCount: retry
    };
    
    setDiagnostics(prev => [...prev.slice(Math.max(0, prev.length - 9)), diagnosticEntry]);
    
    try {
      console.log(`Executing fetch request (retry ${retry}/${maxRetries})`);
      
      const { data: authSession } = await supabase.auth.getSession();
      const supabaseUrl = 'https://nhvkviofvefwbvditgxo.supabase.co';
      
      const startTime = performance.now();
      
      const response = await fetch(`${supabaseUrl}/functions/auto-check-analyses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odmt2aW9mdmVmd2J2ZGl0Z3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzQ4MTcsImV4cCI6MjA1MTIxMDgxN30.TFOufP4Cg5A0Hev_2GNUbRFSW4GRxWzC1RKBYwFxB3U',
          'Authorization': authSession?.session?.access_token 
            ? `Bearer ${authSession.session.access_token}` 
            : ''
        },
        body: JSON.stringify({
          requestedAt: new Date().toISOString(),
          fallbackPrice: null
        }),
        signal: abortControllerRef.current.signal
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.log(`Response received in ${responseTime.toFixed(2)}ms with status ${response.status}`);
      
      if (!response.ok) {
        const responseText = await response.text();
        const errorMessage = `Error status: ${response.status} ${response.statusText}, Response: ${responseText}`;
        console.error(errorMessage);
        
        // تحديث التشخيص
        setDiagnostics(prev => prev.map(d => 
          d.startTime === diagnosticEntry.startTime 
            ? { ...d, endTime: new Date(), status: 'error', responseStatus: response.status, responseTime, error: errorMessage }
            : d
        ));
        
        throw new Error(errorMessage);
      }
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        
        // تحديث التشخيص
        setDiagnostics(prev => prev.map(d => 
          d.startTime === diagnosticEntry.startTime 
            ? { ...d, endTime: new Date(), status: 'success', responseStatus: response.status, responseTime }
            : d
        ));
        
        return responseData;
      } catch (jsonError) {
        const errorMessage = `JSON parse error: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}, Raw response: ${responseText}`;
        console.error(errorMessage);
        
        // تحديث التشخيص
        setDiagnostics(prev => prev.map(d => 
          d.startTime === diagnosticEntry.startTime 
            ? { ...d, endTime: new Date(), status: 'error', responseStatus: response.status, responseTime, error: errorMessage }
            : d
        ));
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      // تحديث التشخيص للخطأ
      setDiagnostics(prev => prev.map(d => 
        d.startTime === diagnosticEntry.startTime 
          ? { ...d, endTime: new Date(), status: 'error', error: error instanceof Error ? error.message : String(error) }
          : d
      ));
      
      console.error('Network error in fetch request:', error);
      
      // فحص ما إذا كان الخطأ بسبب إلغاء الطلب
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Request was aborted');
        throw error;
      }
      
      if (retry < maxRetries) {
        // Exponential backoff for retries
        const delay = Math.pow(2, retry) * 1000;
        console.log(`Retrying fetch in ${delay}ms (attempt ${retry + 1}/${maxRetries})`);
        
        return new Promise(resolve => {
          setTimeout(async () => {
            try {
              const result = await doFetchRequest(retry + 1);
              resolve(result);
            } catch (retryError) {
              // إذا فشلت جميع المحاولات
              if (retry + 1 >= maxRetries) {
                throw retryError;
              }
            }
          }, delay);
        });
      }
      
      throw error;
    }
  };

  const triggerManualCheck = async () => {
    if (isLoading) {
      toast.info("جاري بالفعل فحص التحليلات، يرجى الانتظار");
      return;
    }
    
    try {
      console.log("Triggering manual check...");
      setIsLoading(true);
      setRetryCount(0);
      
      // طلب سعر محدث
      window.dispatchEvent(new Event('request-current-price'));
      
      // إطلاق حدث الفحص اليدوي
      window.dispatchEvent(new Event('manual-check-analyses'));
      
      try {
        const data = await doFetchRequest();
        
        console.log('Manual check completed:', data);
        
        if (data && (data.timestamp || data.currentTime)) {
          setLastCheckTime(new Date(data.timestamp || data.currentTime));
          
          const event = new CustomEvent('historyUpdated', {
            detail: { timestamp: data.timestamp || data.currentTime }
          });
          window.dispatchEvent(event);
          
          const checkedCount = data.checked || 0;
          if (checkedCount > 0) {
            toast.success(`تم فحص ${checkedCount} تحليل بنجاح`);
          } else {
            toast.info('لا توجد تحليلات نشطة للفحص');
          }
        } else {
          toast.info('تم الفحص ولكن لا توجد تحليلات نشطة');
        }
      } catch (error) {
        console.error('Error in manual check:', error);
        const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
        
        // تجنب عرض رسالة خطأ AbortError
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          toast.error(`حدث خطأ أثناء فحص التحليلات: ${errorMessage}`);
          
          // محاولة استخدام الحدث المحلي كخطة بديلة
          window.dispatchEvent(new CustomEvent('analyses-check-failed', { 
            detail: { error: errorMessage }
          }));
        } else {
          console.log('Manual check was aborted');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // وظيفة لإلغاء الطلب الحالي إذا كان هناك طلب جاري
  const cancelCurrentRequest = useCallback(() => {
    if (abortControllerRef.current) {
      console.log('Aborting current request');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  return {
    triggerManualCheck,
    cancelCurrentRequest,
    isLoading,
    lastCheckTime,
    retryCount,
    diagnostics
  };
};
