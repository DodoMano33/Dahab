
import React from 'react';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { TrashIcon, DownloadIcon } from 'lucide-react';
import { format } from 'date-fns';

interface PriceRecord {
  price: number;
  timestamp: Date;
  source: string;
}

interface HistoryActionsProps {
  priceHistory: PriceRecord[];
  clearHistory: () => void;
}

export const HistoryActions: React.FC<HistoryActionsProps> = ({ 
  priceHistory, 
  clearHistory 
}) => {
  // تصدير البيانات كملف CSV
  const exportToCSV = () => {
    if (priceHistory.length === 0) return;
    
    // تحويل البيانات إلى صيغة CSV
    const headers = 'Price,Timestamp,Source\n';
    const csvData = priceHistory.map(record => 
      `${record.price},${record.timestamp.toISOString()},"${record.source}"`
    ).join('\n');
    
    const csvContent = headers + csvData;
    
    // إنشاء ملف Blob وتحميله
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
  
  // تصدير البيانات كملف JSON
  const exportToJSON = () => {
    if (priceHistory.length === 0) return;
    
    // تحويل البيانات إلى صيغة JSON
    const jsonData = JSON.stringify(priceHistory.map(record => ({
      price: record.price,
      timestamp: record.timestamp.toISOString(),
      source: record.source
    })), null, 2);
    
    // إنشاء ملف Blob وتحميله
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
  );
};
