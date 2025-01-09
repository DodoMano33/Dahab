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
  console.log("Selected Items in SearchHistoryMain:", selectedItems); // Debug log

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6">
        <HistoryContent
          history={history}
          selectedItems={selectedItems}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};