import { Button } from "@/components/ui/button";

type AnalysisMode = 'upload' | 'tradingview';

interface ChartModeSelectorProps {
  mode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
}

export const ChartModeSelector = ({ mode, onModeChange }: ChartModeSelectorProps) => {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <Button
        variant={mode === 'upload' ? "default" : "outline"}
        onClick={() => onModeChange('upload')}
      >
        تحليل صورة
      </Button>
      <Button
        variant={mode === 'tradingview' ? "default" : "outline"}
        onClick={() => onModeChange('tradingview')}
      >
        تحليل من TradingView
      </Button>
    </div>
  );
};