
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Split, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { SearchHistoryItem } from "@/types/analysis";
import { generateShareText } from "./ShareText";
import { useState } from "react";
import { CompareAnalysis } from "./CompareAnalysis";

interface HistoryActionsProps {
  selectedItems: Set<string>;
  onDelete: () => void;
  history: SearchHistoryItem[];
  onSelectAll?: () => void;
}

export const HistoryActions = ({ selectedItems, onDelete, history, onSelectAll }: HistoryActionsProps) => {
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);
  
  const handleCopy = async () => {
    try {
      const selectedHistory = history.filter(item => selectedItems.has(item.id));

      if (selectedHistory.length === 0) {
        toast.error("الرجاء تحديد عناصر للنسخ", {
          duration: 3000, // تعديل مدة التنبيه
        });
        return;
      }

      const shareText = selectedHistory.map(item => generateShareText(item)).join('\n\n---\n\n');
      await navigator.clipboard.writeText(shareText);
      toast.success("تم نسخ المحتوى بنجاح", {
        duration: 3000, // تعديل مدة التنبيه
      });
    } catch (error) {
      console.error("خطأ في النسخ:", error);
      toast.error("حدث خطأ أثناء نسخ المحتوى", {
        duration: 3000, // تعديل مدة التنبيه
      });
    }
  };
  
  const handleCompare = () => {
    const selectedHistoryItems = history.filter(item => selectedItems.has(item.id));
    
    if (selectedHistoryItems.length !== 2) {
      toast.error("الرجاء تحديد تحليلين فقط للمقارنة", {
        duration: 3000, // تعديل مدة التنبيه
      });
      return;
    }
    
    setIsCompareDialogOpen(true);
  };

  const selectedHistoryItems = history.filter(item => selectedItems.has(item.id));

  return (
    <div className="flex gap-2">
      {onSelectAll && (
        <Button onClick={onSelectAll} variant="outline" size="icon" title="تحديد الكل">
          <CheckSquare className="h-4 w-4" />
        </Button>
      )}
      
      <Button onClick={handleCopy} variant="outline" size="icon" title="نسخ المحدد">
        <Copy className="h-4 w-4" />
      </Button>
      
      <Button 
        onClick={handleCompare} 
        variant="outline" 
        size="icon" 
        title="مقارنة التحليلات"
        disabled={selectedItems.size !== 2}
      >
        <Split className="h-4 w-4" />
      </Button>
      
      {selectedItems.size > 0 && (
        <Button 
          onClick={onDelete} 
          variant="destructive" 
          size="icon"
          className="transition-all duration-200 ease-in-out hover:bg-red-600"
          title="حذف المحدد"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      
      {/* نافذة مقارنة التحليلات */}
      <CompareAnalysis
        isOpen={isCompareDialogOpen}
        onClose={() => setIsCompareDialogOpen(false)}
        items={selectedHistoryItems}
      />
    </div>
  );
};
