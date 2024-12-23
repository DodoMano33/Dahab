import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface AnalysisResultProps {
  analysis: {
    pattern: string;
    direction: string;
    currentPrice: number;
    support: number;
    resistance: number;
    stopLoss: number;
    bestEntryPoint?: {
      price: number;
      reason: string;
      timing?: {
        optimal: Date;
        range: {
          start: Date;
          end: Date;
        };
      };
      volume?: {
        minimum: number;
        optimal: number;
        maximum: number;
      };
      indicators?: {
        rsi: number;
        macd: {
          macdLine: number;
          signalLine: number;
          histogram: number;
        };
        stochastic: {
          k: number;
          d: number;
        };
        adx: number;
        cci: number;
        mfi: number;
      };
    };
    targets?: {
      price: number;
      expectedTime: Date;
    }[];
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

  const formatIndicator = (value: number) => value.toFixed(2);

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
        {analysis.bestEntryPoint && (
          <div className="bg-gray-50 p-4 rounded-lg col-span-2">
            <h3 className="font-semibold text-gray-700 mb-2">أفضل نقطة دخول</h3>
            <div className="space-y-4">
              <div>
                <p className={cn(
                  "text-lg mb-2",
                  isPriceHigher(analysis.bestEntryPoint.price) ? "text-red-600" : "text-green-600"
                )}>
                  السعر المقترح: {analysis.bestEntryPoint.price}
                </p>
                {analysis.bestEntryPoint.timing && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600">
                      التوقيت الأمثل: {format(analysis.bestEntryPoint.timing.optimal, 'PPpp', { locale: ar })}
                    </p>
                    <p className="text-sm text-gray-600">
                      النطاق الزمني: {format(analysis.bestEntryPoint.timing.range.start, 'pp', { locale: ar })} - {format(analysis.bestEntryPoint.timing.range.end, 'pp', { locale: ar })}
                    </p>
                  </div>
                )}
              </div>

              {analysis.bestEntryPoint.indicators && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2">RSI</h4>
                    <p className={cn(
                      "text-lg",
                      analysis.bestEntryPoint.indicators.rsi < 30 ? "text-green-600" : 
                      analysis.bestEntryPoint.indicators.rsi > 70 ? "text-red-600" : "text-gray-600"
                    )}>
                      {formatIndicator(analysis.bestEntryPoint.indicators.rsi)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2">MACD</h4>
                    <div className="space-y-1">
                      <p className="text-sm">خط MACD: {formatIndicator(analysis.bestEntryPoint.indicators.macd.macdLine)}</p>
                      <p className="text-sm">خط الإشارة: {formatIndicator(analysis.bestEntryPoint.indicators.macd.signalLine)}</p>
                      <p className={cn(
                        "text-sm",
                        analysis.bestEntryPoint.indicators.macd.histogram > 0 ? "text-green-600" : "text-red-600"
                      )}>
                        الهيستوجرام: {formatIndicator(analysis.bestEntryPoint.indicators.macd.histogram)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2">Stochastic</h4>
                    <div className="space-y-1">
                      <p className="text-sm">%K: {formatIndicator(analysis.bestEntryPoint.indicators.stochastic.k)}</p>
                      <p className="text-sm">%D: {formatIndicator(analysis.bestEntryPoint.indicators.stochastic.d)}</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2">ADX</h4>
                    <p className={cn(
                      "text-lg",
                      analysis.bestEntryPoint.indicators.adx > 25 ? "text-green-600" : "text-gray-600"
                    )}>
                      {formatIndicator(analysis.bestEntryPoint.indicators.adx)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2">CCI</h4>
                    <p className={cn(
                      "text-lg",
                      analysis.bestEntryPoint.indicators.cci > 100 ? "text-red-600" :
                      analysis.bestEntryPoint.indicators.cci < -100 ? "text-green-600" : "text-gray-600"
                    )}>
                      {formatIndicator(analysis.bestEntryPoint.indicators.cci)}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-2">MFI</h4>
                    <p className={cn(
                      "text-lg",
                      analysis.bestEntryPoint.indicators.mfi > 80 ? "text-red-600" :
                      analysis.bestEntryPoint.indicators.mfi < 20 ? "text-green-600" : "text-gray-600"
                    )}>
                      {formatIndicator(analysis.bestEntryPoint.indicators.mfi)}
                    </p>
                  </div>
                </div>
              )}

              {analysis.bestEntryPoint.volume && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">توصيات حجم التداول</h4>
                  <div className="space-y-2">
                    <p className="text-sm">الحجم الأدنى: {analysis.bestEntryPoint.volume.minimum.toFixed(0)}</p>
                    <p className="text-sm font-semibold">الحجم الأمثل: {analysis.bestEntryPoint.volume.optimal.toFixed(0)}</p>
                    <p className="text-sm">الحجم الأقصى: {analysis.bestEntryPoint.volume.maximum.toFixed(0)}</p>
                  </div>
                </div>
              )}

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">تحليل نقطة الدخول:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {analysis.bestEntryPoint.reason.split('|').map((reason, index) => (
                    <li key={index} className="text-sm">
                      {reason.trim()}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">نصائح إضافية:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
                  <li>تأكد من وجود حجم تداول كافٍ عند نقطة الدخول (الحد الأدنى: {analysis.bestEntryPoint.volume?.minimum.toFixed(0) || 'غير محدد'})</li>
                  <li>انتظر تأكيد الاتجاه قبل الدخول في الصفقة</li>
                  <li>راقب المؤشرات الفنية الإضافية مثل RSI و MACD</li>
                  <li>ضع أمر وقف الخسارة مباشرة بعد الدخول</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      {analysis.targets && analysis.targets.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">الأهداف المتوقعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {analysis.targets.map((target, index) => (
              <div key={index} className="bg-white p-4 rounded border border-gray-200">
                <p className={cn(
                  "text-lg mb-2",
                  isPriceHigher(target.price) ? "text-red-600" : "text-green-600"
                )}>
                  الهدف {index + 1}: {target.price}
                </p>
                <p className="text-sm text-gray-600">
                  التوقيت المتوقع: {format(target.expectedTime, 'PPpp', { locale: ar })}
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
