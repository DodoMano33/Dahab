
import { useState, useEffect, useCallback } from "react";
import { SearchHistoryItem } from "@/types/analysis";
// import { useAuth } from "@/contexts/AuthContext";
import { useFetchHistory } from "./useFetchHistory";
import { useHistoryEvents } from "./useHistoryEvents";
import { useHistoryActions } from "./useHistoryActions";
import { clearSupabaseCache, clearSearchHistoryCache } from "@/utils/supabaseCache";
import { toast } from "sonner";

export function useHistoryData() {
  const user = null; // التطبيق يعمل بدون مصادقة
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const { fetchSearchHistory, isRefreshing, setIsRefreshing } = useFetchHistory();
  const { handleDeleteHistoryItem, addToSearchHistory: addItem } = useHistoryActions();
  
  // تعريف الدالة كـ useCallback لتسليمها إلى useHistoryEvents
  const fetchData = useCallback(async () => {
    if (!user) {
      setSearchHistory([]);
      return;
    }
    
    try {
      setIsRefreshing(true);
      
      // محاولة مسح التخزين المؤقت لمخطط البيانات قبل جلب البيانات
      await clearSupabaseCache();
      await clearSearchHistoryCache();
      
      const data = await fetchSearchHistory();
      setSearchHistory(data);
    } catch (error) {
      console.error("Error fetching search history:", error);
      toast.error("تعذر جلب سجل البحث، سيتم إعادة المحاولة لاحقًا", { duration: 1000 });
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchSearchHistory, user, setIsRefreshing]);

  // إعداد المستمعين للأحداث
  useHistoryEvents(fetchData);

  // فحص البيانات عند تحميل المكون أو تغير المستخدم
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setSearchHistory([]);
    }
  }, [user, fetchData]);

  // غلاف لدالة الحذف لتحديث الحالة المحلية
  const handleDelete = async (id: string): Promise<boolean> => {
    const success = await handleDeleteHistoryItem(id);
    if (success) {
      setSearchHistory(prev => prev.filter(item => item.id !== id));
    }
    return success;
  };

  // غلاف لدالة الإضافة
  const addToSearchHistory = (item: SearchHistoryItem) => {
    addItem(item, setSearchHistory);
  };

  return {
    searchHistory,
    setSearchHistory,
    isRefreshing,
    setIsRefreshing,
    fetchSearchHistory: fetchData,
    handleDeleteHistoryItem: handleDelete,
    addToSearchHistory
  };
}

// تصدير افتراضي لدعم كلا النمطين من الاستيراد
export default useHistoryData;
