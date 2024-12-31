import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Share2, MessageCircle, Facebook, Trash2 } from "lucide-react";
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

  const formatAnalysisData = (analysis: AnalysisData) => {
    const targets = analysis.targets?.map((target, idx) => 
      `الهدف ${idx + 1}: ${target.price} (${format(target.expectedTime, 'PPpp', { locale: ar })})`
    ).join('\n') || 'لا توجد أهداف';

    return `الاتجاه: ${analysis.direction}
نقطة الدخول: ${analysis.bestEntryPoint?.price || 'غير محدد'}
سبب الدخول: ${analysis.bestEntryPoint?.reason || 'غير محدد'}
وقف الخسارة: ${analysis.stopLoss}
الأهداف:
${targets}`;
  };

  const handleShare = async (platform: 'whatsapp' | 'facebook' | 'copy') => {
    try {
      let shareText = "";
      
      const filteredHistory = validHistory.filter(item => {
        if (selectedItems.size > 0) {
          return selectedItems.has(`${item.symbol}-${item.date.getTime()}`);
        }
        if (dateRange.from && dateRange.to) {
          return item.date >= dateRange.from && item.date <= dateRange.to;
        }
        return false;
      });

      if (filteredHistory.length === 0) {
        toast.error("الرجاء تحديد عناصر للمشاركة");
        return;
      }

      shareText = filteredHistory.map(item => `
تاريخ التحليل: ${format(item.date, 'PPpp', { locale: ar })}
الرمز: ${item.symbol}
نوع التحليل: ${item.analysisType}
السعر عند التحليل: ${item.currentPrice}
${formatAnalysisData(item.analysis)}
${'-'.repeat(50)}`
      ).join('\n');

      switch (platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'copy':
          await navigator.clipboard.writeText(shareText);
          toast.success("تم نسخ المحتوى إلى الحافظة");
          break;
      }
    } catch (error) {
      console.error("خطأ في المشاركة:", error);
      toast.error("حدث خطأ أثناء المشاركة");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
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

      <div className="max-h-[70vh] overflow-auto">
        <Table>
          <HistoryTableHeader showCheckbox={true} showDelete={true} />
          <TableBody>
            {history.map((item) => (
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
  );
};
