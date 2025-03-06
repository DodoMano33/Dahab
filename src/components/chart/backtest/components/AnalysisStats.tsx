
import { Badge } from "@/components/ui/badge";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
import { AnalysisTooltip, analysisTypeTooltips } from "@/components/ui/tooltips/AnalysisTooltips";

interface AnalysisStatsProps {
  stats: Array<{
    type: string;
    success: number;
    fail: number;
  }>;
}

export const AnalysisStats = ({ stats }: AnalysisStatsProps) => {
  // حساب إجمالي النجاحات والفشل
  const totalSuccess = stats.reduce((acc, stat) => acc + stat.success, 0);
  const totalFail = stats.reduce((acc, stat) => acc + stat.fail, 0);

  // تحديد وجود معلومات تلميح لنوع التحليل
  const hasTooltip = (type: string) => {
    const displayName = getStrategyName(type);
    return Object.keys(analysisTypeTooltips).includes(displayName);
  };

  // الحصول على نص التلميح
  const getTooltipContent = (type: string) => {
    const displayName = getStrategyName(type);
    return analysisTypeTooltips[displayName] || `معلومات عن ${displayName}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const displayName = getStrategyName(stat.type);
          const tooltipContent = getTooltipContent(stat.type);
          return (
            <div
              key={stat.type}
              className="flex flex-col items-center text-center bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="text-sm font-medium mb-3">
                {hasTooltip(stat.type) ? (
                  <AnalysisTooltip content={tooltipContent}>
                    {displayName}
                  </AnalysisTooltip>
                ) : (
                  displayName
                )}
              </div>
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
          );
        })}
      </div>

      {/* المستطيل الجديد لإجمالي النتائج */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">إجمالي نتائج التحليلات</h3>
        </div>
        <div className="flex justify-center gap-8">
          <div className="flex flex-col items-center">
            <span className="text-green-600 font-bold text-2xl">{totalSuccess}</span>
            <span className="text-sm text-gray-600">عدد التحليلات الناجحة</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-red-600 font-bold text-2xl">{totalFail}</span>
            <span className="text-sm text-gray-600">عدد التحليلات الفاشلة</span>
          </div>
        </div>
      </div>
    </div>
  );
};
