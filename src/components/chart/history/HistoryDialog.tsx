import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SearchHistoryContent } from "./SearchHistoryContent";
import { SearchHistoryItem } from "@/types/analysis";
import { SearchHistoryHeader } from "./SearchHistoryHeader";

interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryItem[];
  onDelete: (id: string) => void;
}

export const HistoryDialog = ({ isOpen, onClose, history, onDelete }: HistoryDialogProps) => {
  const validHistory = history.filter(item => 
    item && 
    item.symbol && 
    typeof item.symbol === 'string' && 
    item.currentPrice && 
    item.analysis
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[1200px] p-6 h-[90vh] flex flex-col" dir="rtl">
        <SearchHistoryHeader totalCount={validHistory.length} />
        <div className="flex-1 overflow-hidden mt-4">
          <SearchHistoryContent history={validHistory} onDelete={onDelete} />
        </div>
      </DialogContent>
    </Dialog>
  );
};