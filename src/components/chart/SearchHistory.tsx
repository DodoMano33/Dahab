import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchHistoryHeader } from "./history/SearchHistoryHeader";
import { SearchHistoryToolbar } from "./history/SearchHistoryToolbar";
import { SearchHistoryMain } from "./history/SearchHistoryMain";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface SearchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (open: boolean) => void;
  validHistory: any[];
}

export const SearchHistory = ({
  isOpen,
  onClose,
  validHistory,
}: SearchHistoryProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === validHistory.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(validHistory.map(item => item.id)));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("تم حذف العنصر بنجاح");
    } catch (error) {
      console.error("Error deleting history item:", error);
      toast.error("حدث خطأ أثناء حذف العنصر");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden" dir="rtl">
        <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
          <SearchHistoryHeader />
          <SearchHistoryToolbar 
            validHistory={validHistory}
            selectedItems={selectedItems}
            onDelete={handleDelete}
          />
        </div>
        <SearchHistoryMain 
          history={validHistory}
          selectedItems={selectedItems}
          onSelect={handleSelect}
          onDelete={handleDelete}
          isAllSelected={selectedItems.size === validHistory.length}
          onSelectAll={handleSelectAll}
        />
      </DialogContent>
    </Dialog>
  );
};