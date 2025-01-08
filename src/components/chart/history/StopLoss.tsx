interface StopLossProps {
  value: number;
  isHit: boolean;
}

export const StopLoss = ({ value, isHit }: StopLossProps) => (
  <div className={`relative ${isHit ? 'text-red-600 font-semibold' : ''}`}>
    {value}
    {isHit && (
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-red-500 rounded-sm" />
    )}
  </div>
);