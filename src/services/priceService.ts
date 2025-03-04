
import { toast } from "sonner";

/**
 * الحصول على السعر الحالي لرمز عملة
 */
export const fetchCurrentPrice = async (symbol: string): Promise<number | null> => {
  if (!symbol) return null;
  
  try {
    // يستخدم نفس الوظيفة الموجودة في Supabase Functions
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-current-price?symbol=${encodeURIComponent(symbol)}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`فشل في الحصول على السعر: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.price) {
      console.log(`تم الحصول على السعر لـ ${symbol}: ${data.price}`);
      return data.price;
    }
    
    return null;
  } catch (error) {
    console.error("خطأ في الحصول على السعر:", error);
    toast.error("تعذر الحصول على سعر العملة");
    return null;
  }
};
