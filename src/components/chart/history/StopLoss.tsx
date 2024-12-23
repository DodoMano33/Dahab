interface StopLossProps {
  value: number;
  isHit: boolean;
}

export const StopLoss = ({ value, isHit }: StopLossProps) => (
  <div className={`relative ${isHit ? 'pb-4' : ''}`}>
    {value}
    {isHit && (
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-red-500 rounded-sm" />
    )}
  </div>
);