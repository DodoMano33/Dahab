import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ShareButtonGroup } from "./history/ShareButtonGroup";
import { DateRangePicker } from "./history/DateRangePicker";
import { HistoryContent } from "./history/HistoryContent";
import { formatAnalysisData, filterHistoryByDateRange } from "./history/historyUtils";
import { AnalysisData } from "@/types/analysis";

interface SearchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: Array<{
    id: string;
    date: Date;
    symbol: string;
    currentPrice: number;
    analysis: AnalysisData;
    targetHit?: boolean;
    stopLossHit?: boolean;
    analysisType: "عادي" | "سكالبينج" | "ذكي" | "SMC" | "ICT" | "Turtle Soup" | "Gann";
  }>;
  onDelete: (id: string) => void;
}

export const SearchHistory = ({ isOpen, onClose, history, onDelete }: SearchHistoryProps) => {
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

  const handleShare = async (platform: 'whatsapp' | 'facebook' | 'copy') => {
    try {
      const filteredHistory = filterHistoryByDateRange(validHistory, selectedItems, dateRange);

      if (filteredHistory.length === 0) {
        toast.error("الرجاء تحديد عناصر للمشاركة");
        return;
      }

      const shareText = filteredHistory.map(item => `
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

  const handleDeleteSelected = async () => {
    try {
      const selectedIds = Array.from(selectedItems);
      if (selectedIds.length === 0) {
        toast.error("الرجاء تحديد عناصر للحذف");
        return;
      }

      for (const id of selectedIds) {
        await onDelete(id);
      }

      setSelectedItems(new Set());
      toast.success("تم حذف العناصر المحددة بنجاح");
    } catch (error) {
      console.error("خطأ في حذف العناصر:", error);
      toast.error("حدث خطأ أثناء حذف العناصر");
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>سجل البحث</span>
            <div className="flex gap-2">
              <DateRangePicker
                dateRange={dateRange}
                isOpen={isDatePickerOpen}
                onOpenChange={setIsDatePickerOpen}
                onSelect={(range: any) => {
                  setDateRange(range);
                  if (range.from && range.to) {
                    setIsDatePickerOpen(false);
                  }
                }}
              />

              <Button onClick={handleDeleteSelected} variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>

              <ShareButtonGroup onShare={handleShare} />
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <HistoryContent
          history={validHistory}
          selectedItems={selectedItems}
          onSelect={handleSelect}
          onDelete={onDelete}
        />
      </DialogContent>
    </Dialog>
  );
};