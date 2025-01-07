import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SearchHistory } from "../SearchHistory";
import { useState } from "react";

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
        onDelete={() => {}}
        validHistory={[]}
        handleSelect={handleSelect}
      />
    </div>
  );
};