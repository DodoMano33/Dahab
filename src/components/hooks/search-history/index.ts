
import { useState, useEffect, useCallback } from "react";
import { SearchHistoryItem } from "@/types/analysis";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useHistoryData } from "./useHistoryData";

/**
 * هوك لإدارة سجل البحث في واجهة المستخدم
 */
export function useSearchHistory() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const {
    searchHistory,
    isRefreshing,
    setIsRefreshing,
    fetchSearchHistory,
    handleDeleteHistoryItem: deleteHistoryItem,
    addToSearchHistory
  } = useHistoryData();

  // وظيفة لتحديث سجل البحث
  const refreshSearchHistory = useCallback(async () => {
    if (user) {
      setIsRefreshing(true);
      try {
        await fetchSearchHistory();
        // تحديث استعلام React Query
        queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
      } catch (error) {
        console.error("Error refreshing search history:", error);
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [user, fetchSearchHistory, setIsRefreshing, queryClient]);
  
  // وظيفة لحذف عنصر وتحديث واجهة المستخدم
  const handleDeleteHistoryItem = async (id: string): Promise<void> => {
    const success = await deleteHistoryItem(id);
    if (success) {
      // تحديث استعلام React Query بعد الحذف الناجح
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    }
  };

  return {
    searchHistory,
    isHistoryOpen,
    setIsHistoryOpen,
    handleDeleteHistoryItem,
    addToSearchHistory,
    refreshSearchHistory,
    isRefreshing
  };
}

// تصدير جميع الهوكات المتعلقة بسجل البحث
export * from "./useHistoryData";
export * from "./useFetchHistory";
export * from "./useHistoryEvents";
export * from "./useHistoryActions";
