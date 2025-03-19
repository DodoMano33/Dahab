
// تخزين حالة حد معدل الاستخدام
let isRateLimited = false;
let rateLimitResetTime = 0;
const RATE_LIMIT_RESET_DURATION = 24 * 60 * 60 * 1000; // 24 ساعة

export const isApiRateLimited = (): boolean => {
  if (!isRateLimited) return false;
  
  const now = Date.now();
  if (now - rateLimitResetTime >= RATE_LIMIT_RESET_DURATION) {
    isRateLimited = false;
    return false;
  }
  
  return true;
};

export const setRateLimited = (): void => {
  isRateLimited = true;
  rateLimitResetTime = Date.now();
};

export const checkRateLimitInResponse = (data: any): boolean => {
  if (data.Note && data.Note.includes("API call frequency")) {
    console.error("تم تجاوز حد معدل API:", data.Note);
    setRateLimited();
    return true;
  }
  
  if (data.Information && data.Information.includes("API rate limit")) {
    console.error("تم تجاوز حد معدل API:", data.Information);
    setRateLimited();
    return true;
  }
  
  return false;
};
