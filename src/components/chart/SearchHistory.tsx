import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchHistoryHeader } from "./history/SearchHistoryHeader";
import { SearchHistoryToolbar } from "./history/SearchHistoryToolbar";
import { SearchHistoryMain } from "./history/SearchHistoryMain";
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
  selectedItems,
  onDelete,
  validHistory,
  handleSelect,
}: SearchHistoryProps) => {
  console.log("Selected Items in SearchHistory:", selectedItems); // Debug log

  const handleSelectAll = () => {
    const allIds = validHistory.map(item => item.id);
    if (selectedItems.size === validHistory.length) {
      // إذا كانت جميع العناصر محددة، قم بإلغاء تحديد الكل
      allIds.forEach(id => handleSelect(id));
      toast.success("تم إلغاء تحديد جميع العناصر");
    } else {
      // إذا لم تكن جميع العناصر محددة، قم بتحديد الكل
      allIds.forEach(id => {
        if (!selectedItems.has(id)) {
          handleSelect(id);
        }
      });
      toast.success("تم تحديد جميع العناصر");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const selectedIds = Array.from(selectedItems);
      if (selectedIds.length === 0) {
        toast.error("الرجاء تحديد عناصر للحذف");
        return;
      }

      // تأكيد الحذف
      if (window.confirm(`هل أنت متأكد من حذف ${selectedIds.length} عنصر؟`)) {
        for (const id of selectedIds) {
          await onDelete(id);
        }
        toast.success(`تم حذف ${selectedIds.length} عنصر بنجاح`);
      }
    } catch (error) {
      console.error("Error deleting items:", error);
      toast.error("حدث خطأ أثناء حذف العناصر");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden" dir="rtl">
        <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
          <SearchHistoryHeader 
            selectedItems={selectedItems}
            onDelete={handleDeleteSelected}
            validHistory={validHistory}
            onSelectAll={handleSelectAll}
          />
          <SearchHistoryToolbar
            selectedItems={selectedItems}
            onDelete={onDelete}
            validHistory={validHistory}
          />
        </div>
        <SearchHistoryMain
          history={validHistory}
          selectedItems={selectedItems}
          onSelect={handleSelect}
          onDelete={onDelete}
        />
      </DialogContent>
    </Dialog>
  );
};