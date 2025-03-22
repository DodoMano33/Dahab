
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchHistoryHeader } from "./SearchHistoryHeader";
import { SearchHistoryToolbar } from "./SearchHistoryToolbar";
import { SearchHistoryMain } from "./SearchHistoryMain";
import { SearchHistoryItem } from "@/types/analysis";

interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryItem[];
  onDelete: (id: string) => Promise<void>;
  isRefreshing: boolean;
  refreshHistory: () => Promise<void>;
}

export const HistoryDialog = ({
  isOpen,
  onClose,
  history,
  onDelete,
  isRefreshing,
  refreshHistory
}: HistoryDialogProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showChart, setShowChart] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = history.map(item => item.id);
      setSelectedItems(new Set(allIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleBulkDelete = async () => {
    for (const id of selectedItems) {
      await onDelete(id);
    }
    // Clear selection after deletion
    setSelectedItems(new Set());
  };

  // Convert handleSelect to return a Promise to match the expected type
  const handleSelectWithPromise = async (id: string) => {
    handleSelect(id);
    return Promise.resolve();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden" dir="rtl">
        <div className="sticky top-0 z-50 bg-background border-b">
          <SearchHistoryHeader initialCount={history.length} />
          <SearchHistoryToolbar
            selectedItems={selectedItems}
            onDelete={handleBulkDelete}
            history={history}
            dateRange={dateRange}
            isDatePickerOpen={isDatePickerOpen}
            setIsDatePickerOpen={setIsDatePickerOpen}
            setDateRange={setDateRange}
            isRefreshing={isRefreshing}
            refreshHistory={refreshHistory}
            showChart={showChart}
            setShowChart={setShowChart}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <SearchHistoryMain
            history={history}
            selectedItems={selectedItems}
            onSelect={handleSelectWithPromise}
            onDelete={onDelete}
            isRefreshing={isRefreshing}
            refreshHistory={refreshHistory}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
