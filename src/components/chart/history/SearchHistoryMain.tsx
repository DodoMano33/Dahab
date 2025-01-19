import { HistoryContent } from "./HistoryContent";

interface SearchHistoryMainProps {
  history: any[];
  selectedItems: Set<string>;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SearchHistoryMain = ({
  history,
  selectedItems,
  onSelect,
  onDelete,
}: SearchHistoryMainProps) => {
  return (
    <div className="p-4">
      <HistoryContent
        history={history}
        selectedItems={selectedItems}
        onSelect={onSelect}
        onDelete={onDelete}
      />
    </div>
  );
};
