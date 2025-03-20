
export interface BestEntryPointProps {
  price?: number;
  reason?: string;
}

export const BestEntryPoint = ({ price, reason }: BestEntryPointProps) => {
  const formatNumber = (num: number | undefined) => {
    if (num === undefined || isNaN(num)) return "غير متوفر";
    return Number(num).toFixed(3);
  };
  
  if (price === undefined || price === null || isNaN(Number(price))) {
    return <div className="text-center text-muted-foreground">غير متوفر</div>;
  }
  
  return (
    <div className="space-y-1 text-center w-full">
      <div className="text-sm font-medium">السعر: {formatNumber(price)}</div>
      {reason && (
        <div className="text-xs text-muted-foreground break-words max-w-56 mx-auto">
          {reason}
        </div>
      )}
    </div>
  );
};
