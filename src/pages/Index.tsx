import { ChartAnalyzer } from "@/components/ChartAnalyzer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">محلل الشارت الذكي</h1>
        <ChartAnalyzer />
      </div>
    </div>
  );
};

export default Index;