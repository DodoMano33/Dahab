
import { memo } from "react";
import { useBackTest } from "@/components/hooks/useBackTest";
import { Server } from "lucide-react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useDiagnosticInfo } from "@/hooks/useDiagnosticInfo";
import { useAnalysisErrors } from "@/hooks/useAnalysisErrors";
import { useTimeFormatting } from "@/hooks/useTimeFormatting";
import { DiagnosticInfo } from "@/components/DiagnosticInfo";
import { TimeInfo } from "./components/TimeInfo";

export const BacktestCheckButton = memo(() => {
  const { triggerManualCheck, isLoading, lastCheckTime, retryCount, diagnostics } = useBackTest();
  const networkStatus = useNetworkStatus();
  const diagnosticInfo = useDiagnosticInfo();
  const { hasNetworkError, errorDetails, resetErrors } = useAnalysisErrors();
  const { formattedTime, nextAutoCheck } = useTimeFormatting(lastCheckTime);

  const handleTriggerManualCheck = () => {
    console.log('Manual check triggered with fixed price value');
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
          currentPrice: 100, // قيمة ثابتة
          priceUpdateCount: 0,
          diagnostics
        }}
      />
      
      <TimeInfo 
        formattedTime={formattedTime} 
        nextAutoCheck={nextAutoCheck}
        hasNetworkError={hasNetworkError}
      />
    </div>
  );
});

BacktestCheckButton.displayName = 'BacktestCheckButton';
