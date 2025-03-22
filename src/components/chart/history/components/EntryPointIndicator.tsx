
import { formatNumber } from "../utils/cellUtils";

interface EntryPointIndicatorProps {
  price?: number | null;
  reason?: string;
}

export const EntryPointIndicator = ({ price, reason }: EntryPointIndicatorProps) => {
  // تسجيل القيم للتشخيص
  console.log(`EntryPointIndicator rendering with price=${price}, reason=${reason}`);
  
  // إذا لم يكن هناك سعر أو سبب، نعرض "غير متوفر"
  if ((price === undefined || price === null || isNaN(Number(price))) && !reason) {
    return <div className="text-center text-muted-foreground rounded-md bg-slate-50 dark:bg-slate-900/50 p-1.5">غير متوفر</div>;
  }
  
  return (
    <div className="space-y-1 p-1.5 text-center w-full rounded-md bg-slate-50 dark:bg-slate-900/50">
      <div className="text-sm font-medium text-primary">
        {formatNumber(price)}
      </div>
      {reason && (
        <div className="text-xs text-muted-foreground break-words max-w-56 mx-auto border-t pt-1 mt-1 border-slate-200 dark:border-slate-800">
          {reason}
        </div>
      )}
    </div>
  );
};
