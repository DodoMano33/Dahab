
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
  // Calculate total successes and failures
  const totalSuccess = stats.reduce((acc, stat) => acc + stat.success, 0);
  const totalFail = stats.reduce((acc, stat) => acc + stat.fail, 0);

  // Determine if tooltip information exists for analysis type
  const hasTooltip = (type: string, displayName: string) => {
    return Object.keys(analysisTypeTooltips).includes(displayName);
  };

  // Get tooltip content
  const getTooltipContent = (type: string, displayName: string) => {
    return analysisTypeTooltips[displayName] || `Information about ${displayName}`;
  };
  
  // Log analysis types for debugging
  console.log("Analysis Stats - Available types:", stats.map(s => 
    `${s.type} -> ${s.display_name || getStrategyName(s.type)}`
  ));
  console.log("Analysis Stats - Total types:", stats.length);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const displayName = stat.display_name || getStrategyName(stat.type);
          const tooltipContent = getTooltipContent(stat.type, displayName);
          
          // Diagnostic print for each analysis type
          console.log(`Rendering stats for type: ${stat.type} -> ${displayName}`);
          
          return (
            <div
              key={stat.type}
              className="flex flex-col items-center text-center bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="text-sm font-medium mb-3">
                {hasTooltip(stat.type, displayName) ? (
                  <AnalysisTooltip content={tooltipContent}>
                    {displayName}
                  </AnalysisTooltip>
                ) : (
                  displayName
                )}
              </div>
              <div className="flex gap-2">
                <Badge variant="success" className="flex flex-col items-center p-2">
                  <span>Success</span>
                  <span className="text-lg font-bold">{stat.success}</span>
                </Badge>
                <Badge variant="destructive" className="flex flex-col items-center p-2">
                  <span>Failure</span>
                  <span className="text-lg font-bold">{stat.fail}</span>
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      {/* Results summary block */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Total Analysis Results</h3>
        </div>
        <div className="flex justify-center gap-8">
          <div className="flex flex-col items-center">
            <span className="text-green-600 font-bold text-2xl">{totalSuccess}</span>
            <span className="text-sm text-gray-600">Successful Analyses</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-red-600 font-bold text-2xl">{totalFail}</span>
            <span className="text-sm text-gray-600">Failed Analyses</span>
          </div>
        </div>
      </div>
    </div>
  );
};
