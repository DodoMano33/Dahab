import { Button } from "@/components/ui/button";

type AnalysisMode = 'tradingview';

interface ChartModeSelectorProps {
  mode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
}

export const ChartModeSelector = ({ mode }: ChartModeSelectorProps) => {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <Button variant="default">
        تحليل من TradingView
      </Button>
    </div>
  );
};