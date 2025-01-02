import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SearchHistoryContent } from "./SearchHistoryContent";
import { SearchHistoryItem } from "@/types/analysis";

interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryItem[];
  onDelete: (id: string) => void;
}

export const HistoryDialog = ({ isOpen, onClose, history, onDelete }: HistoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[1200px] p-6" dir="rtl">
        <DialogHeader>
          <DialogTitle>سجل البحث</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <SearchHistoryContent history={history} onDelete={onDelete} />
        </div>
      </DialogContent>
    </Dialog>
  );
};