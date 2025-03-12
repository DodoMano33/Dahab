
import { toast } from "sonner";
import { FetchDiagnostics } from "./types";
import { supabase } from "@/lib/supabase";

export const useFetchRequest = (
  setDiagnostics: React.Dispatch<React.SetStateAction<FetchDiagnostics[]>>,
  abortControllerRef: React.MutableRefObject<AbortController | null>
) => {
  const maxRetries = 3;

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

  return { doFetchRequest };
};
