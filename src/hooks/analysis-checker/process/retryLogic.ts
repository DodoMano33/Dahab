
import { toast } from 'sonner';

/**
 * Handle retry logic for failed requests
 */
export const handleRetryLogic = (
  isManualCheck: boolean,
  retryCountRef: React.MutableRefObject<number>,
  maxRetries: number,
  requestTimeoutRef: React.MutableRefObject<number | null>,
  requestInProgressRef: React.MutableRefObject<boolean>,
  callback: () => void
): boolean => {
  // زيادة عدد المحاولات وتأخير المحاولة التالية
  if (!isManualCheck) {
    retryCountRef.current++;
  }
  
  const retryDelay = isManualCheck ? 3000 : 5000; // زيادة التأخير لتقليل الضغط على الشبكة
  
  console.log(`${isManualCheck ? 'إعادة محاولة يدوية' : `محاولة ${retryCountRef.current}/${maxRetries}`} ستحدث خلال ${retryDelay}مللي ثانية`);
  
  requestTimeoutRef.current = window.setTimeout(() => {
    console.log(`تنفيذ ${isManualCheck ? 'إعادة محاولة يدوية' : `محاولة ${retryCountRef.current}`} لفحص التحليلات`);
    requestInProgressRef.current = false; // إعادة تعيين العلم قبل المحاولة التالية
    callback();
  }, retryDelay);
  
  return true;
};

/**
 * Handle fetch errors
 */
export const handleFetchError = (
  fetchError: unknown, 
  isManualCheck: boolean,
  consecutiveErrors: number
): void => {
  console.error('تفاصيل خطأ الاتصال:', {
    message: fetchError instanceof Error ? fetchError.message : String(fetchError),
    type: fetchError instanceof Error ? fetchError.name : typeof fetchError,
    stack: fetchError instanceof Error ? fetchError.stack : 'بدون سجل التتبع',
    isAbortError: fetchError instanceof DOMException && fetchError.name === 'AbortError',
    isAuthError: fetchError instanceof Error && 
      (fetchError.message.includes('auth') || 
       fetchError.message.includes('jwt') || 
       fetchError.message.includes('token') ||
       fetchError.message.includes('session'))
  });
  
  // إظهار رسالة للمستخدم في حالة الفحص اليدوي
  if (isManualCheck) {
    let errorMessage = fetchError instanceof Error ? fetchError.message : 'خطأ غير معروف';
    
    // تبسيط رسائل الخطأ للمستخدم
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Failed to send')) {
      errorMessage = 'تعذر الاتصال بالخادم - تحقق من اتصالك بالإنترنت';
    } else if (errorMessage.includes('Unauthorized') || errorMessage.includes('auth')) {
      errorMessage = 'خطأ في تسجيل الدخول - يرجى إعادة تسجيل الدخول';
    }
    
    toast.error(`فشل فحص التحليلات: ${errorMessage}`, { duration: 3000 });
  }
};
