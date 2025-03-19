
import { memo, useEffect } from "react";
import { useBackTest } from "@/components/hooks/useBackTest";
import { Server } from "lucide-react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useDiagnosticInfo } from "@/hooks/useDiagnosticInfo";
import { useCurrentPrice } from "@/hooks/useCurrentPrice";
import { useAnalysisErrors } from "@/hooks/useAnalysisErrors";
import { useTimeFormatting } from "@/hooks/useTimeFormatting";
import { ConnectionStatusDisplay } from "./components/ConnectionStatusDisplay";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { CheckButton } from "./components/CheckButton";
import { PriceDisplay } from "./components/PriceDisplay";
import { RetryIndicator } from "./components/RetryIndicator";
import { TimeInfo } from "./components/TimeInfo";

export const BacktestCheckButton = memo(() => {
  const { triggerManualCheck, isLoading, lastCheckTime, retryCount, cancelCurrentRequest } = useBackTest();
  const networkStatus = useNetworkStatus();
  const diagnosticInfo = useDiagnosticInfo();
  const { currentPrice, priceUpdateCount } = useCurrentPrice();
  const { hasNetworkError, errorDetails, resetErrors } = useAnalysisErrors();
  const { formattedTime, nextAutoCheck } = useTimeFormatting(lastCheckTime);

  // تنظيف أي طلبات عالقة عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      console.log('Cleaning up BacktestCheckButton');
      cancelCurrentRequest();
    };
  }, [cancelCurrentRequest]);

  const handleTriggerManualCheck = () => {
    if (isLoading) {
      console.log('Button is already in loading state, ignoring click');
      return;
    }
    
    console.log('Manual check triggered with current price:', currentPrice);
    
    // إعادة تعيين الأخطاء السابقة قبل بدء فحص جديد
    resetErrors();
    
    // تنفيذ الفحص اليدوي
    triggerManualCheck();
  };

  return (
    <div className={`flex justify-between items-center p-3 rounded-lg border ${hasNetworkError ? 'bg-red-50 border-red-200' : 'bg-muted/30'}`}>
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">فحص التحليلات</h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Server size={14} /> 
          حالة الاتصال: <ConnectionStatusDisplay networkStatus={networkStatus} />
        </div>
        
        <ErrorDisplay 
          hasNetworkError={hasNetworkError} 
          errorDetails={errorDetails}
          diagnosticInfo={diagnosticInfo}
          networkStatus={networkStatus}
        />
        
        <TimeInfo 
          formattedTime={formattedTime} 
          nextAutoCheck={nextAutoCheck}
          hasNetworkError={hasNetworkError}
        />
        
        <PriceDisplay 
          currentPrice={currentPrice} 
          priceUpdateCount={priceUpdateCount} 
        />
        
        <RetryIndicator retryCount={retryCount} />
      </div>
      
      <CheckButton 
        isLoading={isLoading} 
        networkStatus={networkStatus} 
        onClick={handleTriggerManualCheck} 
      />
    </div>
  );
});

BacktestCheckButton.displayName = 'BacktestCheckButton';
