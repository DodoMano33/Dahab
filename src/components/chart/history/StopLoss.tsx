
import { formatNumber } from "./utils/cellUtils";

export interface StopLossProps {
  value: number;
  isHit?: boolean;
}

export const StopLoss = ({ value, isHit = false }: StopLossProps) => {
  return (
    <div className={`font-medium ${isHit ? 'text-destructive' : ''}`}>
      {formatNumber(value)}
    </div>
  );
};
