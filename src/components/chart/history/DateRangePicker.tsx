import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface DateRangePickerProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

export const DateRangePicker = ({ 
  dateRange, 
  isOpen, 
  onOpenChange, 
  onSelect 
}: DateRangePickerProps) => {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
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
          onSelect={onSelect}
          locale={ar}
        />
      </PopoverContent>
    </Popover>
  );
};