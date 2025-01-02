import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";
import { SearchHistoryItem, AnalysisData } from "@/types/analysis";
import { HistoryTableHeader } from "./HistoryTableHeader";
import { HistoryRow } from "./HistoryRow";
import { ShareButtons } from "./ShareButtons";

interface SearchHistoryContentProps {
  history: SearchHistoryItem[];
  onDelete: (id: string) => void;
}

export const SearchHistoryContent = ({ history, onDelete }: SearchHistoryContentProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const validHistory = history.filter(item => 
    item && 
    item.symbol && 
    typeof item.symbol === 'string' && 
    item.currentPrice && 
    item.analysis
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <ShareButtons
          selectedItems={selectedItems}
          dateRange={dateRange}
          history={history}
        />
        <div className="flex gap-2">
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'P', { locale: ar })} -{' '}
                      {format(dateRange.to, 'P', { locale: ar })}
                    </>
                  ) : (
                    format(dateRange.from, 'P', { locale: ar })
                  )
                ) : (
                  'اختر التاريخ'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range: any) => {
                  setDateRange(range);
                  if (range.from && range.to) {
                    setIsDatePickerOpen(false);
                  }
                }}
                locale={ar}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <HistoryTableHeader showCheckbox={true} showDelete={true} />
            <TableBody>
              {validHistory.map((item) => (
                <HistoryRow
                  key={item.id}
                  {...item}
                  isSelected={selectedItems.has(item.id)}
                  onSelect={() => {
                    const newSelected = new Set(selectedItems);
                    if (newSelected.has(item.id)) {
                      newSelected.delete(item.id);
                    } else {
                      newSelected.add(item.id);
                    }
                    setSelectedItems(newSelected);
                  }}
                  onDelete={() => onDelete(item.id)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};