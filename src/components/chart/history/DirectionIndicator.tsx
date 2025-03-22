
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface DirectionIndicatorProps {
  direction: "صاعد" | "هابط" | "محايد" | "up" | "down" | "neutral";
}

export const DirectionIndicator = ({ direction }: DirectionIndicatorProps) => {
  // تحويل القيم باللغة الإنجليزية إلى قيم بالعربية
  const normalizedDirection = 
    direction === "up" ? "صاعد" :
    direction === "down" ? "هابط" :
    direction === "neutral" ? "محايد" : direction;
    
  // عرض السهم المناسب بناءً على الاتجاه
  switch (normalizedDirection) {
    case "صاعد":
      return (
        <div className="flex flex-col items-center justify-center gap-0.5 bg-green-50 rounded-md p-1 dark:bg-green-900/20">
          <ArrowUp className="text-green-600 dark:text-green-400 w-5 h-5" />
          <span className="text-[10px] font-medium text-green-700 dark:text-green-400">صاعد</span>
        </div>
      );
    case "هابط":
      return (
        <div className="flex flex-col items-center justify-center gap-0.5 bg-red-50 rounded-md p-1 dark:bg-red-900/20">
          <ArrowDown className="text-red-600 dark:text-red-400 w-5 h-5" />
          <span className="text-[10px] font-medium text-red-700 dark:text-red-400">هابط</span>
        </div>
      );
    case "محايد":
    default:
      return (
        <div className="flex flex-col items-center justify-center gap-0.5 bg-slate-50 rounded-md p-1 dark:bg-slate-800/50">
          <Minus className="text-slate-500 w-5 h-5" />
          <span className="text-[10px] font-medium text-slate-600">محايد</span>
        </div>
      );
  }
};
