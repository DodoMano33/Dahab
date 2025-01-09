import { BackTestResults } from "./BackTestResults";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SearchHistoryToolbarProps {
  selectedItems: Set<string>;
  onDelete: (id: string) => void;
  validHistory: any[];
}

export const SearchHistoryToolbar = ({
  selectedItems,
  onDelete,
  validHistory,
}: SearchHistoryToolbarProps) => {
  const [analysisStats, setAnalysisStats] = useState<any[]>([]);

  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedItems) {
        await onDelete(id);
      }
      toast.success("تم حذف العناصر المحددة بنجاح");
    } catch (error) {
      console.error("Error deleting selected items:", error);
      toast.error("حدث خطأ أثناء حذف العناصر المحددة");
    }
  };

  useEffect(() => {
    const fetchAnalysisStats = async () => {
      try {
        console.log("Fetching analysis stats...");
        const { data: historyData, error } = await supabase
          .from('search_history')
          .select('analysis_type, target_hit, stop_loss_hit')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

        if (error) {
          console.error('Error fetching analysis stats:', error);
          return;
        }

        console.log("Raw history data:", historyData);

        const statsMap = new Map();
        const analysisTypes = ['سكالبينج', 'ICT', 'Gann', 'Patterns', 'SMC', 'Turtle Soup', 'Waves', 'Price Action', 'ذكي', 'عادي'];

        analysisTypes.forEach(type => {
          statsMap.set(type, { type, successCount: 0, failureCount: 0 });
        });

        historyData.forEach((record: any) => {
          const stat = statsMap.get(record.analysis_type);
          if (stat) {
            if (record.target_hit) {
              stat.successCount++;
            }
            if (record.stop_loss_hit) {
              stat.failureCount++;
            }
          }
        });

        const finalStats = Array.from(statsMap.values()).filter(
          stat => stat.successCount > 0 || stat.failureCount > 0
        );
        
        console.log("Processed analysis stats:", finalStats);
        setAnalysisStats(finalStats);
      } catch (error) {
        console.error('Error processing analysis stats:', error);
      }
    };

    fetchAnalysisStats();
  }, [validHistory]);

  return (
    <div className="space-y-4 p-4">
      {selectedItems.size > 0 && (
        <div className="flex items-center justify-between bg-muted/50 p-2 rounded-lg">
          <span className="text-sm text-muted-foreground">
            تم تحديد {selectedItems.size} عنصر
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            حذف المحدد
          </Button>
        </div>
      )}
      <BackTestResults stats={analysisStats} />
    </div>
  );
};