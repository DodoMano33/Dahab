
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
      return <ArrowUp className="text-green-500 inline w-6 h-6" />;
    case "هابط":
      return <ArrowDown className="text-red-500 inline w-6 h-6" />;
    case "محايد":
    default:
      return <Minus className="text-gray-500 inline w-6 h-6" />;
  }
};
