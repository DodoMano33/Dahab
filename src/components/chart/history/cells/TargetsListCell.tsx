
import { TableCell } from "@/components/ui/table";
import { TargetsList } from "../TargetsList";
import { Badge } from "@/components/ui/badge";

interface Target {
  price: number;
  expectedTime: Date;
}

interface TargetsListCellProps {
  targets: Target[];
  isTargetHit: boolean;
}

export const TargetsListCell = ({ targets, isTargetHit }: TargetsListCellProps) => {
  // Simple validation of targets array
  const hasTargets = Array.isArray(targets) && targets.length > 0;
  
  return (
    <TableCell className="w-24 p-2">
      {!hasTargets && (
        <Badge variant="outline" className="text-xs mx-auto">
          لا توجد أهداف
        </Badge>
      )}
      
      {hasTargets && (
        <TargetsList 
          targets={targets} 
          isTargetHit={isTargetHit}
        />
      )}
    </TableCell>
  );
};
