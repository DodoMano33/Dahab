
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface DirectionIndicatorProps {
  direction: "صاعد" | "هابط" | "محايد" | "Up" | "Down" | "Neutral";
}

export const DirectionIndicator = ({ direction }: DirectionIndicatorProps) => {
  // Handle both Arabic and English direction values
  if (direction === "صاعد" || direction === "Up") {
    return <ArrowUp className="text-green-500 inline w-6 h-6" />;
  } else if (direction === "هابط" || direction === "Down") {
    return <ArrowDown className="text-red-500 inline w-6 h-6" />;
  } else {
    return <Minus className="text-gray-500 inline w-6 h-6" />;
  }
};
