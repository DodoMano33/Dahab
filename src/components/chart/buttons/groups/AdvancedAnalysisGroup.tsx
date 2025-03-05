
import { Network, BarChart3, Clock, Calculator, CandlestickChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AdvancedAnalysisGroupProps {
  isAnalyzing: boolean;
  onNeuralNetworkClick: (e: React.MouseEvent) => void;
  onRNNClick: (e: React.MouseEvent) => void;
  onTimeClusteringClick: (e: React.MouseEvent) => void;
  onMultiVarianceClick: (e: React.MouseEvent) => void;
  onCompositeCandlestickClick: (e: React.MouseEvent) => void;
  onBehavioralClick: (e: React.MouseEvent) => void;
}

export const AdvancedAnalysisGroup = ({
  isAnalyzing,
  onNeuralNetworkClick,
  onRNNClick,
  onTimeClusteringClick,
  onMultiVarianceClick,
  onCompositeCandlestickClick,
  onBehavioralClick
}: AdvancedAnalysisGroupProps) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                disabled={isAnalyzing}
                onClick={onNeuralNetworkClick}
                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Network className="w-4 h-4" />
                <span className="whitespace-nowrap">تحليل الشبكات العصبية</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>تحليل متقدم باستخدام الشبكات العصبية للتنبؤ بحركة الأسعار المستقبلية</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                disabled={isAnalyzing}
                onClick={onRNNClick}
                className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Network className="w-4 h-4" />
                <span className="whitespace-nowrap">الشبكات العصبية المتكررة</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>تحليل متقدم باستخدام الشبكات العصبية المتكررة (RNN) للتعرف على الأنماط المعقدة</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                disabled={isAnalyzing}
                onClick={onTimeClusteringClick}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Clock className="w-4 h-4" />
                <span className="whitespace-nowrap">تحليل التصفيق الزمني</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>تحليل متقدم باستخدام تقنيات التصفيق الزمني لاكتشاف الأنماط الدورية والموسمية</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                disabled={isAnalyzing}
                onClick={onMultiVarianceClick}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calculator className="w-4 h-4" />
                <span className="whitespace-nowrap">تحليل التباين المتعدد</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>تحليل إحصائي متقدم يأخذ بالاعتبار العديد من المتغيرات المؤثرة على السعر</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                disabled={isAnalyzing}
                onClick={onCompositeCandlestickClick}
                className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <CandlestickChart className="w-4 h-4" />
                <span className="whitespace-nowrap">تحليل الشمعات المركبة</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>تحليل متقدم يجمع بين عدة شمعات لتكوين أنماط أكثر دقة وموثوقية</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                disabled={isAnalyzing}
                onClick={onBehavioralClick}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md text-white h-12 sm:h-10 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="whitespace-nowrap">التحليل السلوكي</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>تحليل يركز على سلوك المتداولين والعوامل النفسية المؤثرة على حركة السوق</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
};
