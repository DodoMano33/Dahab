
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2, RotateCw, LineChart } from "lucide-react";
import { SearchHistoryItem } from "@/types/analysis";
import { Separator } from "@/components/ui/separator";
import { ShareButtonGroup } from "./ShareButtonGroup";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SearchHistoryToolbarProps {
  history: SearchHistoryItem[];
  selectedItems: Set<string>;
  onDelete: (id: string) => Promise<void>;
  isRefreshing: boolean;
  refreshHistory: () => Promise<void>;
  showChart: boolean;
  setShowChart: (show: boolean) => void;
  dateRange?: { from: Date | undefined; to: Date | undefined };
  isDatePickerOpen?: boolean;
  setIsDatePickerOpen?: (open: boolean) => void;
  setDateRange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

export const SearchHistoryToolbar = ({
  history,
  selectedItems,
  onDelete,
  isRefreshing,
  refreshHistory,
  showChart,
  setShowChart,
  dateRange,
  isDatePickerOpen,
  setIsDatePickerOpen,
  setDateRange
}: SearchHistoryToolbarProps) => {
  const activeCount = history.filter(item => !item.result_timestamp).length;
  const completedCount = history.filter(item => item.result_timestamp).length;

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;
    
    // حذف العناصر المحددة بشكل متسلسل
    for (const id of selectedItems) {
      await onDelete(id);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteSelected}
            disabled={selectedItems.size === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            حذف المحدد
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshHistory}
            disabled={isRefreshing}
          >
            <RotateCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          
          {selectedItems.size > 0 && (
            <div>
              <ShareButtonGroup 
                items={Array.from(selectedItems).map(id => 
                  history.find(item => item.id === id)
                ).filter(Boolean) as SearchHistoryItem[]} 
              />
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a href="/dashboard" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              الإحصائيات
            </a>
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Label htmlFor="show-chart" className="text-sm">عرض المخطط</Label>
            <Switch 
              id="show-chart" 
              checked={showChart} 
              onCheckedChange={setShowChart} 
            />
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Badge variant="outline" className="font-medium">
              <LineChart className="h-3 w-3 mr-1" />
              نشط: {activeCount}
            </Badge>
            
            <Badge variant="outline" className="font-medium">
              مكتمل: {completedCount}
            </Badge>
            
            <Badge variant="outline" className="font-medium">
              الإجمالي: {history.length}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
