
import { useState, useEffect } from "react";
import { useHistoryData } from "./useHistoryData";
import { useExpiredAnalyses } from "./useExpiredAnalyses";
import { UseSearchHistoryReturn } from "./types";

export const useSearchHistory = (): UseSearchHistoryReturn => {
  console.log("useSearchHistory hook initialized");
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const {
    searchHistory,
    setSearchHistory,
    isRefreshing,
    setIsRefreshing,
    fetchSearchHistory,
    handleDeleteHistoryItem,
    addToSearchHistory
  } = useHistoryData();

  const { checkAndDeleteExpiredAnalyses } = useExpiredAnalyses(searchHistory, setSearchHistory);

  // الاستماع لأحداث تحديث التاريخ
  useEffect(() => {
    const handleHistoryUpdate = () => {
      console.log("History update event received in useSearchHistory");
      fetchSearchHistory();
    };
    
    window.addEventListener('refreshSearchHistory', handleHistoryUpdate);
    
    return () => {
      window.removeEventListener('refreshSearchHistory', handleHistoryUpdate);
    };
  }, [fetchSearchHistory]);

  const refreshSearchHistory = async () => {
    await fetchSearchHistory();
    await checkAndDeleteExpiredAnalyses();
  };

  return {
    searchHistory,
    isHistoryOpen,
    isRefreshing,
    setIsHistoryOpen,
    handleDeleteHistoryItem,
    addToSearchHistory,
    refreshSearchHistory
  };
};

// تصدير افتراضي لدعم كلا النمطين من الاستيراد
export default useSearchHistory;
