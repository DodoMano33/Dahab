
import { toast } from "sonner";

// مدة إعادة تعيين حد معدل الاستخدام (24 ساعة)
const RATE_LIMIT_RESET_DURATION = 24 * 60 * 60 * 1000;

// حالة حد معدل الاستخدام
let isRateLimited = false;
let rateLimitResetTime = 0;

/**
 * التحقق مما إذا تم تجاوز حد معدل الاستخدام
 */
const checkRateLimit = (): boolean => {
  if (!isRateLimited) return false;
  
  const now = Date.now();
  if (now - rateLimitResetTime < RATE_LIMIT_RESET_DURATION) {
    return true;
  } else {
    isRateLimited = false;
    return false;
  }
};

/**
 * تعيين حالة تجاوز حد معدل الاستخدام
 */
const setRateLimited = (limited: boolean): void => {
  isRateLimited = limited;
  if (limited) {
    rateLimitResetTime = Date.now();
    toast.error("تم تجاوز حد معدل API - يرجى المحاولة لاحقًا", { duration: 1000 });
  }
};

/**
 * التعامل مع استجابة API التي قد تتضمن تجاوز حد معدل الاستخدام
 */
const handleApiResponse = (status: number, responseData: any): boolean => {
  if (status === 429) {
    setRateLimited(true);
    return true;
  }
  
  if (responseData?.error && typeof responseData.error === 'string' && 
      responseData.error.includes("rate limit")) {
    setRateLimited(true);
    return true;
  }
  
  return false;
};

// تصدير الدوال المساعدة
export const rateLimit = {
  isRateLimited: checkRateLimit,
  setRateLimited,
  handleApiResponse
};
