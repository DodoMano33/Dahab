
import {
  Table,
} from "@/components/ui/table";
import { AnalysisRow } from "../components/table/AnalysisRow";
import { BacktestTableHeader } from "../components/table/TableHeader";

interface AnalysisTableProps {
  data?: any[];
  analyses?: any[];
  selectedItems?: Set<string>;
  onSelectAll?: (checked: boolean) => void;
  onSelect?: (id: string) => void;
  totalProfitLoss?: number;
}

export const AnalysisTable = ({
  data = [],
  analyses = [],
  selectedItems,
  onSelectAll,
  onSelect,
  totalProfitLoss
}: AnalysisTableProps) => {
  // Use either data or analyses prop (for backward compatibility)
  const tableData = analyses.length > 0 ? analyses : data;
  
  console.log("AnalysisTable: Rendering with", tableData.length, "items");
  
  return (
    <div className="w-full overflow-auto">
      <Table>
        <BacktestTableHeader />
        {tableData.map((item) => (
          <AnalysisRow
            key={item.id}
            id={item.id}
            symbol={item.symbol}
            entry_price={item.entry_price}
            exit_price={item.exit_price}
            target_price={item.target_price}
            stop_loss={item.stop_loss}
            direction={item.direction}
            profit_loss={item.profit_loss}
            is_success={item.is_success}
            analysisType={item.analysis_type || item.analysisType}
            timeframe={item.timeframe}
            created_at={item.created_at}
            result_timestamp={item.result_timestamp}
            selected={selectedItems?.has(item.id)}
            onSelect={onSelect ? () => onSelect(item.id) : undefined}
          />
        ))}
      </Table>
    </div>
  );
};
