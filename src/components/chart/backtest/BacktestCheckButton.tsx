
import { memo } from "react";
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
import { usePriceReader } from "@/hooks/usePriceReader";

export const BacktestCheckButton = memo(() => {
  const { triggerManualCheck, isLoading, lastCheckTime, retryCount, diagnostics } = useBackTest();
  const networkStatus = useNetworkStatus();
  const diagnosticInfo = useDiagnosticInfo();
  const { currentPrice: apiPrice, priceUpdateCount: apiUpdateCount } = useCurrentPrice();
  const { price: screenPrice } = usePriceReader(1000);
  const { hasNetworkError, errorDetails, resetErrors } = useAnalysisErrors();
  const { formattedTime, nextAutoCheck } = useTimeFormatting(lastCheckTime);

  // استخدم سعر الشاشة إذا كان متاحًا، وإلا استخدم السعر من API
  const displayPrice = screenPrice !== null ? screenPrice : apiPrice;
  const priceUpdateCount = screenPrice !== null ? 
    apiUpdateCount + 1 : // زيادة عداد التحديثات للإشارة إلى وجود مصدر إضافي
    apiUpdateCount;

  const handleTriggerManualCheck = () => {
    console.log('Manual check triggered with current price:', displayPrice);
    triggerManualCheck();
    resetErrors();
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
          currentPrice: displayPrice,
          priceUpdateCount,
          diagnostics,
          priceSource: screenPrice !== null ? "قارئ الشاشة" : "API"
        }}
      />
      
      <TimeInfo 
        formattedTime={formattedTime} 
        nextAutoCheck={nextAutoCheck}
        hasNetworkError={hasNetworkError}
      />
      
      <PriceDisplay 
        currentPrice={displayPrice} 
        priceUpdateCount={priceUpdateCount} 
      />
    </div>
  );
});

BacktestCheckButton.displayName = 'BacktestCheckButton';
