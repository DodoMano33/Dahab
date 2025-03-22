
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SearchHistoryItem } from "@/types/analysis";
import { SearchHistoryMain } from "./SearchHistoryMain";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryItem[];
  onDelete: (id: string) => Promise<void>;
  refreshHistory: () => Promise<void>;
  isRefreshing: boolean;
}

export const HistoryDialog = ({
  isOpen,
  onClose,
  history,
  onDelete,
  refreshHistory,
  isRefreshing
}: HistoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl min-h-[80vh] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">سجل التحليلات</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full w-full pr-4">
          <SearchHistoryMain
            history={history}
            onDelete={onDelete}
            isRefreshing={isRefreshing}
            refreshHistory={refreshHistory}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
