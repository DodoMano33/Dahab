import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

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

  const fetchResults = async () => {
    try {
      console.log("Fetching completed analyses...");
      const { data: results, error } = await supabase
        .from('search_history')
        .select('*')
        .or('target_hit.eq.true,stop_loss_hit.eq.true')
        .order('result_timestamp', { ascending: false });

      if (error) {
        console.error("Error fetching results:", error);
        return;
      }

      console.log("Fetched results:", results);
      setCompletedAnalyses(results || []);

      // Calculate statistics
      const stats: { [key: string]: { success: number; fail: number } } = {};
      results?.forEach(result => {
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

      console.log("Calculated stats:", formattedStats);
      setAnalysisStats(formattedStats);
    } catch (error) {
      console.error("Error in fetchResults:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchResults();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-indigo-700">
              Back Test Results
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
            >
              <Copy className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {analysisStats.map((stat) => (
              <div
                key={stat.type}
                className="flex flex-col items-center text-center"
              >
                <div className="text-sm font-medium mb-2">{stat.type}</div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="bg-green-500 text-white p-1 text-xs rounded">
                    <div>ناجح</div>
                    <div>{stat.success}</div>
                  </div>
                  <div className="bg-red-500 text-white p-1 text-xs rounded">
                    <div>فاشل</div>
                    <div>{stat.fail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border rounded-lg">
            <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 text-right text-sm font-medium">
              <div className="text-center">تحديد</div>
              <div>وقف الخسارة</div>
              <div>الهدف الأول</div>
              <div>الاطار الزمني</div>
              <div>نوع التحليل</div>
              <div>الرمز</div>
              <div>تاريخ النتيجة</div>
            </div>
            <div className="divide-y">
              {completedAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className={`grid grid-cols-7 gap-4 p-4 items-center text-right ${
                    analysis.is_success ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div className="flex justify-center">
                    <Checkbox />
                  </div>
                  <div>
                    {!analysis.is_success && analysis.analysis.stopLoss}
                  </div>
                  <div>
                    {analysis.is_success && analysis.analysis.targets?.[0]?.price}
                  </div>
                  <div>{analysis.timeframe}</div>
                  <div>{analysis.analysis_type}</div>
                  <div>{analysis.symbol}</div>
                  <div>
                    {analysis.result_timestamp && 
                      format(new Date(analysis.result_timestamp), 'PPpp', { locale: ar })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};