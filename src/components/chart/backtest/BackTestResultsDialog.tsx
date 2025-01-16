import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { BackTestHeader } from "./components/BackTestHeader";
import { AnalysisStats } from "./components/AnalysisStats";
import { AnalysisTable } from "./components/AnalysisTable";

interface AnalysisStats {
  type: string;
  success: number;
  fail: number;
}

interface BackTestResultsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackTestResultsDialog = ({
  isOpen,
  onClose,
}: BackTestResultsDialogProps) => {
  const [analysisStats, setAnalysisStats] = useState<AnalysisStats[]>([]);
  const [completedAnalyses, setCompletedAnalyses] = useState<any[]>([]);
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
    try {
      const selectedArray = Array.from(selectedItems);
      if (selectedArray.length === 0) {
        toast.error("الرجاء تحديد عناصر للحذف");
        return;
      }

      setIsDeleting(true);
      console.log("Deleting selected backtest results:", selectedArray);

      const { error } = await supabase
        .from('backtest_results')
        .delete()
        .in('id', selectedArray);

      if (error) {
        console.error("Error deleting results:", error);
        toast.error("حدث خطأ أثناء حذف النتائج");
        return;
      }

      setCompletedAnalyses(prevAnalyses => 
        prevAnalyses.filter(analysis => !selectedItems.has(analysis.id))
      );
      
      calculateStats(completedAnalyses.filter(analysis => !selectedItems.has(analysis.id)));
      setSelectedItems(new Set());
      toast.success("تم حذف النتائج المحددة بنجاح");
    } catch (error) {
      console.error("Error in handleDeleteSelected:", error);
      toast.error("حدث خطأ أثناء حذف النتائج");
    } finally {
      setIsDeleting(false);
    }
  };

  const calculateStats = (analyses: any[]) => {
    const stats: { [key: string]: { success: number; fail: number } } = {};
    analyses.forEach(result => {
      if (!stats[result.analysis_type]) {
        stats[result.analysis_type] = { success: 0, fail: 0 };
      }
      if (result.is_success) {
        stats[result.analysis_type].success++;
      } else {
        stats[result.analysis_type].fail++;
      }
    });

    const formattedStats = Object.entries(stats).map(([type, counts]) => ({
      type,
      success: counts.success,
      fail: counts.fail,
    }));

    console.log("Calculated new stats:", formattedStats);
    setAnalysisStats(formattedStats);
  };

  const fetchResults = async () => {
    try {
      console.log("Fetching backtest results...");
      const { data: results, error } = await supabase
        .from('backtest_results')
        .select('*')
        .order('result_timestamp', { ascending: false });

      if (error) {
        console.error("Error fetching results:", error);
        toast.error("حدث خطأ أثناء جلب النتائج");
        return;
      }

      console.log("Fetched backtest results:", results);
      setCompletedAnalyses(results || []);
      calculateStats(results || []);
    } catch (error) {
      console.error("Error in fetchResults:", error);
      toast.error("حدث خطأ أثناء جلب النتائج");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchResults();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
        <BackTestHeader
          analysesCount={completedAnalyses.length}
          onClose={onClose}
          onRefresh={fetchResults}
          onDeleteSelected={handleDeleteSelected}
          selectedItemsCount={selectedItems.size}
          isDeleting={isDeleting}
        />

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <AnalysisStats stats={analysisStats} />
            <AnalysisTable
              analyses={completedAnalyses}
              selectedItems={selectedItems}
              onSelectAll={handleSelectAll}
              onSelect={handleSelect}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};