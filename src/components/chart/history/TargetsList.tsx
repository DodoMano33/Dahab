
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
  
  // التحقق من صحة بيانات الأهداف
  const validTargets = Array.isArray(targets) ? targets.filter(target => 
    target && typeof target.price === 'number' && !isNaN(target.price)
  ) : [];
  
  console.log("TargetsList valid targets:", validTargets);
  
  return (
    <div className="space-y-2 text-center w-full">
      {validTargets.length > 0 ? (
        validTargets.map((target, idx) => (
          <div 
            key={idx}
            className={`relative ${isTargetHit && idx === 0 ? 'text-green-600 font-semibold' : ''}`}
          >
            الهدف {idx + 1}: {formatNumber(target.price)}
            {isTargetHit && idx === 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-500 rounded-sm" />
            )}
          </div>
        ))
      ) : (
        <div className="text-muted-foreground text-sm">لا توجد أهداف</div>
      )}
    </div>
  );
};
