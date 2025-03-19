
import { toast } from "sonner";
import { FetchDiagnostics } from "./types";
import { supabase } from "@/lib/supabase";

export const useFetchRequest = (
  setDiagnostics: React.Dispatch<React.SetStateAction<FetchDiagnostics[]>>,
  abortControllerRef: React.MutableRefObject<AbortController | null>
) => {
  const maxRetries = 1; // تقليل عدد المحاولات إلى 1 فقط

  const doFetchRequest = async (retry = 0): Promise<any> => {
    console.log(`Starting fetch request (retry ${retry}/${maxRetries})`);
    
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
      // التحقق من اتصال الإنترنت قبل إرسال الطلب
      if (!navigator.onLine) {
        throw new Error('لا يوجد اتصال بالإنترنت');
      }
      
      console.log(`Executing fetch request (retry ${retry}/${maxRetries})`);
      
      const { data: authSession } = await supabase.auth.getSession();
      
      if (!authSession?.session?.access_token) {
        throw new Error('لم يتم العثور على جلسة المستخدم');
      }
      
      const supabaseUrl = 'https://nhvkviofvefwbvditgxo.supabase.co';
      
      const startTime = performance.now();
      
      const response = await fetch(`${supabaseUrl}/functions/auto-check-analyses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odmt2aW9mdmVmd2J2ZGl0Z3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzQ4MTcsImV4cCI6MjA1MTIxMDgxN30.TFOufP4Cg5A0Hev_2GNUbRFSW4GRxWzC1RKBYwFxB3U',
          'Authorization': `Bearer ${authSession.session.access_token}`
        },
        body: JSON.stringify({
          requestedAt: new Date().toISOString(),
          fallbackPrice: null
        }),
        signal: abortControllerRef.current.signal,
        cache: 'no-store', // منع التخزين المؤقت
        // تقليل وقت الانتظار
        // @ts-ignore - خاصية غير قياسية في بعض المتصفحات
        timeout: 5000
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.log(`Response received in ${responseTime.toFixed(2)}ms with status ${response.status}`);
      
      if (!response.ok) {
        const responseText = await response.text();
        let errorMessage = `خطأ ${response.status}: ${response.statusText}`;
        
        // تحسين رسائل الخطأ بناءً على كود الاستجابة
        if (response.status === 401 || response.status === 403) {
          errorMessage = 'خطأ في صلاحيات المستخدم';
        } else if (response.status === 404) {
          errorMessage = 'الخدمة غير متوفرة حالياً';
        } else if (response.status === 429) {
          errorMessage = 'تم تجاوز الحد الأقصى للطلبات';
        } else if (response.status >= 500) {
          errorMessage = 'خطأ في الخادم، يرجى المحاولة لاحقاً';
        }
        
        console.error('Server error:', errorMessage, responseText);
        
        // تحديث التشخيص
        setDiagnostics(prev => prev.map(d => 
          d.startTime === diagnosticEntry.startTime 
            ? { ...d, endTime: new Date(), status: 'error', responseStatus: response.status, responseTime, error: errorMessage }
            : d
        ));
        
        throw new Error(errorMessage);
      }
      
      const responseText = await response.text();
      
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
        const errorMessage = `خطأ في تحليل البيانات: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`;
        
        console.error('JSON parse error:', errorMessage, 'Raw response:', responseText);
        
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
        throw new Error('تم إلغاء الطلب');
      }
      
      // تحسين رسائل الخطأ للمستخدم
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('تعذر الاتصال بالخادم - تحقق من اتصالك بالإنترنت');
      }
      
      if (retry < maxRetries) {
        // تقليل عدد المحاولات ووقت الانتظار
        const delay = 1000; // تأخير ثابت 1 ثانية
        
        console.log(`Retrying fetch in ${delay}ms (attempt ${retry + 1}/${maxRetries})`);
        
        return new Promise((resolve, reject) => {
          setTimeout(async () => {
            try {
              const result = await doFetchRequest(retry + 1);
              resolve(result);
            } catch (retryError) {
              reject(retryError);
            }
          }, delay);
        });
      }
      
      throw error;
    }
  };

  return { doFetchRequest };
};
