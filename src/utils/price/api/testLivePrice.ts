
import { fetchPreciousMetalPrice } from './preciousMetals';
import { toast } from 'sonner';

/**
 * اختبار جلب السعر المباشر من Metal Price API
 * هذه الوظيفة تقوم باختبار جلب السعر المباشر للذهب وتعرض النتيجة
 */
export const testLivePrice = async (): Promise<boolean> => {
  try {
    console.log('بدء اختبار جلب السعر المباشر من Metal Price API...');
    
    // محاولة جلب سعر الذهب
    const price = await fetchPreciousMetalPrice('XAUUSD');
    
    if (price !== null) {
      console.log(`تم جلب السعر المباشر بنجاح: ${price}`);
      toast.success(`تم جلب السعر المباشر بنجاح: ${price}`);
      
      // إرسال حدث تحديث السعر لكل التطبيق
      window.dispatchEvent(new CustomEvent('metal-price-update', {
        detail: { price, symbol: 'XAUUSD' }
      }));
      
      return true;
    } else {
      console.error('فشل في جلب السعر المباشر: القيمة المرجعة هي null');
      toast.error('فشل في جلب السعر المباشر');
      return false;
    }
  } catch (error) {
    console.error('خطأ أثناء اختبار جلب السعر المباشر:', error);
    toast.error(`خطأ أثناء اختبار جلب السعر المباشر: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    return false;
  }
};
