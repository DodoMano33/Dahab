
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { HistoryActions } from './HistoryActions';
import { EmptyHistoryMessage } from './EmptyHistoryMessage';
import { PriceHistoryTable } from './PriceHistoryTable';

interface PriceRecord {
  price: number;
  timestamp: Date;
  source: string;
}

interface PriceHistoryTabProps {
  priceHistory: PriceRecord[];
  clearHistory: () => void;
  customInterval: string;
}

export const PriceHistoryTab: React.FC<PriceHistoryTabProps> = ({
  priceHistory,
  clearHistory,
  customInterval
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">سجل الأسعار</h3>
        <HistoryActions 
          priceHistory={priceHistory} 
          clearHistory={clearHistory} 
        />
      </div>
      
      {priceHistory.length === 0 ? (
        <EmptyHistoryMessage intervalSeconds={customInterval} />
      ) : (
        <>
          <PriceHistoryTable priceHistory={priceHistory} />
          
          <div className="text-center text-xs text-gray-500 pt-2">
            يتم تخزين حتى 1000 سجل. استخدم أزرار التصدير للاحتفاظ بالبيانات.
          </div>
        </>
      )}
    </div>
  );
};
