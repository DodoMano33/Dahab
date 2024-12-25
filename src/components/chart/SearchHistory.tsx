import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody } from "@/components/ui/table";
import { AnalysisData } from "@/types/analysis";
import { useEffect, useState, useRef } from "react";
import { HistoryTableHeader } from "./history/HistoryTableHeader";
import { HistoryRow } from "./history/HistoryRow";
import { toast } from "sonner";
import { priceUpdater } from "@/utils/priceUpdater";

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
    analysisType: "عادي" | "سكالبينج";
  }>;
}

export const SearchHistory = ({ isOpen, onClose, history }: SearchHistoryProps) => {
  const [priceStates, setPriceStates] = useState<{ [key: string]: { currentPrice: number; lastUpdated: Date } }>({});
  const notifiedSymbols = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isOpen || !history.length) return;

    const validHistory = history.filter(item => 
      item?.symbol && 
      typeof item.symbol === 'string' && 
      item.currentPrice && 
      item.analysis
    );

    validHistory.forEach(item => {
      const symbol = item.symbol.toUpperCase();
      
      const onUpdate = (price: number) => {
        setPriceStates(prev => ({
          ...prev,
          [symbol]: {
            currentPrice: price,
            lastUpdated: new Date()
          }
        }));

        if (!notifiedSymbols.current.has(symbol)) {
          if (price <= item.analysis.stopLoss) {
            console.log(`تم الوصول لنقطة وقف الخسارة للعملة ${symbol}`);
            toast.warning(`${symbol} وصل إلى وقف الخسارة`);
            notifiedSymbols.current.add(symbol);
          } else if (
            item.analysis.targets && 
            item.analysis.targets[0] && 
            price >= item.analysis.targets[0].price
          ) {
            console.log(`تم الوصول للهدف للعملة ${symbol}`);
            toast.success(`${symbol} وصل إلى الهدف الأول`);
            notifiedSymbols.current.add(symbol);
          }
        }
      };

      const onError = (error: Error) => {
        console.error(`خطأ في تحديث السعر للعملة ${symbol}:`, error);
        if (!notifiedSymbols.current.has(`${symbol}_error`)) {
          toast.error(`فشل في تحديث السعر للعملة ${symbol}`);
          notifiedSymbols.current.add(`${symbol}_error`);
        }
      };

      priceUpdater.subscribe({ symbol, onUpdate, onError });
    });

    return () => {
      validHistory.forEach(item => {
        if (item?.symbol) {
          const symbol = item.symbol.toUpperCase();
          priceUpdater.unsubscribe(symbol, () => {});
        }
      });
    };
  }, [isOpen, history]);

  const validHistory = history.filter(item => 
    item && 
    item.symbol && 
    typeof item.symbol === 'string' && 
    item.currentPrice && 
    item.analysis
  );

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
                  key={`${item.symbol}-${index}-${item.date.getTime()}`}
                  date={item.date}
                  symbol={item.symbol}
                  currentPrice={item.currentPrice}
                  analysis={item.analysis}
                  analysisType={item.analysisType}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};