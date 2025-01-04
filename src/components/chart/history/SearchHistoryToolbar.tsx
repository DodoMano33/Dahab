import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DateRangePicker } from "./DateRangePicker";
import { HistoryActions } from "./HistoryActions";
import { toast } from "sonner";

interface SearchHistoryToolbarProps {
  selectedItems: Set<string>;
  onDelete: (id: string) => void;
  validHistory: any[];
  dateRange: { from: Date | undefined; to: Date | undefined };
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (open: boolean) => void;
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

export const SearchHistoryToolbar = ({
  selectedItems,
  onDelete,
  validHistory,
  dateRange,
  isDatePickerOpen,
  setIsDatePickerOpen,
  setDateRange,
}: SearchHistoryToolbarProps) => {
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
  );
};