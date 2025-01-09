import { Button } from "@/components/ui/button";
import { HistoryActions } from "./HistoryActions";
import { Checkbox } from "@/components/ui/checkbox";

interface SearchHistoryHeaderProps {
  selectedItems: Set<string>;
  onDelete: (id: string) => void;
  validHistory: any[];
  onSelectAll: () => void;
}

export const SearchHistoryHeader = ({
  selectedItems,
  onDelete,
  validHistory,
  onSelectAll
}: SearchHistoryHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedItems.size === validHistory.length && validHistory.length > 0}
            onCheckedChange={onSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            تحديد الكل ({selectedItems.size}/{validHistory.length})
          </span>
        </div>
      </div>
      <HistoryActions
        selectedItems={selectedItems}
        onDelete={onDelete}
        history={validHistory}
      />
    </div>
  );
};