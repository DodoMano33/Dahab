
import { SearchHistoryItem } from "@/types/analysis";

export interface UseSearchHistoryReturn {
  searchHistory: SearchHistoryItem[];
  isHistoryOpen: boolean;
  isRefreshing: boolean;
  setIsHistoryOpen: (isOpen: boolean) => void;
  handleDeleteHistoryItem: (id: string) => Promise<void>;
  addToSearchHistory: (item: SearchHistoryItem) => void;
  refreshSearchHistory: () => Promise<void>;
}
