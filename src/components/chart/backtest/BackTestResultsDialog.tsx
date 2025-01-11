import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
  // Sample data - this should be replaced with actual data from your backend
  const analysisStats: AnalysisStats[] = [
    { type: "Scalping", success: 4, fail: 4 },
    { type: "ICT", success: 4, fail: 3 },
    { type: "Gann", success: 9, fail: 3 },
    { type: "Patterns", success: 5, fail: 2 },
    { type: "SMC", success: 8, fail: 9 },
    { type: "Turtle Soup", success: 6, fail: 5 },
    { type: "Waves", success: 10, fail: 2 },
    { type: "Price Action", success: 20, fail: 5 },
  ];

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
              {/* Sample row - will be replaced with actual data */}
              <div className="grid grid-cols-7 gap-4 p-4 items-center text-right">
                <div className="flex justify-center">
                  <Checkbox />
                </div>
                <div>1.2345</div>
                <div>1.2400</div>
                <div>H4</div>
                <div>سكالبينج</div>
                <div>EURUSD</div>
                <div>2024/03/31</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};