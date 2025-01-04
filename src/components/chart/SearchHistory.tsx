import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DateRangePicker } from "./history/DateRangePicker";
import { HistoryActions } from "./history/HistoryActions";
import { HistoryContent } from "./history/HistoryContent";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  const handleDeleteSelected = async () => {
    try {
      const selectedIds = Array.from(selectedItems);
      if (selectedIds.length === 0) {
        toast.error("الرجاء تحديد عناصر للحذف");
        return;
      }

      for (const id of selectedIds) {
        await onDelete(id);
      }
      toast.success("تم حذف العناصر المحددة بنجاح");
    } catch (error) {
      console.error("خطأ في حذف العناصر:", error);
      toast.error("حدث خطأ أثناء حذف العناصر");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden" dir="rtl">
        <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
          <div className="px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">سجل البحث</DialogTitle>
            </DialogHeader>
          </div>
          <div className="px-6 py-3 flex justify-between items-center gap-2 border-t bg-muted/50">
            <HistoryActions
              selectedItems={selectedItems}
              onDelete={onDelete}
              history={validHistory}
            />
            <div className="flex items-center gap-2">
              <Button
                onClick={handleDeleteSelected}
                variant="destructive"
                size="icon"
                className="hover:bg-destructive/90"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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
            </div>
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