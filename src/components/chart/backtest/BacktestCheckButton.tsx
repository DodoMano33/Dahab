
import { memo, useEffect, useState } from "react";
import { useBackTest } from "@/components/hooks/useBackTest";
import { Server } from "lucide-react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useDiagnosticInfo } from "@/hooks/useDiagnosticInfo";
import { useCurrentPrice } from "@/hooks/useCurrentPrice";
import { useAnalysisErrors } from "@/hooks/useAnalysisErrors";
import { useTimeFormatting } from "@/hooks/useTimeFormatting";
import { DiagnosticInfo } from "@/components/DiagnosticInfo";
import { TimeInfo } from "./components/TimeInfo";
import { PriceDisplay } from "./components/PriceDisplay";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { toast } from "sonner";

export const BacktestCheckButton = memo(() => {
  const { triggerManualCheck, isLoading, lastCheckTime, retryCount, diagnostics } = useBackTest();
  const networkStatus = useNetworkStatus();
  const diagnosticInfo = useDiagnosticInfo();
  const { currentPrice, priceUpdateCount, priceSource } = useCurrentPrice();
  const { hasNetworkError, errorDetails, resetErrors } = useAnalysisErrors();
  const { formattedTime, nextAutoCheck } = useTimeFormatting(lastCheckTime);
  const [lastPriceUpdateTime, setLastPriceUpdateTime] = useState<Date | null>(null);

  // استماع إلى أحداث تحديث السعر
  useEffect(() => {
    if (currentPrice !== null) {
      setLastPriceUpdateTime(new Date());
    }
  }, [currentPrice]);

  const handleTriggerManualCheck = () => {
    if (!currentPrice) {
      toast.warning('يرجى الانتظار حتى يتم الحصول على السعر الحالي');
      // محاولة طلب السعر مرة أخرى
      window.dispatchEvent(new Event('request-current-price'));
      return;
    }
    
    console.log('Manual check triggered with current price:', currentPrice);
    resetErrors();
    triggerManualCheck();
  };

  return (
    <div className={`flex flex-col p-3 rounded-lg border ${hasNetworkError ? 'bg-red-50 border-red-200' : 'bg-muted/30'}`}>
      <h3 className="text-lg font-medium mb-3">فحص التحليلات</h3>
      
      <DiagnosticInfo 
        networkStatus={networkStatus}
        retryCount={retryCount}
        onRetry={handleTriggerManualCheck}
        diagnosticInfo={{
          ...diagnosticInfo,
          lastError: errorDetails,
          priceUpdateCount,
          diagnostics
        }}
        currentPrice={currentPrice}
        priceSource={priceSource}
        lastUpdated={lastPriceUpdateTime}
      />
      
      <TimeInfo 
        formattedTime={formattedTime} 
        nextAutoCheck={nextAutoCheck}
        hasNetworkError={hasNetworkError}
      />
      
      <PriceDisplay 
        currentPrice={currentPrice} 
        priceUpdateCount={priceUpdateCount} 
        priceSource={priceSource}
      />
      
      <ErrorDisplay 
        hasNetworkError={hasNetworkError} 
        errorDetails={errorDetails}
        diagnosticInfo={{
          currentPrice,
          priceUpdateCount,
          networkStatus,
          lastCheckTime: lastCheckTime?.toISOString()
        }}
        networkStatus={networkStatus}
      />
    </div>
  );
});

BacktestCheckButton.displayName = 'BacktestCheckButton';
