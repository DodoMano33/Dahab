
import { useState, useEffect } from "react";
import { SearchHistoryHeader } from "./SearchHistoryHeader";
import { SearchHistoryContent } from "./SearchHistoryContent";
import { SearchHistoryToolbar } from "./SearchHistoryToolbar";
import { SearchHistoryItem } from "@/types/analysis";

interface SearchHistoryMainProps {
  history: SearchHistoryItem[];
  onDelete: (id: string) => Promise<void>;
  isRefreshing: boolean;
  refreshHistory: () => Promise<void>;
}

export const SearchHistoryMain = ({
  history,
  onDelete,
  isRefreshing,
  refreshHistory
}: SearchHistoryMainProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filteredHistory, setFilteredHistory] = useState<SearchHistoryItem[]>(history);
  const [searchTerm, setSearchTerm] = useState("");
  const [symbolFilter, setSymbolFilter] = useState<string | null>(null);
  const [timeframeFilter, setTimeframeFilter] = useState<string | null>(null);
  const [directionFilter, setDirectionFilter] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(true);

  // تحديث البيانات المصفاة عند تغير أي من المرشحات
  useEffect(() => {
    let result = [...history];
    
    // تطبيق مرشح البحث النصي
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.symbol?.toLowerCase().includes(term) ||
        item.analysisType?.toLowerCase().includes(term)
      );
    }
    
    // تطبيق مرشح الرمز
    if (symbolFilter) {
      result = result.filter(item => item.symbol === symbolFilter);
    }
    
    // تطبيق مرشح الإطار الزمني
    if (timeframeFilter) {
      result = result.filter(item => item.timeframe === timeframeFilter);
    }
    
    // تطبيق مرشح الاتجاه
    if (directionFilter) {
      result = result.filter(item => item.analysis?.direction === directionFilter);
    }
    
    setFilteredHistory(result);
    
    // إعادة تعيين المحدد عند تغير المرشحات
    setSelectedItems(new Set());
  }, [history, searchTerm, symbolFilter, timeframeFilter, directionFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set<string>();
      filteredHistory.forEach(item => {
        if (item.id) newSelected.add(item.id);
      });
      setSelectedItems(newSelected);
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  return (
    <div className="flex flex-col space-y-4">
      <SearchHistoryHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        symbolFilter={symbolFilter}
        setSymbolFilter={setSymbolFilter}
        timeframeFilter={timeframeFilter}
        setTimeframeFilter={setTimeframeFilter}
        directionFilter={directionFilter}
        setDirectionFilter={setDirectionFilter}
        history={history}
      />
      
      <SearchHistoryToolbar
        history={filteredHistory}
        selectedItems={selectedItems}
        onDelete={onDelete}
        isRefreshing={isRefreshing}
        refreshHistory={refreshHistory}
        showChart={showChart}
        setShowChart={setShowChart}
      />
      
      <SearchHistoryContent
        history={filteredHistory}
        selectedItems={selectedItems}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        onDelete={onDelete}
        isRefreshing={isRefreshing}
        refreshHistory={refreshHistory}
      />
    </div>
  );
};
