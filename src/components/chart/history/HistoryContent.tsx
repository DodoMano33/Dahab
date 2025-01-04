import { Table, TableBody } from "@/components/ui/table";
import { HistoryTableHeader } from "./HistoryTableHeader";
import { HistoryRow } from "./HistoryRow";
import { AnalysisData } from "@/types/analysis";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface HistoryContentProps {
  history: Array<{
    id: string;
    date: Date;
    symbol: string;
    currentPrice: number;
    analysis: AnalysisData;
    targetHit?: boolean;
    stopLossHit?: boolean;
    analysisType: "عادي" | "سكالبينج" | "ذكي" | "SMC" | "ICT" | "Turtle Soup" | "Gann" | "Waves" | "Patterns" | "Smart" | "Price Action";
    timeframe: string;
  }>;
  selectedItems: Set<string>;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HistoryContent = ({
  history,
  selectedItems,
  onSelect,
  onDelete
}: HistoryContentProps) => {
  const handleSelectAll = () => {
    const allIds = history.map(item => item.id);
    if (selectedItems.size === history.length) {
      // إذا كانت جميع العناصر محددة، قم بإلغاء تحديد الكل
      allIds.forEach(id => onSelect(id));
    } else {
      // قم بتحديد جميع العناصر غير المحددة
      allIds.forEach(id => {
        if (!selectedItems.has(id)) {
          onSelect(id);
        }
      });
    }
  };

  const handleDeleteSelected = async () => {
    try {
      if (selectedItems.size === 0) {
        toast.error("الرجاء تحديد عناصر للحذف");
        return;
      }

      const selectedIds = Array.from(selectedItems);
      for (const id of selectedIds) {
        await onDelete(id);
      }

      toast.success("تم حذف العناصر المحددة بنجاح");
    } catch (error) {
      console.error("خطأ في حذف العناصر:", error);
      toast.error("حدث خطأ أثناء حذف العناصر");
    }
  };

  return (
    <div className="relative rounded-md border bg-background overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedItems.size === history.length && history.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            تحديد الكل ({selectedItems.size}/{history.length})
          </span>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteSelected}
          className="flex items-center gap-2"
          disabled={selectedItems.size === 0}
        >
          <Trash2 className="h-4 w-4" />
          حذف المحدد ({selectedItems.size})
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <HistoryTableHeader showCheckbox={true} showDelete={true} />
          <TableBody className="relative">
            {history.map((item) => (
              <HistoryRow
                key={item.id}
                {...item}
                isSelected={selectedItems.has(item.id)}
                onSelect={() => onSelect(item.id)}
                onDelete={() => onDelete(item.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};