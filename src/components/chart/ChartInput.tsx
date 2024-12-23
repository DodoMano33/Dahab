import { TradingViewSelector } from "../TradingViewSelector";

type AnalysisMode = 'upload' | 'tradingview';

interface ChartInputProps {
  mode: AnalysisMode;
  onTradingViewConfig: (symbol: string, timeframe: string, currentPrice?: number) => void;
  onHistoryClick: () => void;
  isAnalyzing: boolean;
}

export const ChartInput = ({ 
  onTradingViewConfig,
  onHistoryClick,
  isAnalyzing 
}: ChartInputProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-right">
        تحليل من TradingView
      </h2>
      
      <TradingViewSelector 
        onConfigSubmit={onTradingViewConfig}
        onHistoryClick={onHistoryClick}
        isLoading={isAnalyzing}
      />
    </div>
  );
};