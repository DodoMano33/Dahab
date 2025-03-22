
import { formatNumber } from "./utils/cellUtils";

interface Target {
  price: number;
  expectedTime: Date;
}

export interface TargetsListProps {
  targets: Target[];
  isTargetHit: boolean;
}

export const TargetsList = ({ targets, isTargetHit }: TargetsListProps) => {
  // طباعة تشخيصية للأهداف
  console.log("TargetsList received targets:", targets);
  
  if (!targets || !Array.isArray(targets) || targets.length === 0) {
    console.log("TargetsList: No valid targets");
    return (
      <div className="text-center text-muted-foreground text-sm rounded-md bg-slate-50 dark:bg-slate-900/50 p-1.5">
        لا توجد أهداف
      </div>
    );
  }
  
  // التحقق من صحة بيانات الأهداف
  const validTargets = targets.filter(target => 
    target && 
    typeof target.price !== 'undefined' && 
    !isNaN(Number(target.price))
  );
  
  console.log("TargetsList valid targets:", validTargets);
  
  if (validTargets.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm rounded-md bg-slate-50 dark:bg-slate-900/50 p-1.5">
        لا توجد أهداف صالحة
      </div>
    );
  }
  
  return (
    <div className="space-y-1.5 text-center w-full rounded-md bg-slate-50 dark:bg-slate-900/50 p-1.5">
      {validTargets.map((target, idx) => (
        <div 
          key={idx}
          className={`relative ${isTargetHit && idx === 0 ? 'text-green-600 font-semibold' : ''} ${idx > 0 ? 'border-t border-slate-200 dark:border-slate-800 pt-1 mt-1' : ''}`}
        >
          <span className="text-xs text-muted-foreground">الهدف {idx + 1}:</span>{' '}
          <span className="font-medium">{formatNumber(target.price)}</span>
          {isTargetHit && idx === 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
};
