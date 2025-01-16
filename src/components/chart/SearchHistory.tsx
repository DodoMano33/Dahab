import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchHistoryHeader } from "./history/SearchHistoryHeader";
import { SearchHistoryToolbar } from "./history/SearchHistoryToolbar";
import { SearchHistoryMain } from "./history/SearchHistoryMain";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (open: boolean) => void;
  selectedItems: Set<string>;
  onDelete: (id: string) => void;
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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden" dir="rtl">
        <SearchHistoryHeader totalCount={validHistory.length} />
        <SearchHistoryToolbar
          selectedItems={selectedItems}
          onDelete={onDelete}
          validHistory={validHistory}
          dateRange={dateRange}
          isDatePickerOpen={isDatePickerOpen}
          setIsDatePickerOpen={setIsDatePickerOpen}
          setDateRange={setDateRange}
        />
        <ScrollArea className="flex-1">
          <div className="min-w-[1200px]">
            <SearchHistoryMain
              history={validHistory}
              selectedItems={selectedItems}
              onSelect={handleSelect}
              onDelete={onDelete}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};