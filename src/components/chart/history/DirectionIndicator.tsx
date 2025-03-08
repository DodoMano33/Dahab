
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface DirectionIndicatorProps {
  direction: "Up" | "Down" | "Neutral";
}

export const DirectionIndicator = ({ direction }: DirectionIndicatorProps) => {
  switch (direction) {
    case "Up":
      return <ArrowUp className="text-green-500 inline w-6 h-6" />;
    case "Down":
      return <ArrowDown className="text-red-500 inline w-6 h-6" />;
    case "Neutral":
      return <Minus className="text-gray-500 inline w-6 h-6" />;
  }
};
