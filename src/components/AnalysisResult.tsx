import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisResultProps {
  analysis: {
    pattern: string;
    direction: string;
    currentPrice: number;
    support: number;
    resistance: number;
    stopLoss: number;
    targets?: number[];
    fibonacciLevels?: {
      level: number;
      price: number;
    }[];
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

  const isPriceHigher = (price: number) => price > analysis.currentPrice;

  return (
    <div className="space-y-4 text-right">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">النموذج المكتشف</h3>
          <p className="text-lg">{analysis.pattern}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">الاتجاه المتوقع</h3>
          <p className={cn(
            "text-lg",
            analysis.direction === "صاعد" ? "text-green-600" : "text-red-600"
          )}>
            {analysis.direction}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">السعر الحالي</h3>
          <p className="text-lg font-bold">{analysis.currentPrice}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">مستوى الدعم</h3>
          <p className={cn(
            "text-lg",
            isPriceHigher(analysis.support) ? "text-red-600" : "text-green-600"
          )}>
            {analysis.support}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">مستوى المقاومة</h3>
          <p className={cn(
            "text-lg",
            isPriceHigher(analysis.resistance) ? "text-red-600" : "text-green-600"
          )}>
            {analysis.resistance}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">نقطة وقف الخسارة</h3>
          <p className={cn(
            "text-lg",
            isPriceHigher(analysis.stopLoss) ? "text-red-600" : "text-green-600"
          )}>
            {analysis.stopLoss}
          </p>
        </div>
      </div>
      
      {analysis.targets && analysis.targets.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">الأهداف المتوقعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {analysis.targets.map((target, index) => (
              <div key={index} className="bg-white p-2 rounded border border-gray-200">
                <p className={cn(
                  "text-lg",
                  isPriceHigher(target) ? "text-red-600" : "text-green-600"
                )}>
                  الهدف {index + 1}: {target}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.fibonacciLevels && analysis.fibonacciLevels.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">مستويات فيبوناتشي</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {analysis.fibonacciLevels.map((level, index) => (
              <div key={index} className="bg-white p-2 rounded border border-gray-200">
                <p className={cn(
                  "text-lg",
                  isPriceHigher(level.price) ? "text-red-600" : "text-green-600"
                )}>
                  {level.level * 100}%: {level.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};