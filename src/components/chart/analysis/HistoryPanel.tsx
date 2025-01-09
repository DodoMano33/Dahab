import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SearchHistory } from "../SearchHistory";
import { useState } from "react";
import { toast } from "sonner";

interface HistoryPanelProps {
  showHistory: boolean;
  onClose: () => void;
}

export const HistoryPanel = ({ showHistory, onClose }: HistoryPanelProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleSelect = (id: string) => {
    console.log("Handling select for id:", id); // Debug log
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      console.log("New selected items:", newSet); // Debug log
      return newSet;
    });
  };

  const handleDelete = async (id: string) => {
    try {
      // هنا يمكنك إضافة المنطق الخاص بحذف العنصر من قاعدة البيانات
      toast.success("تم حذف العنصر بنجاح");
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("حدث خطأ أثناء حذف العنصر");
    }
  };

  if (!showHistory) return null;

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-6 mt-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      <SearchHistory
        isOpen={true}
        onClose={onClose}
        dateRange={dateRange}
        setDateRange={setDateRange}
        isDatePickerOpen={isDatePickerOpen}
        setIsDatePickerOpen={setIsDatePickerOpen}
        selectedItems={selectedItems}
        onDelete={handleDelete}
        validHistory={[]} // هنا يجب إضافة البيانات الفعلية
        handleSelect={handleSelect}
      />
    </div>
  );
};