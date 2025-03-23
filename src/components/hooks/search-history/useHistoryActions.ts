
import { supabase } from "@/lib/supabase";
import { SearchHistoryItem } from "@/types/analysis";
import { toast } from "sonner";
import { resetSupabaseConnection } from "@/utils/supabaseCache";

/**
 * هوك لإدارة عمليات سجل البحث (إضافة، حذف، إلخ)
 */
export function useHistoryActions() {
  
  const handleDeleteHistoryItem = async (id: string): Promise<boolean> => {
    try {
      console.log("محاولة حذف عنصر من السجل:", id);
      
      // محاولة إعادة تهيئة الاتصال قبل تنفيذ العملية
      await resetSupabaseConnection();
      
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);

      if (error) {
        // تحقق من نوع الخطأ للتعامل معه بشكل أفضل
        if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
          console.error("خطأ في الاتصال بالشبكة:", error);
          toast.error("تعذر الاتصال بقاعدة البيانات، يرجى التحقق من اتصالك بالإنترنت", { duration: 1000 });
        } else {
          console.error("خطأ في حذف العنصر:", error);
          toast.error("حدث خطأ أثناء حذف العنصر", { duration: 1000 });
        }
        return false;
      }

      toast.success("تم حذف العنصر بنجاح", { duration: 1000 });
      console.log("تم حذف العنصر بنجاح:", id);
      return true;
    } catch (error) {
      console.error("خطأ في handleDeleteHistoryItem:", error);
      toast.error("حدث خطأ أثناء حذف العنصر", { duration: 1000 });
      return false;
    }
  };

  // تحديث دالة إضافة عنصر إلى سجل البحث
  const addToSearchHistory = (item: SearchHistoryItem, setHistory: React.Dispatch<React.SetStateAction<SearchHistoryItem[]>>) => {
    console.log("إضافة عنصر جديد إلى سجل البحث:", item);
    setHistory(prev => [item, ...prev]);
  };

  return {
    handleDeleteHistoryItem,
    addToSearchHistory
  };
}
