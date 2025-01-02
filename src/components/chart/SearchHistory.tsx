import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SearchHistoryItem } from "@/types/analysis";
import { DateRangePicker } from "./history/DateRangePicker";
import { HistoryContent } from "./history/HistoryContent";
import { HistoryActions } from "./history/HistoryActions";

interface SearchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryItem[];
  onDelete: (id: string) => void;
}

export const SearchHistory = ({ isOpen, onClose, history, onDelete }: SearchHistoryProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const validHistory = history.filter(item => 
    item && 
    item.symbol && 
    typeof item.symbol === 'string' && 
    item.currentPrice && 
    item.analysis
  );

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col" dir="rtl">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex justify-between items-center">
            <span>سجل البحث</span>
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
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto">
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