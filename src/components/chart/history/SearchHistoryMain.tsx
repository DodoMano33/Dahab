import { HistoryContent } from "./HistoryContent";

interface SearchHistoryMainProps {
  history: any[];
}

export const SearchHistoryMain = ({
  history,
}: SearchHistoryMainProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6">
        <HistoryContent history={history} />
      </div>
    </div>
  );
};