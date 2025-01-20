import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, X, Scroll, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface BackTestHeaderProps {
  analysesCount: number;
  onClose: () => void;
  onRefresh: () => Promise<void>;
  onDeleteSelected: () => Promise<void>;
  selectedItemsCount: number;
  isDeleting: boolean;
  useEntryPoint?: boolean;
}

export const BackTestHeader = ({
  analysesCount,
  onClose,
  onRefresh,
  onDeleteSelected,
  selectedItemsCount,
  isDeleting,
  useEntryPoint = false
}: BackTestHeaderProps) => {
  const handleRefresh = async () => {
    await onRefresh();
    toast.success("تم تحديث النتائج بنجاح");
  };

  return (
    <DialogHeader className="sticky top-0 z-50 bg-background p-6 border-b">
      <div className="flex items-center justify-between">
        <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
          <Scroll className="h-5 w-5" />
          {useEntryPoint ? "نتائج الباك تست (أفضل نقطة دخول)" : "نتائج الباك تست"}
          <Badge variant="secondary" className="mr-2">
            {analysesCount} تحليل
          </Badge>
        </DialogTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDeleteSelected}
            className="text-destructive hover:text-destructive/90"
            disabled={selectedItemsCount === 0 || isDeleting}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
          >
            <Copy className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </DialogHeader>
  );
};