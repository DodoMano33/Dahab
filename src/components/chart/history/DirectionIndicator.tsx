
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface DirectionIndicatorProps {
  direction: "Bullish" | "Bearish" | "Neutral" | "صاعد" | "هابط" | "محايد";
}

export const DirectionIndicator = ({ direction }: DirectionIndicatorProps) => {
  switch (direction) {
    case "Bullish":
    case "صاعد":
      return <ArrowUp className="text-green-500 inline w-6 h-6" />;
    case "Bearish":
    case "هابط":
      return <ArrowDown className="text-red-500 inline w-6 h-6" />;
    case "Neutral":
    case "محايد":
      return <Minus className="text-gray-500 inline w-6 h-6" />;
    default:
      return <Minus className="text-gray-500 inline w-6 h-6" />;
  }
};
