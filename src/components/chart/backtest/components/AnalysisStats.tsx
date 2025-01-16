import { Badge } from "@/components/ui/badge";

interface AnalysisStatsProps {
  stats: Array<{
    type: string;
    success: number;
    fail: number;
  }>;
}

export const AnalysisStats = ({ stats }: AnalysisStatsProps) => {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.type}
          className="flex flex-col items-center text-center bg-white p-4 rounded-lg shadow-sm"
        >
          <div className="text-sm font-medium mb-3">{stat.type}</div>
          <div className="flex gap-2">
            <Badge variant="success" className="flex flex-col items-center p-2">
              <span>ناجح</span>
              <span className="text-lg font-bold">{stat.success}</span>
            </Badge>
            <Badge variant="destructive" className="flex flex-col items-center p-2">
              <span>فاشل</span>
              <span className="text-lg font-bold">{stat.fail}</span>
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};