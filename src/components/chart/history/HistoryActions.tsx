import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SearchHistoryItem } from "@/types/analysis";
import { generateShareText } from "./ShareText";

interface HistoryActionsProps {
  selectedItems: Set<string>;
  onDelete: () => void;
  history: SearchHistoryItem[];
}

export const HistoryActions = ({ selectedItems, onDelete, history }: HistoryActionsProps) => {
  const handleCopy = async () => {
    try {
      const selectedHistory = history.filter(item => selectedItems.has(item.id));

      if (selectedHistory.length === 0) {
        toast.error("الرجاء تحديد عناصر للنسخ");
        return;
      }

      const shareText = selectedHistory.map(item => generateShareText(item)).join('\n\n---\n\n');
      await navigator.clipboard.writeText(shareText);
      toast.success("تم نسخ المحتوى بنجاح");
    } catch (error) {
      console.error("خطأ في النسخ:", error);
      toast.error("حدث خطأ أثناء نسخ المحتوى");
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleCopy} variant="outline" size="icon">
        <Copy className="h-4 w-4" />
      </Button>
      {selectedItems.size > 0 && (
        <Button 
          onClick={onDelete} 
          variant="destructive" 
          size="icon"
          className="transition-all duration-200 ease-in-out hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};