
import React from 'react';
import TradingViewWidget from './TradingViewWidget';
import { Card, CardContent } from '@/components/ui/card';

interface LiveTradingViewChartProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

export const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ 
  symbol = "XAUUSD",
  onSymbolChange,
  onPriceUpdate
}) => {
  return (
    <Card className="w-full mb-6">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2 text-center">سعر الذهب الحالي</h3>
        <div>
          <TradingViewWidget symbol={symbol} />
        </div>
      </CardContent>
    </Card>
  );
};
