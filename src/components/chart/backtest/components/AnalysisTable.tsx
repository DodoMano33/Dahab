
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";

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
  // Format numbers to show only 3 decimal places
  const formatNumber = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return "-";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return Number(num).toFixed(3);
  };

  console.log("Rendering analysis table with analyses:", analyses.length);
  if (analyses.length > 0) {
    console.log("Sample analysis types from items:", analyses.slice(0, 5).map(a => 
      `${a.id}: ${a.analysis_type} -> ${getStrategyName(a.analysis_type)}`
    ));
    console.log("Unique analysis types in table:", 
      [...new Set(analyses.map(a => a.analysis_type))]);
  }

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="grid grid-cols-10 gap-1 p-2 bg-muted/50 text-right text-xs font-medium border-b sticky top-0 z-40">
        <div className="text-center flex items-center justify-center">
          <Checkbox 
            checked={selectedItems.size === analyses.length && analyses.length > 0}
            onCheckedChange={onSelectAll}
          />
        </div>
        <div>Stop Loss</div>
        <div>First Target</div>
        <div>Entry Price</div>
        <div>Best Entry</div>
        <div>Result</div>
        <div>Timeframe</div>
        <div>Analysis Type</div>
        <div>Symbol</div>
        <div>Result Date</div>
      </div>
      <div className="divide-y text-xs">
        {analyses.map((analysis) => {
          const displayedAnalysisType = getStrategyName(analysis.analysis_type);
          return (
            <div
              key={analysis.id}
              className={`grid grid-cols-10 gap-1 p-2 items-center text-right hover:bg-muted/50 transition-colors ${
                analysis.is_success ? 'bg-success/10' : 'bg-destructive/10'
              }`}
            >
              <div className="flex justify-center">
                <Checkbox 
                  checked={selectedItems.has(analysis.id)}
                  onCheckedChange={() => onSelect(analysis.id)}
                />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="truncate">{formatNumber(analysis.stop_loss)}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Stop Loss: {formatNumber(analysis.stop_loss)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="truncate">{formatNumber(analysis.target_price)}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>First Target: {formatNumber(analysis.target_price)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="truncate">{formatNumber(analysis.entry_price)}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Entry Price: {formatNumber(analysis.entry_price)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="truncate">{formatNumber(analysis.best_entry_price || analysis.entry_price)}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Best Entry Point: {formatNumber(analysis.best_entry_price || analysis.entry_price)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className={`font-medium truncate ${analysis.is_success ? 'text-success' : 'text-destructive'}`}>
                {analysis.is_success ? 'Success' : 'Failure'}
              </div>
              <div className="truncate">{analysis.timeframe}</div>
              <div className="truncate">{displayedAnalysisType}</div>
              <div className="truncate">{analysis.symbol}</div>
              <div className="truncate">
                {analysis.result_timestamp && 
                  format(new Date(analysis.result_timestamp), 'PPpp', { locale: ar })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
