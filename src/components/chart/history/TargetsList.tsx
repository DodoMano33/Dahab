
interface Target {
  price: number;
  expectedTime: Date;
}

export interface TargetsListProps {
  targets: Target[];
  isTargetHit: boolean;
}

export const TargetsList = ({ targets, isTargetHit }: TargetsListProps) => {
  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return "غير محدد";
    return Number(num).toFixed(3);
  };
  
  return (
    <div className="space-y-2 text-center w-full">
      {targets.length > 0 ? (
        targets.map((target, idx) => (
          <div 
            key={idx}
            className={`relative ${isTargetHit && idx === 0 ? 'text-green-600 font-semibold' : ''}`}
          >
            الهدف {idx + 1}: {formatNumber(target?.price)}
            {isTargetHit && idx === 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-500 rounded-sm" />
            )}
          </div>
        ))
      ) : (
        <div>لا توجد أهداف</div>
      )}
    </div>
  );
};
