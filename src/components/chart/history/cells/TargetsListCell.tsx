
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
  const [hasValidTargets, setHasValidTargets] = useState(false);
  
  // التحقق من صحة مصفوفة الأهداف
  useEffect(() => {
    const validTargets = Array.isArray(targets) && targets.some(target => 
      target && typeof target.price === 'number' && !isNaN(target.price)
    );
    
    setHasValidTargets(validTargets);
    
    // طباعة تشخيصية
    console.log("TargetsListCell targets:", targets);
    console.log("TargetsListCell hasValidTargets:", validTargets);
  }, [targets]);
  
  return (
    <TableCell className="w-24 p-2">
      {!hasValidTargets && (
        <Badge variant="outline" className="text-xs mx-auto">
          لا توجد أهداف
        </Badge>
      )}
      
      {hasValidTargets && (
        <TargetsList 
          targets={targets} 
          isTargetHit={isTargetHit}
        />
      )}
    </TableCell>
  );
};
