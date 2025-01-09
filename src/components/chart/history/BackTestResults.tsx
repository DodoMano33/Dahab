import { cn } from "@/lib/utils";

interface AnalysisStats {
  type: string;
  successCount: number;
  failureCount: number;
}

interface BackTestResultsProps {
  stats: AnalysisStats[];
}

export const BackTestResults = ({ stats }: BackTestResultsProps) => {
  console.log("Rendering BackTest Results with stats:", stats);
  
  if (!stats || stats.length === 0) {
    return (
      <div className="w-full bg-blue-50/50 p-4 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-6 text-indigo-900">Back Test Results</h2>
        <p className="text-gray-600">لا توجد نتائج للعرض حالياً</p>
      </div>
    );
  }

  const analysisTypes = [
    'Scalping',
    'ICT',
    'Gann',
    'Patterns',
    'SMC',
    'Turtle Soup',
    'Waves',
    'Price Action'
  ];

  return (
    <div className="w-full bg-blue-50/50 p-4 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-900">Back Test Results</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {analysisTypes.map((type) => {
          const stat = stats.find(s => s.type === type) || { type, successCount: 0, failureCount: 0 };
          return (
            <div key={type} className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="text-sm font-semibold mb-2 text-gray-700">{type}</div>
              <div className="space-y-2 text-center w-full">
                <div className="flex flex-col items-center">
                  <span className={cn(
                    "text-sm font-medium w-full py-1 rounded-sm",
                    "bg-green-500 text-white"
                  )}>
                    ناجح
                  </span>
                  <span className="text-lg font-bold text-green-600 mt-1">
                    {stat.successCount}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className={cn(
                    "text-sm font-medium w-full py-1 rounded-sm",
                    "bg-red-500 text-white"
                  )}>
                    فاشل
                  </span>
                  <span className="text-lg font-bold text-red-600 mt-1">
                    {stat.failureCount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};