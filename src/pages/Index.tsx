import { ChartAnalyzer } from "@/components/ChartAnalyzer";
import { LiveTradingViewChart } from "@/components/chart/LiveTradingViewChart";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">محلل الشارت الذكي</h1>
        <div className="mb-8">
          <LiveTradingViewChart symbol="XAUUSD" timeframe="D" />
        </div>
        <ChartAnalyzer />
      </div>
    </div>
  );
};

export default Index;