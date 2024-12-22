import { Loader2 } from "lucide-react";

interface AnalysisResultProps {
  analysis: {
    pattern: string;
    direction: string;
    support: number;
    resistance: number;
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
      </div>
    </div>
  );
};