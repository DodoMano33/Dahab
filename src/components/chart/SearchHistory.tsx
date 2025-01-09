import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchHistoryHeader } from "./history/SearchHistoryHeader";
import { SearchHistoryToolbar } from "./history/SearchHistoryToolbar";
import { SearchHistoryMain } from "./history/SearchHistoryMain";

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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden" dir="rtl">
        <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
          <SearchHistoryHeader />
          <SearchHistoryToolbar validHistory={validHistory} />
        </div>
        <SearchHistoryMain history={validHistory} />
      </DialogContent>
    </Dialog>
  );
};