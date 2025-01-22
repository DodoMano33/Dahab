export interface StopLossProps {
  value: number;
  isHit?: boolean;
}

export const StopLoss = ({ value, isHit = false }: StopLossProps) => {
  const formatNumber = (num: number) => {
    return Number(num).toFixed(3);
  };

  return (
    <div className={`font-medium ${isHit ? 'text-destructive' : ''}`}>
      {formatNumber(value)}
    </div>
  );
};