import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DateRangePicker } from "./history/DateRangePicker";
import { HistoryActions } from "./history/HistoryActions";
import { HistoryContent } from "./history/HistoryContent";

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
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0" dir="rtl">
        <div className="sticky top-0 z-50 bg-background border-b">
          <div className="px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">سجل البحث</DialogTitle>
            </DialogHeader>
          </div>
          <div className="px-6 py-3 flex justify-end items-center gap-2 border-t bg-muted/50">
            <DateRangePicker
              dateRange={dateRange}
              isOpen={isDatePickerOpen}
              onOpenChange={setIsDatePickerOpen}
              onSelect={(range: any) => {
                setDateRange(range);
                if (range.from && range.to) {
                  setIsDatePickerOpen(false);
                }
              }}
            />
            <HistoryActions
              selectedItems={selectedItems}
              onDelete={onDelete}
              history={validHistory}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <HistoryContent
              history={validHistory}
              selectedItems={selectedItems}
              onSelect={handleSelect}
              onDelete={onDelete}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};