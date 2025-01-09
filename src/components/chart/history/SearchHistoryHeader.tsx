import { HistoryActions } from "./HistoryActions";

interface SearchHistoryHeaderProps {
  selectedItems?: Set<string>;
  onDelete?: (id: string) => void;
  validHistory?: any[];
}

export const SearchHistoryHeader = ({
  selectedItems,
  onDelete,
  validHistory
}: SearchHistoryHeaderProps) => {
  return (
    <div className="px-6 py-4 flex justify-between items-center border-b">
      <h2 className="text-lg font-semibold">سجل البحث</h2>
      {selectedItems && onDelete && validHistory && (
        <HistoryActions
          selectedItems={selectedItems}
          onDelete={onDelete}
          history={validHistory}
        />
      )}
    </div>
  );
};