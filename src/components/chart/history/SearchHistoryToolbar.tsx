import { Button } from "@/components/ui/button";
import { DateRangePicker } from "./DateRangePicker";
import { HistoryActions } from "./HistoryActions";
import { toast } from "sonner";

interface SearchHistoryToolbarProps {
  selectedItems: Set<string>;
  onDelete: () => void;
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
  return (
    <div className="px-6 py-3 flex justify-between items-center gap-2 border-t bg-muted/50">
      <div className="flex items-center gap-2">
        <HistoryActions
          selectedItems={selectedItems}
          onDelete={onDelete}
          history={validHistory}
        />
      </div>
      <DateRangePicker
        dateRange={dateRange}
        isOpen={isDatePickerOpen}
        onOpenChange={setIsDatePickerOpen}
        onSelect={setDateRange}
      />
    </div>
  );
};