
import { RetryOptions } from "./types";

/**
 * وظيفة لإعادة المحاولة مع زيادة تدريجية في وقت الانتظار
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = { maxAttempts: 3, initialDelay: 1000 }
): Promise<T> {
  const { maxAttempts, initialDelay } = options;
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`محاولة إعادة الاتصال ${attempt}/${maxAttempts}`);
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // التحقق مما إذا كان الخطأ متعلقًا بحد معدل الاستخدام
      if (error instanceof Error && error.message.includes('rate limit')) {
        throw error; // لا تعيد المحاولة إذا تم تجاوز حد معدل الاستخدام
      }
      
      if (attempt === maxAttempts) {
        console.error('تم الوصول إلى الحد الأقصى من المحاولات:', { _type: 'Error', value: error });
        throw lastError;
      }
      
      // انتظار فترة متزايدة قبل المحاولة التالية
      const delay = initialDelay * attempt;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
