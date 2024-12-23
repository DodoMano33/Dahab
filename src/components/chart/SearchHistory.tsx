import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody } from "@/components/ui/table";
import { AnalysisData } from "@/types/analysis";
import { useEffect, useState } from "react";
import { getCurrentPriceFromTradingView } from "@/utils/tradingViewUtils";
import { HistoryTableHeader } from "./history/HistoryTableHeader";
import { HistoryRow } from "./history/HistoryRow";
import { toast } from "sonner";

interface SearchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: Array<{
    date: Date;
    symbol: string;
    currentPrice: number;
    analysis: AnalysisData;
    targetHit?: boolean;
    stopLossHit?: boolean;
  }>;
}

export const SearchHistory = ({ isOpen, onClose, history }: SearchHistoryProps) => {
  const [priceStates, setPriceStates] = useState<{ [key: string]: { currentPrice: number; isActive: boolean } }>({});

  useEffect(() => {
    const updatePrices = async () => {
      console.log("تحديث الأسعار لسجل البحث:", history);
      
      for (const item of history) {
        if (!item?.symbol) {
          console.warn("تم العثور على عنصر بدون رمز في سجل البحث");
          continue;
        }

        try {
          console.log(`جاري تحديث السعر للعملة ${item.symbol}`);
          const price = await getCurrentPriceFromTradingView(item.symbol);
          
          setPriceStates(prev => ({
            ...prev,
            [item.symbol]: {
              currentPrice: price,
              isActive: true
            }
          }));

          console.log(`تم تحديث السعر للعملة ${item.symbol}:`, price);

          // التحقق من وصول السعر إلى وقف الخسارة أو الهدف
          if (price <= item.analysis.stopLoss) {
            console.log(`تم الوصول لنقطة وقف الخسارة للعملة ${item.symbol}`);
            toast.warning(`${item.symbol} وصل إلى وقف الخسارة`);
          } else if (
            item.analysis.targets && 
            item.analysis.targets[0] && 
            price >= item.analysis.targets[0].price
          ) {
            console.log(`تم الوصول للهدف للعملة ${item.symbol}`);
            toast.success(`${item.symbol} وصل إلى الهدف الأول`);
          }
        } catch (error) {
          console.error(`خطأ في تحديث السعر للعملة ${item.symbol}:`, error);
          toast.error(`فشل في تحديث السعر للعملة ${item.symbol}`);
        }
      }
    };

    if (isOpen && history.length > 0) {
      updatePrices();
      const interval = setInterval(updatePrices, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, history]);

  // تصفية السجل للتأكد من وجود رموز صحيحة فقط
  const validHistory = history.filter(item => item && item.symbol);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>سجل البحث</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-auto">
          <Table>
            <HistoryTableHeader />
            <TableBody>
              {validHistory.map((item, index) => (
                <HistoryRow
                  key={`${item.symbol}-${item.date.getTime()}`}
                  date={item.date}
                  symbol={item.symbol}
                  currentPrice={item.currentPrice}
                  analysis={item.analysis}
                  latestPrice={priceStates[item.symbol]?.currentPrice}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};