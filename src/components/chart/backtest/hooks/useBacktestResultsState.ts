
import { useState } from "react";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useBacktestResultsState = (
  completedAnalyses: any[], 
  refreshResults: () => Promise<void>,
  refreshStats: () => Promise<void>
) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = completedAnalyses.map(analysis => analysis.id);
      setSelectedItems(new Set(allIds));
    } else {
      setSelectedItems(new Set());
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

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) {
      toast.error("الرجاء تحديد عناصر للحذف", { duration: 1000 });
      return;
    }

    try {
      setIsDeleting(true);
      const selectedArray = Array.from(selectedItems);
      
      const { error } = await supabase
        .from('backtest_results')
        .delete()
        .in('id', selectedArray);

      if (error) {
        throw error;
      }

      toast.success("تم حذف العناصر المحددة بنجاح", { duration: 1000 });
      setSelectedItems(new Set());
      await refreshResults();
      await refreshStats();
    } catch (error) {
      console.error('Error deleting items:', error);
      toast.error("حدث خطأ أثناء حذف العناصر", { duration: 1000 });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = async () => {
    console.log("Refreshing backtest results and stats...");
    await refreshResults();
    await refreshStats();
  };

  return {
    selectedItems,
    isDeleting,
    handleSelectAll,
    handleSelect,
    handleDeleteSelected,
    handleRefresh
  };
};
