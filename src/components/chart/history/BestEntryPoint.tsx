
export interface BestEntryPointProps {
  price?: number;
  reason?: string;
}

export const BestEntryPoint = ({ price, reason }: BestEntryPointProps) => {
  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return "غير متوفر";
    return Number(num).toFixed(3);
  };
  
  if (!price) return <div className="text-center">غير متوفر</div>;
  
  return (
    <div className="space-y-1 text-center w-full">
      <div className="text-sm">السعر: {formatNumber(price)}</div>
      {reason && (
        <div className="text-xs text-muted-foreground break-words">
          السبب: {reason}
        </div>
      )}
    </div>
  );
};
