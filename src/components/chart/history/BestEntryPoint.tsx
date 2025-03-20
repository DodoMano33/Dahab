
export interface BestEntryPointProps {
  price?: number | null;
  reason?: string;
}

export const BestEntryPoint = ({ price, reason }: BestEntryPointProps) => {
  const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null || isNaN(Number(num))) return "غير متوفر";
    return Number(num).toFixed(3);
  };

  // تسجيل القيم للتشخيص
  console.log(`BestEntryPoint rendering with price=${price}, reason=${reason}`);
  
  // إذا لم يكن هناك سعر أو سبب، نعرض "غير متوفر"
  if ((price === undefined || price === null || isNaN(Number(price))) && !reason) {
    return <div className="text-center text-muted-foreground">غير متوفر</div>;
  }
  
  return (
    <div className="space-y-1 text-center w-full">
      <div className="text-sm font-medium">
        {formatNumber(price)}
      </div>
      {reason && (
        <div className="text-xs text-muted-foreground break-words max-w-56 mx-auto">
          {reason}
        </div>
      )}
    </div>
  );
};
