
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HistoryContent } from "./HistoryContent";
import { SearchHistoryHeader } from "./SearchHistoryHeader";
import { HistoryActions } from "./HistoryActions";
import { useState } from "react";
import { toast } from "sonner";
import { AnalysisData, AnalysisType } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";

interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  history: Array<{
    id: string;
    date: Date;
    symbol: string;
    currentPrice: number;
    analysis: AnalysisData;
    analysisType: AnalysisType;
    timeframe: string;
    targetHit?: boolean;
    stopLossHit?: boolean;
    analysis_duration_hours?: number;
  }>;
  onDelete: (id: string) => void;
  refreshHistory?: () => void;
  isRefreshing?: boolean;
}

export const HistoryDialog = ({ 
  isOpen, 
  onClose, 
  history, 
  onDelete, 
  refreshHistory,
  isRefreshing = false
}: HistoryDialogProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const validHistory = history.filter(item => 
    item && 
    item.symbol && 
    typeof item.symbol === 'string' && 
    item.currentPrice && 
    item.analysis
  );

  const handleSelect = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
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

  const handleCopyAll = async () => {
    try {
      const selectedIds = Array.from(selectedItems);
      if (selectedIds.length === 0) {
        toast.error("الرجاء تحديد عناصر للنسخ");
        return;
      }

      const selectedHistoryItems = validHistory.filter(item => selectedItems.has(item.id));
      const textToCopy = selectedHistoryItems.map(item => 
        `${item.symbol} - ${item.timeframe} - ${item.analysisType}`
      ).join('\n');

      await navigator.clipboard.writeText(textToCopy);
      toast.success("تم نسخ العناصر المحددة بنجاح");
    } catch (error) {
      console.error("خطأ في نسخ العناصر:", error);
      toast.error("حدث خطأ أثناء نسخ العناصر");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[1200px] p-6 h-[90vh] flex flex-col" dir="rtl">
        <div className="flex items-center justify-between">
          <SearchHistoryHeader initialCount={validHistory.length} />
          {refreshHistory && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyAll}
                disabled={selectedItems.size === 0}
                className="mr-2"
              >
                <Copy className="h-4 w-4 mr-1" />
                نسخ
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshHistory}
                disabled={isRefreshing}
                className="mr-2"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
            </div>
          )}
        </div>
        <div className="flex justify-end p-2">
          <HistoryActions
            selectedItems={selectedItems}
            onDelete={handleDeleteSelected}
            history={validHistory}
          />
        </div>
        <div className="flex-1 overflow-hidden mt-4">
          <HistoryContent 
            history={validHistory} 
            onDelete={onDelete}
            selectedItems={selectedItems}
            onSelect={handleSelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
