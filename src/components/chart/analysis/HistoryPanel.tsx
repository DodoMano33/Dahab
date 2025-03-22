import { Button } from "@/components/ui/button";
import { SearchHistoryItem } from "@/types/analysis";
import { useNavigate } from "react-router-dom";
import { List, History, BarChart, Clock } from "lucide-react";
import { toast } from "sonner";

interface HistoryPanelProps {
  analysisCount: number;
  isRefreshing?: boolean;
  setIsHistoryOpen?: (open: boolean) => void;
  onManualCheck?: () => Promise<void>;
  isCheckLoading?: boolean;
  lastCheckTime?: Date | null;
}

export const HistoryPanel = ({
  analysisCount,
  isRefreshing = false,
  setIsHistoryOpen,
  onManualCheck,
  isCheckLoading = false,
  lastCheckTime,
}: HistoryPanelProps) => {
  const navigate = useNavigate();

  const handleOpenDashboard = () => {
    navigate("/dashboard");
  };

  const handleOpenHistory = () => {
    if (setIsHistoryOpen) {
      setIsHistoryOpen(true);
    }
  };

  const handleManualCheck = async (id: string = '') => {
    if (onManualCheck) {
      try {
        await onManualCheck();
        return Promise.resolve();
      } catch (error) {
        console.error("Error in manual check:", error);
        toast.error("حدث خطأ أثناء الفحص اليدوي");
        return Promise.reject(error);
      }
    }
    return Promise.resolve();
  };

  return (
    <div className="flex flex-col gap-2">
      <Button 
        variant="outline" 
        onClick={handleOpenHistory}
        className="w-full justify-start"
      >
        <History className="h-4 w-4 mr-2" />
        سجل التحليلات
        {analysisCount > 0 && (
          <span className="ml-auto bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
            {analysisCount}
          </span>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleOpenDashboard}
        className="w-full justify-start"
      >
        <List className="h-4 w-4 mr-2" />
        لوحة الإحصائيات
      </Button>
      
      {onManualCheck && (
        <Button 
          variant="outline" 
          onClick={() => handleManualCheck()}
          disabled={isCheckLoading}
          className="w-full justify-start"
        >
          {isCheckLoading ? (
            <Clock className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <History className="h-4 w-4 mr-2" />
          )}
          فحص التحليلات
          {lastCheckTime && (
            <span className="ml-auto text-muted-foreground text-xs">
              {new Date(lastCheckTime).toLocaleTimeString()}
            </span>
          )}
        </Button>
      )}
    </div>
  );
};
