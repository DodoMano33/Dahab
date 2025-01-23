import { HistoryDialog } from "../HistoryDialog";
import { SearchHistoryItem } from "@/types/analysis";

interface HistoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryItem[];
  onDelete: (id: string) => void;
}

export const HistoryManager = ({
  isOpen,
  onClose,
  history,
  onDelete,
}: HistoryManagerProps) => {
  return (
    <HistoryDialog
      isOpen={isOpen}
      onClose={onClose}
      history={history}
      onDelete={onDelete}
    />
  );
};