import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HistoryContent } from "./HistoryContent";
import { SearchHistoryHeader } from "./SearchHistoryHeader";
import { SearchHistoryItem } from "@/types/analysis";
import { useState } from "react";
import { HistoryActions } from "./HistoryActions";
import { toast } from "sonner";
import { DateRangePicker } from "./DateRangePicker";

interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryItem[];
  onDelete: (id: string) => void;
}

export const HistoryDialog = ({ isOpen, onClose, history, onDelete }: HistoryDialogProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  console.log("History items received:", history);

  const validHistory = history.filter(item => 
    item && 
    item.symbol && 
    typeof item.symbol === 'string' && 
    item.currentPrice && 
    item.analysis
  );

  console.log("Valid history items:", validHistory);

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
      setSelectedItems(new Set());
      toast.success("تم حذف العناصر المحددة بنجاح");
    } catch (error) {
      console.error("خطأ في حذف العناصر:", error);
      toast.error("حدث خطأ أثناء حذف العناصر");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[1200px] p-6 h-[90vh] flex flex-col" dir="rtl">
        <SearchHistoryHeader totalCount={validHistory.length} />
        <div className="flex justify-between items-center p-2 bg-muted/50">
          <HistoryActions
            selectedItems={selectedItems}
            onDelete={handleDeleteSelected}
            history={validHistory}
          />
          <DateRangePicker
            dateRange={dateRange}
            isOpen={isDatePickerOpen}
            onOpenChange={setIsDatePickerOpen}
            onSelect={setDateRange}
          />
        </div>
        <div className="flex-1 overflow-hidden mt-4">
          <HistoryContent 
            history={validHistory} 
            onDelete={onDelete}
            selectedItems={selectedItems}
            onSelect={handleSelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};