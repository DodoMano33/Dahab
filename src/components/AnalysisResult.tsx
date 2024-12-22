import { Loader2 } from "lucide-react";

interface AnalysisResultProps {
  analysis: {
    pattern: string;
    direction: string;
    support: number;
    resistance: number;
    stopLoss: number;
    targets?: number[];
  };
  isLoading: boolean;
}

export const AnalysisResult = ({ analysis, isLoading }: AnalysisResultProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 text-right">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">النموذج المكتشف</h3>
          <p className="text-lg">{analysis.pattern}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">الاتجاه المتوقع</h3>
          <p className="text-lg">{analysis.direction}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">مستوى الدعم</h3>
          <p className="text-lg">{analysis.support}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">مستوى المقاومة</h3>
          <p className="text-lg">{analysis.resistance}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg col-span-2">
          <h3 className="font-semibold text-gray-700 mb-2">نقطة وقف الخسارة</h3>
          <p className="text-lg">{analysis.stopLoss}</p>
        </div>
      </div>
      
      {analysis.targets && analysis.targets.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">الأهداف المتوقعة</h3>
          <div className="grid grid-cols-2 gap-2">
            {analysis.targets.map((target, index) => (
              <div key={index} className="bg-white p-2 rounded border border-gray-200">
                <p className="text-lg">الهدف {index + 1}: {target}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};