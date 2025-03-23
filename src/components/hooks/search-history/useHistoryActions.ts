
import { supabase } from "@/lib/supabase";
import { SearchHistoryItem } from "@/types/analysis";
import { toast } from "sonner";

/**
 * هوك لإدارة عمليات سجل البحث (إضافة، حذف، إلخ)
 */
export function useHistoryActions() {
  
  const handleDeleteHistoryItem = async (id: string): Promise<boolean> => {
    try {
      console.log("محاولة حذف عنصر من السجل:", id);
      
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("خطأ في حذف العنصر:", error);
        toast.error("حدث خطأ أثناء حذف العنصر");
        return false;
      }

      toast.success("تم حذف العنصر بنجاح");
      console.log("تم حذف العنصر بنجاح:", id);
      return true;
    } catch (error) {
      console.error("خطأ في handleDeleteHistoryItem:", error);
      toast.error("حدث خطأ أثناء حذف العنصر");
      return false;
    }
  };

  const addToSearchHistory = (item: SearchHistoryItem, setHistory: (history: SearchHistoryItem[]) => void) => {
    console.log("إضافة عنصر جديد إلى سجل البحث:", item);
    setHistory((prev: SearchHistoryItem[]) => [item, ...prev]);
  };

  return {
    handleDeleteHistoryItem,
    addToSearchHistory
  };
}
