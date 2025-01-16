import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface AnalysisTableProps {
  analyses: any[];
  selectedItems: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string) => void;
}

export const AnalysisTable = ({
  analyses,
  selectedItems,
  onSelectAll,
  onSelect,
}: AnalysisTableProps) => {
  const formatNumber = (num: number) => {
    return Number(num).toFixed(3);
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="sticky top-0 z-40 grid grid-cols-10 gap-4 p-4 bg-muted/50 text-right text-sm font-medium border-b">
        <div className="text-center flex items-center justify-center">
          <Checkbox 
            checked={selectedItems.size === analyses.length && analyses.length > 0}
            onCheckedChange={onSelectAll}
          />
        </div>
        <div>وقف الخسارة</div>
        <div>الهدف الأول</div>
        <div>السعر عند التحليل</div>
        <div>أفضل نقطة دخول</div>
        <div>الربح/الخسارة</div>
        <div>الاطار الزمني</div>
        <div>نوع التحليل</div>
        <div>الرمز</div>
        <div>تاريخ النتيجة</div>
      </div>
      <div className="divide-y">
        {analyses.map((analysis) => (
          <div
            key={analysis.id}
            className={`grid grid-cols-10 gap-4 p-4 items-center text-right hover:bg-muted/50 transition-colors ${
              analysis.is_success ? 'bg-success/10' : 'bg-destructive/10'
            }`}
          >
            <div className="flex justify-center">
              <Checkbox 
                checked={selectedItems.has(analysis.id)}
                onCheckedChange={() => onSelect(analysis.id)}
              />
            </div>
            <div>{formatNumber(analysis.stop_loss)}</div>
            <div>{formatNumber(analysis.target_price)}</div>
            <div>{analysis.entry_price}</div>
            <div>{analysis.entry_price}</div>
            <div className={`font-medium ${analysis.profit_loss >= 0 ? 'text-success' : 'text-destructive'}`}>
              {analysis.profit_loss}
            </div>
            <div>{analysis.timeframe}</div>
            <div>{analysis.analysis_type}</div>
            <div>{analysis.symbol}</div>
            <div>
              {analysis.result_timestamp && 
                format(new Date(analysis.result_timestamp), 'PPpp', { locale: ar })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};