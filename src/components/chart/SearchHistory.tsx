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
      <DialogContent className="max-w-4xl h-[75vh] flex flex-col overflow-hidden p-0" dir="rtl">
        {/* العنوان وأزرار المشاركة */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex justify-between items-center">
          <DialogHeader>
            <DialogTitle>
              <span>سجل البحث</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
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

        {/* منطقة المحتوى القابلة للتمرير */}
        <div className="flex-1 overflow-y-auto p-6">
          <HistoryContent
            history={validHistory}
            selectedItems={selectedItems}
            onSelect={handleSelect}
            onDelete={onDelete}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};