import { HistoryActions } from "./HistoryActions";
import { BackTestResults } from "./BackTestResults";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
        const { data: historyData, error } = await supabase
          .from('search_history')
          .select('analysis_type, target_hit, stop_loss_hit');

        if (error) {
          console.error('Error fetching analysis stats:', error);
          return;
        }

        const statsMap = new Map();
        const analysisTypes = ['Scalping', 'ICT', 'Gann', 'Patterns', 'SMC', 'Turtle Soup', 'Waves', 'Price Action'];

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

        setAnalysisStats(Array.from(statsMap.values()));
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