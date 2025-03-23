
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HistoryContent } from "./HistoryContent";
import { SearchHistoryHeader } from "./SearchHistoryHeader";
import { HistoryActions } from "./HistoryActions";
import { useState } from "react";
import { toast } from "sonner";
import { SearchHistoryItem } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCw } from "lucide-react";
import { ExportAnalysis } from "./ExportAnalysis";
import { useIsMobile } from "@/hooks/use-mobile";

interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  history: Array<SearchHistoryItem>;
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
  const isMobile = useIsMobile();
  
  const validHistory = history.filter(item => item && item.symbol && typeof item.symbol === 'string' && item.currentPrice && item.analysis);
  
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
  
  const selectedHistoryItems = validHistory.filter(item => selectedItems.has(item.id));
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent 
        className={`${isMobile ? 'w-[100vw] max-w-none p-1 h-[95vh]' : 'max-w-[98vw] w-[1400px] p-4 h-[90vh]'} 
        flex flex-col overflow-hidden`} 
        dir="rtl"
      >
        <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} justify-between mb-2`}>
          <SearchHistoryHeader initialCount={validHistory.length} />
          <div className={`flex items-center gap-2 ${isMobile ? 'mt-2' : ''}`}>
            <ExportAnalysis selectedItems={selectedHistoryItems} />
            
            {refreshHistory && (
              <Button 
                variant="outline" 
                size={isMobile ? "xs" : "sm"}
                onClick={refreshHistory}
                disabled={isRefreshing}
                className={isMobile ? "p-1.5" : "mr-2"}
              >
                <RefreshCw className={`h-4 w-4 ${isMobile ? '' : 'mr-1'} ${isRefreshing ? 'animate-spin' : ''}`} />
                {!isMobile && "تحديث"}
              </Button>
            )}
          </div>
        </div>
        <div className={`flex justify-end ${isMobile ? 'py-1' : 'p-2'} mb-2 border-b`}>
          <HistoryActions 
            selectedItems={selectedItems} 
            onDelete={handleDeleteSelected} 
            history={validHistory} 
          />
        </div>
        <div className="flex-1 h-full overflow-hidden">
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
