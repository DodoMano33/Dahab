
import React, { useState, useEffect } from 'react';
import { usePriceExtractor } from '@/hooks/usePriceExtractor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PriceExtractorProps {
  defaultInterval?: number;
  onPriceExtracted?: (price: number) => void;
}

export const PriceExtractor: React.FC<PriceExtractorProps> = ({
  defaultInterval = 10000,
  onPriceExtracted
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [interval, setInterval] = useState<number>(defaultInterval);
  const [customInterval, setCustomInterval] = useState<string>(String(defaultInterval / 1000));
  
  const { price, lastUpdated, source, isExtracting } = usePriceExtractor(interval, isEnabled);
  
  // تنفيذ معالج السعر المستخرج عند الحصول على سعر جديد
  useEffect(() => {
    if (price !== null && onPriceExtracted) {
      onPriceExtracted(price);
    }
  }, [price, onPriceExtracted]);
  
  // تحديث الفاصل الزمني
  const handleIntervalChange = () => {
    const newInterval = parseFloat(customInterval) * 1000;
    if (!isNaN(newInterval) && newInterval >= 1000) {
      setInterval(newInterval);
    }
  };
  
  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'لم يتم التحديث بعد';
  
  const formattedPrice = price !== null ? price.toFixed(3) : '-';

  return (
    <Card className="p-4 bg-white shadow-md rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">قارئ السعر التلقائي</h3>
          <div className="flex items-center space-x-2">
            <Switch 
              id="extractor-switch" 
              checked={isEnabled} 
              onCheckedChange={setIsEnabled} 
            />
            <Label htmlFor="extractor-switch">
              {isEnabled ? 'مُفعّل' : 'معطّل'}
            </Label>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">السعر الحالي:</span>
            <span className={`text-lg font-bold ${isExtracting ? 'text-orange-500 animate-pulse' : 'text-green-600'}`}>
              {formattedPrice}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">آخر تحديث:</span>
            <span className="text-sm">{formattedTime}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">المصدر:</span>
            <Badge variant="outline" className="text-xs">
              {source}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex items-center space-x-2 flex-1">
              <Input
                className="w-20 text-right"
                type="number"
                min="1"
                value={customInterval}
                onChange={(e) => setCustomInterval(e.target.value)}
              />
              <span className="text-sm whitespace-nowrap">ثانية</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleIntervalChange}
            >
              تحديث الفاصل الزمني
            </Button>
          </div>
          
          <Button 
            className="mt-2" 
            size="sm" 
            disabled={!isEnabled || isExtracting}
            onClick={() => {
              if (isEnabled) {
                usePriceExtractor().extractPriceFromDOM();
              }
            }}
          >
            {isExtracting ? 'جاري القراءة...' : 'قراءة السعر الآن'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
