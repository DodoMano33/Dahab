import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, X, Scroll, RotateCcw, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = completedAnalyses.map(analysis => analysis.id);
      setSelectedItems(new Set(allIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleRefresh = async () => {
    await fetchResults();
    toast.success("تم تحديث النتائج بنجاح");
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

  const calculateProfitLoss = (analysis: any) => {
    if (!analysis.entry_price || !analysis.exit_price) {
      return 0;
    }

    const entryPrice = analysis.entry_price;
    const exitPrice = analysis.exit_price;
    const direction = analysis.direction;

    if (direction === "صاعد") {
      return +(exitPrice - entryPrice).toFixed(2);
    } else {
      return +(entryPrice - exitPrice).toFixed(2);
    }
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
        return;
      }

      console.log("Fetched backtest results:", results);
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
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="sticky top-0 z-50 bg-background p-6 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
              <Scroll className="h-5 w-5" />
              نتائج الباك تست
            </DialogTitle>
            <div className="flex items-center gap-2">
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

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {analysisStats.map((stat) => (
                <div
                  key={stat.type}
                  className="flex flex-col items-center text-center bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="text-sm font-medium mb-3">{stat.type}</div>
                  <div className="flex gap-2">
                    <Badge variant="success" className="flex flex-col items-center p-2">
                      <span>ناجح</span>
                      <span className="text-lg font-bold">{stat.success}</span>
                    </Badge>
                    <Badge variant="destructive" className="flex flex-col items-center p-2">
                      <span>فاشل</span>
                      <span className="text-lg font-bold">{stat.fail}</span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="border rounded-lg bg-white shadow-sm">
              <div className="sticky top-0 z-40 grid grid-cols-10 gap-4 p-4 bg-muted/50 text-right text-sm font-medium border-b">
                <div className="text-center flex items-center justify-center">
                  <Checkbox 
                    checked={selectedItems.size === completedAnalyses.length && completedAnalyses.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </div>
                <div>وقف الخسارة</div>
                <div>الهدف الأول</div>
                <div>السعر عند التحليل</div>
                <div>أفضل نقطة دخول</div>
                <div>الربح/الخسارة</div>
                <div>الاطار الزمني</div>
                <div>نوع التحليل</div>
                <div>الرمز</div>
                <div>تاريخ النتيجة</div>
              </div>
              <div className="divide-y">
                {completedAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className={`grid grid-cols-10 gap-4 p-4 items-center text-right hover:bg-muted/50 transition-colors ${
                      analysis.is_success ? 'bg-success/10' : 'bg-destructive/10'
                    }`}
                  >
                    <div className="flex justify-center">
                      <Checkbox 
                        checked={selectedItems.has(analysis.id)}
                        onCheckedChange={() => handleSelect(analysis.id)}
                      />
                    </div>
                    <div>{analysis.stop_loss}</div>
                    <div>{analysis.target_price}</div>
                    <div>{analysis.entry_price}</div>
                    <div>{analysis.entry_price}</div>
                    <div className={`font-medium ${analysis.profit_loss >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {analysis.profit_loss}
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};