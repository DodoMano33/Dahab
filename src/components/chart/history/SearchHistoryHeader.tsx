import { HistoryActions } from "./HistoryActions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SearchHistoryHeaderProps {
  selectedItems?: Set<string>;
  onDelete?: (id: string) => void;
  validHistory?: any[];
}

export const SearchHistoryHeader = ({
  selectedItems,
  onDelete,
  validHistory
}: SearchHistoryHeaderProps) => {
  const handleDeleteSelected = async () => {
    try {
      if (!selectedItems || !onDelete) return;
      
      const selectedIds = Array.from(selectedItems);
      if (selectedIds.length === 0) {
        toast.error("الرجاء تحديد عناصر للحذف");
        return;
      }

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
    <div className="px-6 py-4 flex justify-between items-center border-b">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">سجل البحث</h2>
        {selectedItems && selectedItems.size > 0 && (
          <span className="text-sm text-gray-500">
            تم تحديد {selectedItems.size} عنصر
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {selectedItems && selectedItems.size > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>هل أنت متأكد من حذف العناصر المحددة؟</AlertDialogTitle>
                <AlertDialogDescription>
                  سيتم حذف {selectedItems.size} عنصر بشكل نهائي
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSelected}>
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {selectedItems && onDelete && validHistory && (
          <HistoryActions
            selectedItems={selectedItems}
            onDelete={onDelete}
            history={validHistory}
          />
        )}
      </div>
    </div>
  );
};