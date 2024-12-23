import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { AnalysisData } from "@/types/analysis";

interface SearchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: Array<{
    date: Date;
    symbol: string;
    currentPrice: number;
    analysis: AnalysisData;
  }>;
}

export const SearchHistory = ({ isOpen, onClose, history }: SearchHistoryProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>سجل البحث</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">الرمز</TableHead>
                <TableHead className="text-right">السعر الحالي</TableHead>
                <TableHead className="text-right">أفضل نقطة دخول</TableHead>
                <TableHead className="text-right">الأهداف والتوقيت</TableHead>
                <TableHead className="text-right">وقف الخسارة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-right">
                    {format(item.date, 'PPpp', { locale: ar })}
                  </TableCell>
                  <TableCell className="text-right">{item.symbol}</TableCell>
                  <TableCell className="text-right">{item.currentPrice}</TableCell>
                  <TableCell className="text-right">
                    {item.analysis.bestEntryPoint ? (
                      <div>
                        <div>السعر: {item.analysis.bestEntryPoint.price}</div>
                        <div className="text-sm text-gray-600">
                          السبب: {item.analysis.bestEntryPoint.reason}
                        </div>
                      </div>
                    ) : (
                      "غير متوفر"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="space-y-2">
                      {item.analysis.targets?.map((target, idx) => (
                        <div key={idx}>
                          الهدف {idx + 1}: {target.price}
                          <br />
                          التوقيت: {format(target.expectedTime, 'PPpp', { locale: ar })}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.analysis.stopLoss}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};