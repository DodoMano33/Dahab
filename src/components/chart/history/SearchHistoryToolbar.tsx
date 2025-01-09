import { BackTestResults } from "./BackTestResults";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
    <div className="space-y-4">
      <BackTestResults stats={analysisStats} />
    </div>
  );
};