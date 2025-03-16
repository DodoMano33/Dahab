
import { EntryPointHeader } from "./table/EntryPointHeader";
import { EntryPointRow } from "./table/EntryPointRow";
import { CurrentPriceListener } from "./table/CurrentPriceListener";
import { EmptyState } from "./table/EmptyState";

interface BestEntryPointTableProps {
  results: any[];
  selectedItems: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

export const BestEntryPointTable = ({
  results,
  selectedItems,
  onSelectAll,
  onSelect,
  isLoading = false
}: BestEntryPointTableProps) => {
  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-x-auto">
      <div className="min-w-[1200px]">
        <EntryPointHeader 
          onSelectAll={onSelectAll} 
          allSelected={selectedItems.size === results.length} 
          itemsCount={results.length}
        />
        
        <div className="divide-y">
          {results.length === 0 ? (
            <EmptyState isLoading={isLoading} />
          ) : (
            <CurrentPriceListener>
              {(currentPrice) => (
                <>
                  {results.map((result) => (
                    <EntryPointRow
                      key={result.id}
                      result={result}
                      selected={selectedItems.has(result.id)}
                      onSelect={onSelect}
                      currentPrice={currentPrice}
                    />
                  ))}
                </>
              )}
            </CurrentPriceListener>
          )}
        </div>
      </div>
    </div>
  );
};
