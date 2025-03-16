import {
  Table,
} from "@/components/ui/table";
import { AnalysisRow } from "./AnalysisRow";
import { BacktestTableHeader } from "./TableHeader";

interface AnalysisTableProps {
  data: any[];
}

export const AnalysisTable = ({
  data
}: AnalysisTableProps) => {

  return (
    <div className="w-full overflow-auto">
      <Table>
        <BacktestTableHeader />
        {data.map((item) => (
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
            analysisType={item.analysisType}
            timeframe={item.timeframe}
            created_at={item.created_at}
            result_timestamp={item.result_timestamp}
          />
        ))}
      </Table>
    </div>
  );
};
