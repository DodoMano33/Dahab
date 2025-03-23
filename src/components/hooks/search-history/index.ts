
import { useState } from "react";
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

export default useSearchHistory;
