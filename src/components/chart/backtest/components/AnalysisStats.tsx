
import { Badge } from "@/components/ui/badge";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";
import { AnalysisTooltip, analysisTypeTooltips } from "@/components/ui/tooltips/AnalysisTooltips";

interface AnalysisStatsProps {
  stats: Array<{
    type: string;
    success: number;
    fail: number;
    display_name?: string;
  }>;
}

export const AnalysisStats = ({ stats }: AnalysisStatsProps) => {
  // حساب إجمالي النجاحات والفشل
  const totalSuccess = stats.reduce((acc, stat) => acc + stat.success, 0);
  const totalFail = stats.reduce((acc, stat) => acc + stat.fail, 0);

  // تحديد وجود معلومات تلميح لنوع التحليل
  const hasTooltip = (type: string, displayName: string) => {
    return Object.keys(analysisTypeTooltips).includes(displayName);
  };

  // الحصول على نص التلميح
  const getTooltipContent = (type: string, displayName: string) => {
    return analysisTypeTooltips[displayName] || `معلومات عن ${displayName}`;
  };
  
  // تقسيم الإحصائيات إلى سطرين (9 أنواع في كل سطر)
  const firstRowStats = stats.slice(0, Math.ceil(stats.length / 2));
  const secondRowStats = stats.slice(Math.ceil(stats.length / 2));
  
  // طباعة أنواع التحليل المتاحة للتشخيص
  console.log("Analysis Stats - Available types:", stats.map(s => 
    `${s.type} -> ${s.display_name || getStrategyName(s.type)}`
  ));
  console.log("Analysis Stats - Total types:", stats.length);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* السطر الأول من أنواع التحليل */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-3">
          {firstRowStats.map((stat) => {
            const displayName = stat.display_name || getStrategyName(stat.type);
            const tooltipContent = getTooltipContent(stat.type, displayName);
            
            return (
              <div
                key={stat.type}
                className="flex flex-col items-center text-center bg-white p-3 rounded-lg shadow-sm"
              >
                <div className="text-sm font-medium mb-2 h-10 flex items-center">
                  {hasTooltip(stat.type, displayName) ? (
                    <AnalysisTooltip content={tooltipContent}>
                      {displayName}
                    </AnalysisTooltip>
                  ) : (
                    displayName
                  )}
                </div>
                <div className="flex gap-1">
                  <Badge variant="success" className="flex flex-col items-center p-1">
                    <span className="text-xs">ناجح</span>
                    <span className="text-base font-bold">{stat.success}</span>
                  </Badge>
                  <Badge variant="destructive" className="flex flex-col items-center p-1">
                    <span className="text-xs">فاشل</span>
                    <span className="text-base font-bold">{stat.fail}</span>
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* السطر الثاني من أنواع التحليل */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-3">
          {secondRowStats.map((stat) => {
            const displayName = stat.display_name || getStrategyName(stat.type);
            const tooltipContent = getTooltipContent(stat.type, displayName);
            
            return (
              <div
                key={stat.type}
                className="flex flex-col items-center text-center bg-white p-3 rounded-lg shadow-sm"
              >
                <div className="text-sm font-medium mb-2 h-10 flex items-center">
                  {hasTooltip(stat.type, displayName) ? (
                    <AnalysisTooltip content={tooltipContent}>
                      {displayName}
                    </AnalysisTooltip>
                  ) : (
                    displayName
                  )}
                </div>
                <div className="flex gap-1">
                  <Badge variant="success" className="flex flex-col items-center p-1">
                    <span className="text-xs">ناجح</span>
                    <span className="text-base font-bold">{stat.success}</span>
                  </Badge>
                  <Badge variant="destructive" className="flex flex-col items-center p-1">
                    <span className="text-xs">فاشل</span>
                    <span className="text-base font-bold">{stat.fail}</span>
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
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
