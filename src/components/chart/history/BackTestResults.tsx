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
  return (
    <div className="w-full bg-blue-50/50 p-4 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Back Test Results</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {stats.map((stat) => (
          <div key={stat.type} className="flex flex-col items-center">
            <div className="text-sm font-semibold mb-2">{stat.type}</div>
            <div className="space-y-1 text-center">
              <div className="flex flex-col items-center">
                <span className={cn(
                  "text-sm font-medium px-2 py-0.5 rounded",
                  "bg-green-100 text-green-800"
                )}>
                  ناجح
                </span>
                <span className="text-lg font-bold text-green-600">
                  {stat.successCount}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className={cn(
                  "text-sm font-medium px-2 py-0.5 rounded",
                  "bg-red-100 text-red-800"
                )}>
                  فاشل
                </span>
                <span className="text-lg font-bold text-red-600">
                  {stat.failureCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};