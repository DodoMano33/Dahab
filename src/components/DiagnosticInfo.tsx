
import { Button } from "@/components/ui/button";
import { Server, RefreshCw, WifiOff } from "lucide-react";
import { toast } from "sonner";

type DiagnosticProps = {
  networkStatus: 'online' | 'offline' | 'limited';
  retryCount: number;
  onRetry: () => void;
  diagnosticInfo: any;
};

export const DiagnosticInfo = ({ 
  networkStatus, 
  retryCount, 
  onRetry,
  diagnosticInfo
}: DiagnosticProps) => {
  return (
    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            حالة الاتصال: {networkStatus === 'online' ? 'متصل' : networkStatus === 'limited' ? 'محدود' : 'غير متصل'}
          </span>
        </div>
        
        {networkStatus !== 'online' && (
          <WifiOff size={16} className="text-red-500" />
        )}
      </div>

      {retryCount > 0 && (
        <div className="flex items-center gap-2 text-yellow-600">
          <RefreshCw size={16} className="animate-spin" />
          <span className="text-sm">
            محاولة إعادة الاتصال ({retryCount})...
          </span>
        </div>
      )}

      <Button 
        variant="outline" 
        size="sm"
        className="w-full mt-2"
        onClick={() => {
          toast.info('جاري محاولة إعادة الاتصال...');
          onRetry();
        }}
      >
        إعادة المحاولة
      </Button>

      <button
        className="text-xs text-blue-600 hover:underline mt-2 cursor-pointer w-full text-right"
        onClick={() => {
          toast.info('معلومات تشخيصية', {
            description: Object.entries(diagnosticInfo)
              .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
              .join('\n')
          });
        }}
      >
        عرض معلومات تشخيصية
      </button>
    </div>
  );
};
