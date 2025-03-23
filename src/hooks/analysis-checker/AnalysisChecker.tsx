
import { memo } from "react";
import { BacktestCheckButton } from "../../components/chart/backtest/BacktestCheckButton";
import { ErrorBoundary } from "react-error-boundary";
import { useCurrentPrice } from "@/hooks/useCurrentPrice";

export const AnalysisChecker = memo(() => {
  const { currentPrice } = useCurrentPrice();
  
  return (
    <ErrorBoundary fallback={<div className="p-3 bg-red-50 border border-red-200 rounded">خطأ في فحص التحليلات</div>}>
      <div className="mb-4">
        <BacktestCheckButton />
        {currentPrice && (
          <div className="mt-2 text-xs text-muted-foreground">
            يتم حاليًا استخدام سعر الذهب الحقيقي من CFI: {currentPrice.toFixed(2)} USD
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
});

AnalysisChecker.displayName = "AnalysisChecker";
