
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, X, Scroll, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface BackTestHeaderProps {
  initialAnalysesCount: number;
  onClose: () => void;
  onRefresh: () => Promise<void>;
  onDeleteSelected: () => Promise<void>;
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
  const [analysesCount, setAnalysesCount] = useState(initialAnalysesCount);
  const { user } = useAuth();

  // دالة لتنسيق إجمالي الربح/الخسارة
  const formatTotalProfitLoss = (total: number) => {
    return total >= 0 ? `+${total.toFixed(3)}` : `${total.toFixed(3)}`;
  };

  useEffect(() => {
    setAnalysesCount(initialAnalysesCount);

    const channel = supabase
      .channel('backtest_results_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'backtest_results',
          filter: user ? `user_id=eq.${user.id}` : undefined
        },
        async () => {
          const { count } = await supabase
            .from('backtest_results')
            .select('*', { count: 'exact', head: true });
          
          setAnalysesCount(count || 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialAnalysesCount, user]);

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
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="mr-2">
              {analysesCount} تحليل
            </Badge>
            {analysesCount > 0 && (
              <Badge variant={totalProfitLoss >= 0 ? "success" : "destructive"} className="font-bold">
                {formatTotalProfitLoss(totalProfitLoss)}
              </Badge>
            )}
            {currentTradingViewPrice !== null && (
              <Badge variant="outline" className="ml-2 font-mono">
                السعر الحالي: {currentTradingViewPrice.toFixed(3)}
              </Badge>
            )}
          </div>
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
