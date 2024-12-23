import { ArrowUp, ArrowDown } from "lucide-react";

interface DirectionIndicatorProps {
  direction: "صاعد" | "هابط";
}

export const DirectionIndicator = ({ direction }: DirectionIndicatorProps) => {
  if (direction === "صاعد") {
    return <ArrowUp className="text-green-500 inline w-6 h-6" />;
  }
  return <ArrowDown className="text-red-500 inline w-6 h-6" />;
};