interface BestEntryPointProps {
  price?: number;
  reason?: string;
}

export const BestEntryPoint = ({ price, reason }: BestEntryPointProps) => {
  if (!price) return <div className="text-center">غير متوفر</div>;
  
  return (
    <div className="space-y-1 text-center w-full">
      <div className="text-sm">السعر: {price}</div>
      {reason && (
        <div className="text-xs text-muted-foreground break-words">
          السبب: {reason}
        </div>
      )}
    </div>
  );
};