import React, { useState, useEffect } from 'react';
import { usePriceExtractor } from '@/hooks/usePriceExtractor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { DownloadIcon, TrashIcon, RotateCwIcon, InfoIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const [showHistory, setShowHistory] = useState<boolean>(false);
  
  const { 
    price, 
    lastUpdated, 
    source, 
    isExtracting, 
    priceHistory, 
    clearHistory, 
    extractPriceFromDOM 
  } = usePriceExtractor({
    interval: interval,
    enabled: isEnabled
  });
  
  useEffect(() => {
    if (price !== null && onPriceExtracted) {
      onPriceExtracted(price);
    }
  }, [price, onPriceExtracted]);
  
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

  const exportToCSV = () => {
    if (priceHistory.length === 0) return;
    
    const headers = 'Price,Timestamp,Source\n';
    const csvData = priceHistory.map(record => 
      `${record.price},${record.timestamp.toISOString()},"${record.source}"`
    ).join('\n');
    
    const csvContent = headers + csvData;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `gold-prices-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportToJSON = () => {
    if (priceHistory.length === 0) return;
    
    const jsonData = JSON.stringify(priceHistory.map(record => ({
      price: record.price,
      timestamp: record.timestamp.toISOString(),
      source: record.source
    })), null, 2);
    
    const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `gold-prices-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        
        <TabsContent value="main" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">قارئ السعر التلقائي</h3>
            <div className="flex items-center gap-2">
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
                  extractPriceFromDOM();
                }
              }}
            >
              <RotateCwIcon className="ml-2 h-4 w-4" />
              {isExtracting ? 'جاري القراءة...' : 'قراءة السعر الآن'}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">سجل الأسعار</h3>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm" 
                      onClick={clearHistory}
                      disabled={priceHistory.length === 0}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>مسح السجل</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportToCSV}
                      disabled={priceHistory.length === 0}
                    >
                      <DownloadIcon className="h-4 w-4 ml-1" />
                      CSV
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>تصدير بتنسيق CSV</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportToJSON}
                      disabled={priceHistory.length === 0}
                    >
                      <DownloadIcon className="h-4 w-4 ml-1" />
                      JSON
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>تصدير بتنسيق JSON</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {priceHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <InfoIcon className="h-8 w-8 mx-auto mb-2" />
              <p>لا توجد بيانات لعرضها بعد</p>
              <p className="text-sm">سيتم تسجيل الأسعار تلقائياً كل {parseFloat(customInterval)} ثانية</p>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">الوقت</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">السعر</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">المصدر</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {priceHistory.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700 text-right">
                        {record.timestamp.toLocaleTimeString('ar-SA')}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-right">
                        {record.price.toFixed(3)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 text-right truncate max-w-[150px]">
                        {record.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="text-center text-xs text-gray-500 pt-2">
            يتم تخزين حتى 1000 سجل. استخدم أزرار التصدير للاحتفاظ بالبيانات.
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
