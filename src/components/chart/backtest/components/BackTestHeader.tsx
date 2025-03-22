
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, RefreshCw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BackTestHeaderProps {
  initialAnalysesCount: number;
  onClose: () => void;
  onRefresh: () => void;
  onDeleteSelected: () => void;
  selectedItemsCount: number;
  isDeleting: boolean;
  useEntryPoint?: boolean;
  totalProfitLoss?: number;
  currentTradingViewPrice?: number | null;
}

export const BackTestHeader = ({
  initialAnalysesCount,
  onClose,
  onRefresh,
  onDeleteSelected,
  selectedItemsCount,
  isDeleting,
  useEntryPoint = false,
  totalProfitLoss = 0,
  currentTradingViewPrice = null
}: BackTestHeaderProps) => {
  // تنسيق الرقم لعرضه بأربع خانات عشرية وإضافة إشارة سالب إذا كان سالبًا
  const formatProfitLoss = (value: number) => {
    return value.toFixed(4);
  };
  
  const isProfitable = totalProfitLoss >= 0;
  
  return (
    <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <DialogTitle>
          {useEntryPoint ? "نتائج أفضل نقاط الدخول" : "نتائج الباك تست"} 
          {initialAnalysesCount > 0 && (
            <Badge className="mr-2 bg-primary/10 text-primary hover:bg-primary/20" variant="secondary">
              {initialAnalysesCount}
            </Badge>
          )}
        </DialogTitle>
        
        {selectedItemsCount > 0 && (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20" variant="secondary">
            تم تحديد {selectedItemsCount}
          </Badge>
        )}
        
        <div className={`py-1 px-3 rounded-md font-medium ${isProfitable ? 'bg-success/20 text-success border border-success/30' : 'bg-destructive/20 text-destructive border border-destructive/30'}`}>
          الربح/الخسارة: {formatProfitLoss(totalProfitLoss)}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {selectedItemsCount > 0 && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onDeleteSelected}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            حذف المحدد
          </Button>
        )}
        
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-1" />
          تحديث
        </Button>
        
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </DialogHeader>
  );
};
