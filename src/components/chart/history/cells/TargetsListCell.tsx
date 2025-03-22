
import { TableCell } from "@/components/ui/table";
import { TargetsList } from "../TargetsList";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface Target {
  price: number;
  expectedTime: Date;
}

interface TargetsListCellProps {
  targets: Target[];
  isTargetHit: boolean;
}

export const TargetsListCell = ({ targets, isTargetHit }: TargetsListCellProps) => {
  const [processedTargets, setProcessedTargets] = useState<Target[]>([]);
  const [hasValidTargets, setHasValidTargets] = useState(false);
  
  // معالجة وتنظيف الأهداف
  useEffect(() => {
    console.log("TargetsListCell received targets:", targets);
    
    // التحقق مما إذا كانت الأهداف موجودة وصالحة
    if (!targets || !Array.isArray(targets) || targets.length === 0) {
      console.log("No targets or empty array");
      setHasValidTargets(false);
      setProcessedTargets([]);
      return;
    }
    
    // معالجة الأهداف وتصفية الأهداف غير الصالحة
    const validTargets = targets
      .filter(target => target && (
        (typeof target.price === 'number' && !isNaN(target.price)) || 
        (typeof target.price === 'string' && !isNaN(Number(target.price)))
      ))
      .map(target => ({
        ...target,
        price: typeof target.price === 'string' ? Number(target.price) : target.price
      }));
    
    console.log("Processed targets:", validTargets);
    
    setProcessedTargets(validTargets);
    setHasValidTargets(validTargets.length > 0);
  }, [targets]);
  
  // إنشاء أهداف افتراضية إذا لم تكن هناك أهداف صالحة (سيظهر في المستقبل)
  const createDefaultTargets = () => {
    // هذه الوظيفة سيتم استخدامها في المستقبل لإنشاء أهداف افتراضية
    return [];
  };
  
  return (
    <TableCell className="w-24 p-2">
      {!hasValidTargets ? (
        <Badge variant="outline" className="text-xs mx-auto">
          لا توجد أهداف
        </Badge>
      ) : (
        <TargetsList 
          targets={processedTargets} 
          isTargetHit={isTargetHit}
        />
      )}
    </TableCell>
  );
};
