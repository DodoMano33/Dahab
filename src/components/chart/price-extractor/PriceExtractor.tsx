
import React, { useState, useEffect } from 'react';
import { usePriceExtractor } from '@/hooks/usePriceExtractor';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CurrentPriceTab } from './CurrentPriceTab';
import { PriceHistoryTab } from './PriceHistoryTab';
import { PriceExtractorProps } from './types';

export const PriceExtractor: React.FC<PriceExtractorProps> = ({
  defaultInterval = 10000,
  onPriceExtracted,
  customSelectors = []
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [interval, setInterval] = useState<number>(defaultInterval);
  const [customInterval, setCustomInterval] = useState<string>(String(defaultInterval / 1000));
  const [userSelectors, setUserSelectors] = useState<string[]>(customSelectors);
  
  const { 
    price, 
    lastUpdated, 
    source, 
    isExtracting, 
    priceHistory, 
    clearHistory, 
    extractPriceFromDOM,
    setCustomSelectors
  } = usePriceExtractor({
    interval,
    enabled: isEnabled,
    customSelectors: userSelectors,
    extractOnMount: true,
    debugMode: false
  });
  
  // تعيين المحددات المخصصة عند تغييرها
  useEffect(() => {
    setCustomSelectors(userSelectors);
  }, [userSelectors, setCustomSelectors]);
  
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
      <Tabs defaultValue="main">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="main">قارئ السعر</TabsTrigger>
          <TabsTrigger value="history">
            سجل الأسعار 
            {priceHistory.length > 0 && 
              <Badge variant="secondary" className="mr-2">{priceHistory.length}</Badge>
            }
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="main">
          <CurrentPriceTab 
            isEnabled={isEnabled}
            setIsEnabled={setIsEnabled}
            formattedPrice={formattedPrice}
            isExtracting={isExtracting}
            formattedTime={formattedTime}
            source={source}
            customInterval={customInterval}
            setCustomInterval={setCustomInterval}
            handleIntervalChange={handleIntervalChange}
            extractPriceFromDOM={extractPriceFromDOM}
            customSelectors={userSelectors}
            onCustomSelectorsChange={setUserSelectors}
          />
        </TabsContent>
        
        <TabsContent value="history">
          <PriceHistoryTab 
            priceHistory={priceHistory}
            clearHistory={clearHistory}
            customInterval={customInterval}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
