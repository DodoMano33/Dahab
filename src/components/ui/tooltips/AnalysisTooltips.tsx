
import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface AnalysisTooltipProps {
  content: string;
  children: ReactNode;
}

export function AnalysisTooltip({ content, children }: AnalysisTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center cursor-help">
            {children}
            <InfoIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const analysisTypeTooltips = {
  "سكالبينج": "تحليل قصير المدى يركز على تداولات سريعة بأهداف صغيرة",
  "ذكي": "تحليل يعتمد على الذكاء الاصطناعي لدمج عدة أساليب تحليلية",
  "SMC": "تحليل هيكل السوق (Smart Money Concept) يركز على حركة المال الذكي",
  "ICT": "Inner Circle Trader - أسلوب تحليلي يركز على سلوك صناع السوق",
  "Turtle Soup": "استراتيجية تداول تستهدف الاختراقات الكاذبة",
  "Gann": "نظرية غان تعتمد على العلاقة بين السعر والزمن",
  "Waves": "تحليل موجات إليوت لتحديد اتجاهات السوق",
  "Patterns": "تحليل الأنماط الفنية على الشارت",
  "Price Action": "تحليل حركة السعر بدون مؤشرات",
  "فيبوناتشي": "استراتيجية تعتمد على مستويات فيبوناتشي ريتريسمينت وإكستينشين لتحديد نقاط الدخول والخروج",
  "تحليل فيبوناتشي متقدم": "تحليل متقدم يستخدم مستويات فيبوناتشي مع أدوات أخرى لاستنتاج نقاط انعكاس وتصحيح دقيقة",
  "شبكات عصبية": "استخدام الشبكات العصبية الاصطناعية لتحليل البيانات وتوقع حركة السعر",
  "شبكات عصبية متكررة": "شبكات عصبية متقدمة تستخدم للتنبؤ بالسلاسل الزمنية والأنماط المتكررة",
  "تصفيق زمني": "تحليل يعتمد على تكرار الأنماط الزمنية وتجمعات السعر في فترات زمنية محددة",
  "تباين متعدد العوامل": "تحليل يدرس العلاقة بين عدة متغيرات للتنبؤ بحركة السعر",
  "شمعات مركبة": "استراتيجية تحليل تجمع أنماط الشموع المتعددة لاستنتاج إشارات دخول وخروج أكثر دقة",
  "تحليل سلوكي": "تحليل سلوك المتداولين ونفسيتهم لتوقع تحركات السوق"
};

export const timeframeTooltips = {
  "1m": "إطار زمني قصير جداً (دقيقة) مناسب للسكالبينج",
  "5m": "إطار زمني قصير (5 دقائق) مناسب للتداول اليومي القصير",
  "30m": "إطار زمني متوسط قصير (30 دقيقة) للتداول اليومي",
  "1h": "إطار زمني متوسط (ساعة) مناسب للتداول اليومي والمتوسط",
  "4h": "إطار زمني متوسط-طويل (4 ساعات) للتداول المتوسط",
  "1d": "إطار زمني طويل (يوم) مناسب للتداول طويل المدى"
};
