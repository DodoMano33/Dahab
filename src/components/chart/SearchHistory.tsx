
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchHistoryHeader } from "./history/SearchHistoryHeader";
import { SearchHistoryToolbar } from "./history/SearchHistoryToolbar";
import { SearchHistoryMain } from "./history/SearchHistoryMain";

interface SearchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (open: boolean) => void;
  selectedItems: Set<string>;
  onDelete: (id: string) => Promise<void>;
  validHistory: any[];
  handleSelect: (id: string) => void;
}

export const SearchHistory = ({
  isOpen,
  onClose,
  dateRange,
  setDateRange,
  isDatePickerOpen,
  setIsDatePickerOpen,
  selectedItems,
  onDelete,
  validHistory,
  handleSelect,
}: SearchHistoryProps) => {
  // Convert the synchronous function to return a Promise
  const handleBulkDelete = async () => {
    // Process each item sequentially to ensure proper Promise handling
    for (const id of selectedItems) {
      await onDelete(id);
    }
  };

  // Convert the selection handler to return a Promise as required by the interface
  const handleSelectWithPromise = async (id: string) => {
    handleSelect(id);
    return Promise.resolve();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden" dir="rtl">
        <div className="sticky top-0 z-50 bg-background border-b">
          <SearchHistoryHeader initialCount={validHistory.length} />
          <SearchHistoryToolbar
            selectedItems={selectedItems}
            onDelete={handleBulkDelete}
            history={validHistory}
            dateRange={dateRange}
            isDatePickerOpen={isDatePickerOpen}
            setIsDatePickerOpen={setIsDatePickerOpen}
            setDateRange={setDateRange}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <SearchHistoryMain
            history={validHistory}
            selectedItems={selectedItems}
            onSelect={handleSelectWithPromise}
            onDelete={onDelete}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
