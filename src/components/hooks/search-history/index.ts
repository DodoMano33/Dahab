
import { useState } from "react";
import { useHistoryData } from "./useHistoryData";
import { useExpiredAnalyses } from "./useExpiredAnalyses";
import { useTargetsCheck } from "./useTargetsCheck";
import { UseSearchHistoryReturn } from "./types";

export const useSearchHistory = (): UseSearchHistoryReturn => {
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

  const {
    isRefreshing: isTargetCheckRefreshing,
    checkTargetsAndStopLoss
  } = useTargetsCheck(fetchSearchHistory);

  // Combine both refresh states
  const combinedIsRefreshing = isRefreshing || isTargetCheckRefreshing;

  const refreshSearchHistory = async () => {
    await fetchSearchHistory();
    await checkTargetsAndStopLoss();
    await checkAndDeleteExpiredAnalyses();
  };

  return {
    searchHistory,
    isHistoryOpen,
    isRefreshing: combinedIsRefreshing,
    setIsHistoryOpen,
    handleDeleteHistoryItem,
    addToSearchHistory,
    refreshSearchHistory
  };
};
