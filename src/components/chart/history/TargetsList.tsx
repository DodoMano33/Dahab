import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Target {
  price: number;
  expectedTime: Date;
}

interface TargetsListProps {
  targets: Target[];
  isTargetHit: boolean;
}

export const TargetsList = ({ targets, isTargetHit }: TargetsListProps) => (
  <div className="space-y-2 text-center w-full">
    {targets.length > 0 ? (
      targets.map((target, idx) => (
        <div 
          key={idx}
          className={`relative ${isTargetHit && idx === 0 ? 'pb-4' : ''}`}
        >
          الهدف {idx + 1}: {target.price}
          <br />
          التوقيت: {format(target.expectedTime, 'PPpp', { locale: ar })}
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